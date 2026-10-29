/**
 * ATMOS — Meteorological Forecast Aggregator
 * Accurately aggregates 3-hour forecast slices by local calendar date into daily summaries
 */

export class ForecastAggregator {
  /**
   * Aggregates OpenWeatherMap 5-day / 3-hour list by local calendar date
   * @param {Array} list - 40 3-hour forecast entries from /data/2.5/forecast
   * @param {number} timezoneOffsetSeconds - Shift in seconds from UTC (e.g. 32400 for UTC+9)
   * @param {string} unitSystem - 'metric' or 'imperial'
   * @returns {Object} { dailyForecasts: Array, weekMin: number, weekMax: number }
   */
  static aggregateOWMForecast(list, timezoneOffsetSeconds = 0, unitSystem = 'metric') {
    if (!Array.isArray(list) || list.length === 0) {
      return { dailyForecasts: [], weekMin: 0, weekMax: 0 };
    }

    // Map entries into local calendar day buckets
    const daysMap = new Map();

    list.forEach(entry => {
      // Offset entry UTC seconds by city timezone
      const localEpochMs = (entry.dt + timezoneOffsetSeconds) * 1000;
      const localDateObj = new Date(localEpochMs);
      
      // Use UTC getters on shifted epoch to get exact local calendar day
      const year = localDateObj.getUTCFullYear();
      const month = String(localDateObj.getUTCMonth() + 1).padStart(2, '0');
      const day = String(localDateObj.getUTCDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      const localHour = localDateObj.getUTCHours();

      if (!daysMap.has(dateKey)) {
        daysMap.set(dateKey, {
          dateKey,
          localEpochMs,
          entries: []
        });
      }

      daysMap.get(dateKey).entries.push({
        ...entry,
        localHour
      });
    });

    const dailyForecasts = [];
    let weekMin = Infinity;
    let weekMax = -Infinity;

    // Process each calendar day
    for (const [dateKey, dayData] of daysMap.entries()) {
      const entries = dayData.entries;
      if (entries.length === 0) continue;

      // Calculate absolute minimum and maximum temperatures across all 3h periods for this local day
      const minTemp = Math.min(...entries.map(e => e.main.temp_min));
      const maxTemp = Math.max(...entries.map(e => e.main.temp_max));

      if (minTemp < weekMin) weekMin = minTemp;
      if (maxTemp > weekMax) weekMax = maxTemp;

      // Select representative weather entry:
      // Prefer afternoon/midday entry (between 12:00 and 15:00) for daytime conditions,
      // or entry with highest precipitation probability / severity
      let representativeEntry = entries.find(e => e.localHour >= 12 && e.localHour <= 15);
      if (!representativeEntry) {
        // Fall back to entry with highest precipitation or middle entry
        representativeEntry = entries.reduce((prev, curr) => 
          ((curr.pop || 0) > (prev.pop || 0)) ? curr : prev, entries[Math.floor(entries.length / 2)]
        );
      }

      const weatherObj = representativeEntry.weather && representativeEntry.weather[0] 
        ? representativeEntry.weather[0] 
        : { id: 800, main: 'Clear', description: 'Clear sky', icon: '01d' };

      // Map weather ID to condition key
      const conditionKey = this.mapOwmWeatherCode(weatherObj.id);

      // Average humidity and max wind
      const avgHumidity = Math.round(entries.reduce((sum, e) => sum + e.main.humidity, 0) / entries.length);
      const maxWind = Math.max(...entries.map(e => e.wind.speed));
      const maxPop = Math.round(Math.max(...entries.map(e => e.pop || 0)) * 100);

      // Format human-readable date & day name
      const dateObj = new Date(dayData.localEpochMs);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
      const monthName = dateObj.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
      const dayNum = dateObj.getUTCDate();

      dailyForecasts.push({
        dateKey,
        dayName,
        dateFormatted: `${monthName} ${dayNum}`,
        minTemp: Math.round(minTemp),
        maxTemp: Math.round(maxTemp),
        conditionKey,
        description: weatherObj.description ? this.capitalize(weatherObj.description) : weatherObj.main,
        iconCode: weatherObj.icon,
        humidity: avgHumidity,
        maxWind: Math.round(maxWind),
        pop: maxPop
      });
    }

    // Limit to 5 days
    const fiveDays = dailyForecasts.slice(0, 5);

    return {
      dailyForecasts: fiveDays,
      weekMin: Math.round(weekMin),
      weekMax: Math.round(weekMax)
    };
  }

  /**
   * Aggregates Open-Meteo daily forecast arrays into identical normalized structure
   */
  static aggregateOpenMeteoDaily(dailyData, unitSystem = 'metric') {
    if (!dailyData || !dailyData.time) {
      return { dailyForecasts: [], weekMin: 0, weekMax: 0 };
    }

    const dailyForecasts = [];
    let weekMin = Infinity;
    let weekMax = -Infinity;

    const count = Math.min(5, dailyData.time.length);

    for (let i = 0; i < count; i++) {
      const dateStr = dailyData.time[i]; // 'YYYY-MM-DD'
      const minTemp = Math.round(dailyData.temperature_2m_min[i]);
      const maxTemp = Math.round(dailyData.temperature_2m_max[i]);
      const wmoCode = dailyData.weather_code[i];
      const conditionKey = this.mapWmoCode(wmoCode);
      const description = this.getWmoDescription(wmoCode);

      if (minTemp < weekMin) weekMin = minTemp;
      if (maxTemp > weekMax) weekMax = maxTemp;

      const dateObj = new Date(`${dateStr}T12:00:00Z`);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
      const monthName = dateObj.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
      const dayNum = dateObj.getUTCDate();

      dailyForecasts.push({
        dateKey: dateStr,
        dayName,
        dateFormatted: `${monthName} ${dayNum}`,
        minTemp,
        maxTemp,
        conditionKey,
        description,
        uvMax: dailyData.uv_index_max ? dailyData.uv_index_max[i] : null,
        pop: 0
      });
    }

    return {
      dailyForecasts,
      weekMin,
      weekMax
    };
  }

  /**
   * Maps OpenWeatherMap weather code IDs to condition keys
   */
  static mapOwmWeatherCode(id) {
    if (id >= 200 && id < 300) return 'thunderstorm';
    if (id >= 300 && id < 400) return 'drizzle';
    if (id >= 500 && id < 505) return 'rain';
    if (id >= 511 && id < 600) return 'heavy-rain';
    if (id >= 600 && id < 700) return 'snow';
    if (id >= 700 && id < 800) return 'mist';
    if (id === 800) return 'clear';
    if (id === 801) return 'few-clouds';
    if (id === 802) return 'scattered-clouds';
    if (id >= 803) return 'clouds';
    return 'clear';
  }

  /**
   * Maps WMO Weather Interpretation Codes to condition keys
   */
  static mapWmoCode(code) {
    if (code === 0) return 'clear';
    if (code === 1 || code === 2) return 'few-clouds';
    if (code === 3) return 'clouds';
    if (code === 45 || code === 48) return 'mist';
    if (code >= 51 && code <= 55) return 'drizzle';
    if (code >= 61 && code <= 65) return 'rain';
    if (code >= 71 && code <= 77) return 'snow';
    if (code >= 80 && code <= 82) return 'rain';
    if (code >= 85 && code <= 86) return 'snow';
    if (code >= 95 && code <= 99) return 'thunderstorm';
    return 'clear';
  }

  static getWmoDescription(code) {
    const descriptions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy haze',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snowfall',
      73: 'Moderate snowfall',
      75: 'Heavy snowfall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with hail',
      99: 'Severe thunderstorm'
    };
    return descriptions[code] || 'Scattered conditions';
  }

  static capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
