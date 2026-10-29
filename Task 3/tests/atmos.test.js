/**
 * Automated Test Suite for ATMOS Weather Telemetry
 * Run with Node.js built-in test runner: node --test tests/atmos.test.js
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { ForecastAggregator } from '../src/js/aggregator.js';
import { AtmosphereStoryGenerator } from '../src/js/story.js';
import { WeatherApiService } from '../src/js/api.js';
import { StorageManager } from '../src/js/storage.js';
import { CONFIG } from '../src/js/config.js';

describe('1. Forecast Aggregator Tests', () => {
  test('Aggregates 3-hour OpenWeatherMap forecast into daily min/max by local calendar date', () => {
    // Generate synthetic 3-hour entries for 2 days (16 entries total)
    // Starting at 2026-10-29 00:00:00 UTC
    const mockList = [];
    const baseTimeUtc = 1793232000; // Epoch for test date
    const timezoneOffset = 32400; // Tokyo UTC+9 (9 * 3600)

    for (let i = 0; i < 16; i++) {
      const dt = baseTimeUtc + (i * 3 * 3600);
      // Simulate varying temperatures between 12°C and 22°C on Day 1, and 10°C to 18°C on Day 2
      const tempMin = i < 8 ? 12 + (i % 3) : 10 + (i % 2);
      const tempMax = i < 8 ? 19 + (i % 4) : 16 + (i % 3);

      mockList.push({
        dt,
        main: {
          temp: (tempMin + tempMax) / 2,
          temp_min: tempMin,
          temp_max: tempMax,
          humidity: 60 + i,
          pressure: 1016
        },
        weather: [
          { id: i % 2 === 0 ? 800 : 802, main: 'Clouds', description: 'Scattered clouds', icon: '02d' }
        ],
        wind: { speed: 4.5, deg: 180 },
        clouds: { all: 40 },
        pop: 0.1
      });
    }

    const result = ForecastAggregator.aggregateOWMForecast(mockList, timezoneOffset, 'metric');

    assert.ok(result.dailyForecasts.length > 0, 'Should aggregate into daily forecasts');
    assert.ok(result.weekMin <= result.weekMax, 'Week min should be less than or equal to week max');

    const firstDay = result.dailyForecasts[0];
    assert.ok(firstDay.dayName, 'First day should have a day name');
    assert.ok(firstDay.dateFormatted, 'First day should have formatted date');
    assert.strictEqual(typeof firstDay.minTemp, 'number');
    assert.strictEqual(typeof firstDay.maxTemp, 'number');
    assert.ok(firstDay.minTemp <= firstDay.maxTemp, 'Daily min should be <= daily max');
  });

  test('Correctly maps weather condition codes', () => {
    assert.strictEqual(ForecastAggregator.mapOwmWeatherCode(800), 'clear');
    assert.strictEqual(ForecastAggregator.mapOwmWeatherCode(500), 'rain');
    assert.strictEqual(ForecastAggregator.mapOwmWeatherCode(502), 'rain');
    assert.strictEqual(ForecastAggregator.mapOwmWeatherCode(601), 'snow');
    assert.strictEqual(ForecastAggregator.mapOwmWeatherCode(211), 'thunderstorm');
    assert.strictEqual(ForecastAggregator.mapOwmWeatherCode(701), 'mist');
    assert.strictEqual(ForecastAggregator.mapOwmWeatherCode(803), 'clouds');
  });

  test('Correctly aggregates Open-Meteo daily forecast arrays', () => {
    const mockDaily = {
      time: ['2026-10-29', '2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02'],
      temperature_2m_max: [22.4, 21.0, 19.5, 18.2, 20.1],
      temperature_2m_min: [14.1, 13.5, 12.0, 11.4, 13.0],
      weather_code: [0, 2, 61, 3, 1],
      uv_index_max: [5.2, 4.8, 2.1, 3.4, 5.0]
    };

    const result = ForecastAggregator.aggregateOpenMeteoDaily(mockDaily, 'metric');
    assert.strictEqual(result.dailyForecasts.length, 5);
    assert.strictEqual(result.dailyForecasts[0].maxTemp, 22);
    assert.strictEqual(result.dailyForecasts[0].minTemp, 14);
    assert.strictEqual(result.dailyForecasts[0].conditionKey, 'clear');
    assert.strictEqual(result.dailyForecasts[2].conditionKey, 'rain');
    assert.strictEqual(result.weekMin, 11);
    assert.strictEqual(result.weekMax, 22);
  });
});

describe('2. Atmospheric Meteorological Story Generator Tests', () => {
  test('Generates deterministic narrative with sub-zero freeze', () => {
    const telemetry = {
      city: 'Reykjavík',
      temp: -4,
      feelsLike: -9,
      humidity: 85,
      pressure: 998,
      windSpeed: 28,
      windDirectionCardinal: 'NNE',
      conditionKey: 'snow',
      description: 'Light snow',
      uv: 0,
      unitSystem: 'metric'
    };

    const story = AtmosphereStoryGenerator.generateStory(telemetry);
    assert.ok(story.narrative.includes('Sub-freezing'));
    assert.ok(story.narrative.includes('depression'));
    assert.ok(story.pills.some(p => p.text.includes('Freeze')));
  });

  test('Generates narrative for warm high-pressure conditions', () => {
    const telemetry = {
      city: 'Tokyo',
      temp: 24,
      feelsLike: 24,
      humidity: 50,
      pressure: 1022,
      windSpeed: 12,
      windDirectionCardinal: 'SSW',
      conditionKey: 'clear',
      description: 'Clear sky',
      uv: 6,
      unitSystem: 'metric'
    };

    const story = AtmosphereStoryGenerator.generateStory(telemetry);
    assert.ok(story.narrative.includes('high-pressure ridge'));
    assert.ok(story.narrative.includes('Tokyo'));
    assert.ok(story.pills.some(p => p.text.includes('High Pressure Ridge')));
  });
});

describe('3. Compass Cardinal & Unit Conversion Tests', () => {
  test('Degrees to Cardinal conversion covers 360 degrees', () => {
    assert.strictEqual(WeatherApiService.degreesToCardinal(0), 'N');
    assert.strictEqual(WeatherApiService.degreesToCardinal(90), 'E');
    assert.strictEqual(WeatherApiService.degreesToCardinal(180), 'S');
    assert.strictEqual(WeatherApiService.degreesToCardinal(270), 'W');
    assert.strictEqual(WeatherApiService.degreesToCardinal(45), 'NE');
    assert.strictEqual(WeatherApiService.degreesToCardinal(225), 'SW');
  });
});

describe('4. Live Weather Telemetry Real-World Integration Tests', () => {
  test('Retrieves real-time global telemetry for Tokyo via Open-Meteo feed', async () => {
    const result = await WeatherApiService.fetchFromOpenMeteo('Tokyo', 'metric', null);

    assert.ok(result, 'Result should exist');
    assert.strictEqual(result.city, 'Tokyo');
    assert.strictEqual(typeof result.temp, 'number');
    assert.strictEqual(typeof result.humidity, 'number');
    assert.strictEqual(typeof result.pressure, 'number');
    assert.ok(result.dailyForecasts.length >= 5, 'Should have 5-day forecast');
    assert.ok(result.conditionKey, 'Should have condition key');
    assert.ok(result.description, 'Should have description');
  });

  test('Retrieves real-time global telemetry for Reykjavik via Open-Meteo feed', async () => {
    const result = await WeatherApiService.fetchFromOpenMeteo('Reykjavik', 'metric', null);

    assert.ok(result, 'Result should exist');
    assert.ok(result.city.includes('Reykjav'), 'Should match Reykjavik');
    assert.strictEqual(typeof result.temp, 'number');
    assert.strictEqual(typeof result.windSpeed, 'number');
  });

  test('Handles non-existent city gracefully by throwing CITY_NOT_FOUND error', async () => {
    await assert.rejects(
      async () => {
        await WeatherApiService.fetchFromOpenMeteo('NonExistentCityXYZ999999', 'metric', null);
      },
      (err) => {
        return err.type === 'CITY_NOT_FOUND';
      }
    );
  });
});

describe('5. OpenWeatherMap API & Error Code Verification Tests', () => {
  test('Throws API_KEY_ERROR when no key is configured for OpenWeatherMap', async () => {
    await assert.rejects(
      async () => {
        // Without API key
        await WeatherApiService.fetchFromOpenWeatherMap('London', 'metric', null);
      },
      (err) => {
        return err.type === 'API_KEY_ERROR';
      }
    );
  });
});

describe('6. User Requested Global Hubs & Alias Tests (Sri Lanka, India, UK, USA, Melborn)', () => {
  test('Normalizes user alias queries correctly', () => {
    assert.strictEqual(WeatherApiService.normalizeQuery('SRI LANKA- COLOMBO'), 'Colombo');
    assert.strictEqual(WeatherApiService.normalizeQuery('INDIA - DILLI'), 'Delhi');
    assert.strictEqual(WeatherApiService.normalizeQuery('UK'), 'London');
    assert.strictEqual(WeatherApiService.normalizeQuery('USA'), 'New York');
    assert.strictEqual(WeatherApiService.normalizeQuery('MELBORN'), 'Melbourne');
  });

  test('Retrieves live weather for Colombo (Sri Lanka)', async () => {
    const result = await WeatherApiService.fetchFromOpenMeteo('Colombo', 'metric', null);
    assert.ok(result, 'Should return data for Colombo');
    assert.strictEqual(result.city, 'Colombo');
    assert.strictEqual(typeof result.temp, 'number');
  });

  test('Retrieves live weather for Melbourne (Melborn)', async () => {
    const result = await WeatherApiService.fetchFromOpenMeteo('Melbourne', 'metric', null);
    assert.ok(result, 'Should return data for Melbourne');
    assert.strictEqual(result.city, 'Melbourne');
    assert.strictEqual(typeof result.temp, 'number');
  });
});
