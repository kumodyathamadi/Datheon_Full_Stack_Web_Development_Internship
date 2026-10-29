/**
 * ATMOS — Application Configuration & Constants
 */

export const CONFIG = {
  APP_NAME: 'ATMOS',
  TAGLINE: 'Weather, in a different light',
  DEFAULT_CITY: 'Colombo',
  
  // Storage Keys
  STORAGE_KEYS: {
    API_KEY: 'atmos_owm_api_key',
    PROVIDER: 'atmos_weather_provider',
    UNITS: 'atmos_unit_system',
    THEME: 'atmos_color_theme',
    RECENTS: 'atmos_recent_searches',
    LAST_CITY: 'atmos_last_city'
  },

  // Units
  UNITS: {
    METRIC: 'metric',
    IMPERIAL: 'imperial'
  },

  // Providers
  PROVIDERS: {
    OPENWEATHERMAP: 'openweathermap',
    OPENMETEO: 'openmeteo'
  },

  // OpenWeatherMap Endpoints
  OWM: {
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    GEO_URL: 'https://api.openweathermap.org/geo/1.0'
  },

  // Open-Meteo Endpoints
  OPEN_METEO: {
    GEO_URL: 'https://geocoding-api.open-meteo.com/v1/search',
    BASE_URL: 'https://api.open-meteo.com/v1/forecast'
  },

  // Curated Stations Requested: Sri Lanka - Colombo, India - Dilli, UK, USA, Melborn
  DEFAULT_HUBS: [
    { query: 'Colombo', name: 'SRI LANKA - COLOMBO', country: 'LK', desc: 'Western Province Coastal' },
    { query: 'Delhi', name: 'INDIA - DILLI', country: 'IN', desc: 'National Capital Region' },
    { query: 'London', name: 'UK', country: 'GB', desc: 'United Kingdom Hub' },
    { query: 'New York', name: 'USA', country: 'US', desc: 'United States Station' },
    { query: 'Melbourne', name: 'MELBORN', country: 'AU', desc: 'Victoria Southern Oceanic' }
  ]
};

/**
 * Returns the currently configured OpenWeatherMap API key.
 * Checks localStorage first (user-entered in app UI), then import.meta.env.
 */
export function getOpenWeatherApiKey() {
  if (typeof localStorage !== 'undefined') {
    const customKey = localStorage.getItem(CONFIG.STORAGE_KEYS.API_KEY);
    if (customKey && customKey.trim().length > 0) {
      return customKey.trim();
    }
  }
  const envKey = import.meta.env ? import.meta.env.VITE_OPENWEATHER_API_KEY : '';
  if (envKey && envKey.trim().length > 0 && !envKey.includes('your_openweather')) {
    return envKey.trim();
  }
  return '';
}
