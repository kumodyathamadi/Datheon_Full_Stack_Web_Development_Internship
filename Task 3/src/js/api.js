/**
 * ATMOS — Unified Weather Telemetry Service
 * Robust, concurrent-safe API client supporting OpenWeatherMap and Open-Meteo
 */

import { CONFIG, getOpenWeatherApiKey } from './config.js';
import { StorageManager } from './storage.js';
import { ForecastAggregator } from './aggregator.js';

export class WeatherApiError extends Error {
  constructor(type, message, originalError = null) {
    super(message);
    this.name = 'WeatherApiError';
    this.type = type; // 'API_KEY_ERROR' | 'CITY_NOT_FOUND' | 'RATE_LIMIT' | 'NETWORK_ERROR' | 'GENERIC_ERROR'
    this.originalError = originalError;
  }
}

export class WeatherApiService {
  static currentRequestId = 0;
  static currentAbortController = null;
  static queryCache = new Map();
  static CACHE_TTL_MS = 120000; // 2 minutes

  /**
   * Normalizes city queries and maps aliases/regions
   */
  static normalizeQuery(query) {
    if (!query) return '';
    const clean = query.trim();
    const lower = clean.toLowerCase().replace(/\s+/g, ' ');

    const ALIASES = {
      'sri lanka- colombo': 'Colombo',
      'sri lanka - colombo': 'Colombo',
      'sri lanka': 'Colombo',
      'colombo, sri lanka': 'Colombo',
      'india - dilli': 'Delhi',
      'india- dilli': 'Delhi',
      'dilli': 'Delhi',
      'new dilli': 'New Delhi',
      'uk': 'London',
      'united kingdom': 'London',
      'usa': 'New York',
      'united states': 'New York',
      'melborn': 'Melbourne',
      'melbourne, australia': 'Melbourne'
    };

    return ALIASES[lower] || clean;
  }

  /**
   * Main entrypoint to search weather by city name
   */
  static async searchCityWeather(query, unitSystem = 'metric') {
    const rawTrimmed = query ? query.trim() : '';
    if (!rawTrimmed) {
      throw new WeatherApiError('CITY_NOT_FOUND', 'Please enter a valid city name.');
    }
    const trimmed = this.normalizeQuery(rawTrimmed);

    // Check in-flight cancellation
    if (this.currentAbortController) {
      this.currentAbortController.abort();
    }
    this.currentAbortController = new AbortController();
    const requestId = ++this.currentRequestId;
    const signal = this.currentAbortController.signal;

    // Check in-memory cache
    const cacheKey = `${trimmed.toLowerCase()}_${unitSystem}_${StorageManager.getProvider()}`;
    const cached = this.queryCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < this.CACHE_TTL_MS)) {
      return cached.data;
    }

    try {
      const provider = StorageManager.getProvider();
      let result = null;

      if (provider === CONFIG.PROVIDERS.OPENWEATHERMAP) {
        result = await this.fetchFromOpenWeatherMap(trimmed, unitSystem, signal);
      } else {
        result = await this.fetchFromOpenMeteo(trimmed, unitSystem, signal);
      }

      // Check if another request superceded this one
      if (requestId !== this.currentRequestId) {
        return null; // Silent discard for stale response
      }

      // Cache result
      this.queryCache.set(cacheKey, {
        timestamp: Date.now(),
        data: result
      });

      // Save as last successful city
      StorageManager.setLastCity(result.city);
      StorageManager.saveRecentSearch({ name: result.city, country: result.country });

      return result;
    } catch (err) {
      if (err.name === 'AbortError') {
        return null;
      }
      throw err;
    }
  }

  /**
   * Search by Geographic Coordinates (Geolocation)
   */
  static async searchCoordsWeather(lat, lon, unitSystem = 'metric') {
    if (this.currentAbortController) {
      this.currentAbortController.abort();
    }
    this.currentAbortController = new AbortController();
    const requestId = ++this.currentRequestId;
    const signal = this.currentAbortController.signal;

    const provider = StorageManager.getProvider();
    let result = null;

    if (provider === CONFIG.PROVIDERS.OPENWEATHERMAP) {
      result = await this.fetchFromOwmByCoords(lat, lon, unitSystem, signal);
    } else {
      result = await this.fetchFromOpenMeteoByCoords(lat, lon, 'Local Station', unitSystem, signal);
    }

    if (requestId !== this.currentRequestId) {
      return null;
    }

    if (result) {
      StorageManager.setLastCity(result.city);
      StorageManager.saveRecentSearch({ name: result.city, country: result.country });
    }

    return result;
  }

  /* ==========================================================================
     OpenWeatherMap Implementation (/data/2.5/weather & /data/2.5/forecast)
     ========================================================================== */

  static async fetchFromOpenWeatherMap(city, unitSystem, signal) {
    const apiKey = getOpenWeatherApiKey();

    if (!apiKey) {
      throw new WeatherApiError(
        'API_KEY_ERROR',
        'OpenWeatherMap API Key is not configured. Please enter your API key in settings or switch to Open-Meteo instant live data.'
      );
    }

    const unitsParam = unitSystem === 'imperial' ? 'imperial' : 'metric';
    const weatherUrl = `${CONFIG.OWM.BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${unitsParam}&appid=${apiKey}`;
    const forecastUrl = `${CONFIG.OWM.BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${unitsParam}&appid=${apiKey}`;

    let weatherRes, forecastRes;

    try {
      [weatherRes, forecastRes] = await Promise.all([
        fetch(weatherUrl, { signal }),
        fetch(forecastUrl, { signal })
      ]);
    } catch (netErr) {
      if (netErr.name === 'AbortError') throw netErr;
      throw new WeatherApiError(
        'NETWORK_ERROR',
        'Network connection lost. Please verify your internet connection and try again.',
        netErr
      );
    }

    // Handle OWM Status Codes
    if (weatherRes.status === 401 || forecastRes.status === 401) {
      throw new WeatherApiError(
        'API_KEY_ERROR',
        'Invalid OpenWeatherMap API key or key pending activation. Please check your key or switch to Open-Meteo for keyless real-time data.'
      );
    }

    if (weatherRes.status === 404 || forecastRes.status === 404) {
      throw new WeatherApiError(
        'CITY_NOT_FOUND',
        `We couldn't find "${city}". Check the spelling or try adding a country code (e.g. "Paris, FR").`
      );
    }

    if (weatherRes.status === 429 || forecastRes.status === 429) {
      throw new WeatherApiError(
        'RATE_LIMIT',
        'OpenWeatherMap API request limit reached. Please wait a minute or switch to Open-Meteo.'
      );
    }

    if (!weatherRes.ok || !forecastRes.ok) {
      throw new WeatherApiError(
        'GENERIC_ERROR',
        `Weather service responded with error code ${weatherRes.status}.`
      );
    }

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    return this.normalizeOwmData(weatherData, forecastData, unitSystem);
  }

  static async fetchFromOwmByCoords(lat, lon, unitSystem, signal) {
    const apiKey = getOpenWeatherApiKey();
    if (!apiKey) {
      throw new WeatherApiError('API_KEY_ERROR', 'OpenWeatherMap API Key is not configured.');
    }

    const unitsParam = unitSystem === 'imperial' ? 'imperial' : 'metric';
    const weatherUrl = `${CONFIG.OWM.BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${unitsParam}&appid=${apiKey}`;
    const forecastUrl = `${CONFIG.OWM.BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${unitsParam}&appid=${apiKey}`;

    const [weatherRes, forecastRes] = await Promise.all([
      fetch(weatherUrl, { signal }),
      fetch(forecastUrl, { signal })
    ]);

    if (!weatherRes.ok) {
      throw new WeatherApiError('GENERIC_ERROR', 'Unable to fetch weather for current coordinates.');
    }

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();
    return this.normalizeOwmData(weatherData, forecastData, unitSystem);
  }

  static normalizeOwmData(cur, fcast, unitSystem) {
    const timezoneOffset = cur.timezone !== undefined ? cur.timezone : 0;
    
    // Aggregation of 5-day / 3-hour entries by local calendar date
    const { dailyForecasts, weekMin, weekMax } = ForecastAggregator.aggregateOWMForecast(
      fcast.list,
      timezoneOffset,
      unitSystem
    );

    // Day/Night determination based on local sunrise/sunset
    const currentUtcSec = Math.floor(Date.now() / 1000);
    const isDay = cur.sys && cur.sys.sunrise && cur.sys.sunset
      ? currentUtcSec >= cur.sys.sunrise && currentUtcSec < cur.sys.sunset
      : true;

    const weatherObj = cur.weather && cur.weather[0] ? cur.weather[0] : { id: 800, main: 'Clear', description: 'Clear sky' };
    const conditionKey = ForecastAggregator.mapOwmWeatherCode(weatherObj.id);

    // Calculate Dew Point: T - ((100 - RH) / 5)
    const tempC = unitSystem === 'imperial' ? ((cur.main.temp - 32) * 5) / 9 : cur.main.temp;
    const dewPointC = tempC - ((100 - cur.main.humidity) / 5);
    const dewPoint = unitSystem === 'imperial' ? (dewPointC * 9) / 5 + 32 : dewPointC;

    // Wind speed conversion and cardinal heading
    const rawWindSpeed = cur.wind ? cur.wind.speed : 0;
    // OWM metric gives m/s -> convert to km/h for standard consumer readability
    const windSpeed = unitSystem === 'imperial' ? rawWindSpeed : rawWindSpeed * 3.6;
    const windDeg = cur.wind && cur.wind.deg !== undefined ? cur.wind.deg : 0;
    const windCardinal = this.degreesToCardinal(windDeg);

    // Visibility: OWM provides meters -> convert to km or miles
    const visMeters = cur.visibility !== undefined ? cur.visibility : 10000;
    const visibility = unitSystem === 'imperial' 
      ? (visMeters / 1609.34).toFixed(1)
      : (visMeters / 1000).toFixed(1);

    // High and Low today: from dailyForecasts today or cur.main
    const todayForecast = dailyForecasts[0];
    const tempMin = todayForecast ? todayForecast.minTemp : Math.round(cur.main.temp_min);
    const tempMax = todayForecast ? todayForecast.maxTemp : Math.round(cur.main.temp_max);

    return {
      provider: 'OpenWeatherMap',
      city: cur.name,
      country: cur.sys && cur.sys.country ? cur.sys.country : '',
      coord: cur.coord ? { lat: cur.coord.lat, lon: cur.coord.lon } : { lat: 0, lon: 0 },
      timezoneOffset,
      temp: Math.round(cur.main.temp),
      feelsLike: Math.round(cur.main.feels_like),
      tempMin,
      tempMax,
      humidity: Math.round(cur.main.humidity),
      dewPoint: Math.round(dewPoint),
      pressure: Math.round(cur.main.pressure),
      windSpeed: Math.round(windSpeed),
      windDeg,
      windDirectionCardinal: windCardinal,
      visibility,
      uv: null, // Free tier /weather endpoint does not include UV
      conditionKey,
      description: this.capitalize(weatherObj.description || weatherObj.main),
      isDay,
      sunrise: cur.sys ? cur.sys.sunrise : null,
      sunset: cur.sys ? cur.sys.sunset : null,
      dailyForecasts,
      weekMin,
      weekMax,
      clouds: cur.clouds ? cur.clouds.all : 0
    };
  }

  /* ==========================================================================
     Open-Meteo Implementation (Keyless Instant Live Worldwide Telemetry)
     ========================================================================== */

  static async fetchFromOpenMeteo(city, unitSystem, signal) {
    // 1. Geocode city name to lat/lon
    const geoUrl = `${CONFIG.OPEN_METEO.GEO_URL}?name=${encodeURIComponent(city)}&count=5&language=en&format=json`;
    let geoRes;
    try {
      geoRes = await fetch(geoUrl, { signal });
    } catch (e) {
      if (e.name === 'AbortError') throw e;
      throw new WeatherApiError('NETWORK_ERROR', 'Network connection error. Check your connection.', e);
    }

    if (!geoRes.ok) {
      throw new WeatherApiError('CITY_NOT_FOUND', `Could not search coordinates for "${city}".`);
    }

    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      throw new WeatherApiError('CITY_NOT_FOUND', `We couldn't find "${city}". Check the spelling and try again.`);
    }

    const topResult = geoData.results[0];
    const cityName = topResult.name;
    const country = topResult.country_code ? topResult.country_code.toUpperCase() : '';

    return this.fetchFromOpenMeteoByCoords(topResult.latitude, topResult.longitude, cityName, unitSystem, signal, country);
  }

  static async fetchFromOpenMeteoByCoords(lat, lon, cityName = 'Station', unitSystem = 'metric', signal = null, countryCode = '') {
    const tempUnit = unitSystem === 'imperial' ? 'fahrenheit' : 'celsius';
    const windUnit = unitSystem === 'imperial' ? 'mph' : 'kmh';

    const url = `${CONFIG.OPEN_METEO.BASE_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}`;

    let res;
    try {
      res = await fetch(url, { signal });
    } catch (e) {
      if (e.name === 'AbortError') throw e;
      throw new WeatherApiError('NETWORK_ERROR', 'Failed to retrieve telemetry data.', e);
    }

    if (!res.ok) {
      throw new WeatherApiError('GENERIC_ERROR', `Weather service returned error code ${res.status}`);
    }

    const data = await res.json();
    return this.normalizeOpenMeteoData(data, cityName, countryCode, lat, lon, unitSystem);
  }

  static normalizeOpenMeteoData(data, cityName, countryCode, lat, lon, unitSystem) {
    const cur = data.current;
    const daily = data.daily;
    const timezoneOffset = data.utc_offset_seconds || 0;

    const { dailyForecasts, weekMin, weekMax } = ForecastAggregator.aggregateOpenMeteoDaily(daily, unitSystem);

    const conditionKey = ForecastAggregator.mapWmoCode(cur.weather_code);
    const description = ForecastAggregator.getWmoDescription(cur.weather_code);

    const temp = Math.round(cur.temperature_2m);
    const feelsLike = Math.round(cur.apparent_temperature);
    const humidity = Math.round(cur.relative_humidity_2m);
    const pressure = Math.round(cur.surface_pressure);
    const windSpeed = Math.round(cur.wind_speed_10m);
    const windDeg = cur.wind_direction_10m || 0;
    const windCardinal = this.degreesToCardinal(windDeg);

    // Dew point
    const tempC = unitSystem === 'imperial' ? ((temp - 32) * 5) / 9 : temp;
    const dewPointC = tempC - ((100 - humidity) / 5);
    const dewPoint = unitSystem === 'imperial' ? Math.round((dewPointC * 9) / 5 + 32) : Math.round(dewPointC);

    // Sunrise and sunset
    let sunriseSec = null;
    let sunsetSec = null;
    if (daily && daily.sunrise && daily.sunrise[0]) {
      sunriseSec = Math.floor(new Date(daily.sunrise[0]).getTime() / 1000);
    }
    if (daily && daily.sunset && daily.sunset[0]) {
      sunsetSec = Math.floor(new Date(daily.sunset[0]).getTime() / 1000);
    }

    const uv = daily && daily.uv_index_max && daily.uv_index_max[0] !== undefined
      ? Math.round(daily.uv_index_max[0])
      : null;

    const todayForecast = dailyForecasts[0];
    const tempMin = todayForecast ? todayForecast.minTemp : temp;
    const tempMax = todayForecast ? todayForecast.maxTemp : temp;

    return {
      provider: 'Open-Meteo',
      city: cityName,
      country: countryCode,
      coord: { lat, lon },
      timezoneOffset,
      temp,
      feelsLike,
      tempMin,
      tempMax,
      humidity,
      dewPoint,
      pressure,
      windSpeed,
      windDeg,
      windDirectionCardinal: windCardinal,
      visibility: '10.0', // Standard clear optical visibility baseline
      uv,
      conditionKey,
      description,
      isDay: cur.is_day === 1,
      sunrise: sunriseSec,
      sunset: sunsetSec,
      dailyForecasts,
      weekMin,
      weekMax,
      clouds: cur.cloud_cover || 0
    };
  }

  /* ==========================================================================
     Helper Utilities
     ========================================================================== */

  static degreesToCardinal(deg) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round((deg % 360) / 22.5) % 16;
    return directions[index];
  }

  static capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
