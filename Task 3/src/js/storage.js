/**
 * ATMOS — Local Storage & Preferences Manager
 */

import { CONFIG, getOpenWeatherApiKey } from './config.js';

export class StorageManager {
  static hasStorage() {
    return typeof localStorage !== 'undefined';
  }

  /**
   * Get active temperature & telemetry unit ('metric' | 'imperial')
   */
  static getUnitSystem() {
    if (!this.hasStorage()) return CONFIG.UNITS.METRIC;
    return localStorage.getItem(CONFIG.STORAGE_KEYS.UNITS) || CONFIG.UNITS.METRIC;
  }

  static setUnitSystem(unit) {
    if (!this.hasStorage()) return;
    if (unit === CONFIG.UNITS.METRIC || unit === CONFIG.UNITS.IMPERIAL) {
      localStorage.setItem(CONFIG.STORAGE_KEYS.UNITS, unit);
    }
  }

  /**
   * Get UI color theme ('dark' | 'light')
   */
  static getTheme() {
    if (!this.hasStorage()) return 'dark';
    const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME);
    if (saved) return saved;
    // Default to dark as primary experience
    return 'dark';
  }

  static setTheme(theme) {
    if (!this.hasStorage()) return;
    localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, theme);
  }

  /**
   * Get active weather provider ('openweathermap' | 'openmeteo')
   */
  static getProvider() {
    if (this.hasStorage()) {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.PROVIDER);
      if (saved) return saved;
    }
    
    // If an OpenWeatherMap API key is configured, default to OpenWeatherMap.
    // Otherwise, default to openmeteo for instant keyless live data!
    const key = getOpenWeatherApiKey();
    return key ? CONFIG.PROVIDERS.OPENWEATHERMAP : CONFIG.PROVIDERS.OPENMETEO;
  }

  static setProvider(provider) {
    if (!this.hasStorage()) return;
    localStorage.setItem(CONFIG.STORAGE_KEYS.PROVIDER, provider);
  }

  /**
   * Save custom OpenWeatherMap API key in localStorage
   */
  static setCustomApiKey(key) {
    if (!this.hasStorage()) return;
    if (key && key.trim()) {
      localStorage.setItem(CONFIG.STORAGE_KEYS.API_KEY, key.trim());
    } else {
      localStorage.removeItem(CONFIG.STORAGE_KEYS.API_KEY);
    }
  }

  /**
   * Recent searches management
   */
  static getRecentSearches() {
    if (!this.hasStorage()) return [];
    try {
      const data = localStorage.getItem(CONFIG.STORAGE_KEYS.RECENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveRecentSearch(cityData) {
    if (!this.hasStorage() || !cityData || !cityData.name) return;
    try {
      const recents = this.getRecentSearches().filter(
        item => item.name.toLowerCase() !== cityData.name.toLowerCase()
      );
      recents.unshift({
        name: cityData.name,
        country: cityData.country || '',
        timestamp: Date.now()
      });
      // Cap at 8 items
      const capped = recents.slice(0, 8);
      localStorage.setItem(CONFIG.STORAGE_KEYS.RECENTS, JSON.stringify(capped));
    } catch (e) {
      console.warn('Could not save recent search:', e);
    }
  }

  static clearRecentSearches() {
    if (!this.hasStorage()) return;
    localStorage.removeItem(CONFIG.STORAGE_KEYS.RECENTS);
  }

  /**
   * Last successful city
   */
  static getLastCity() {
    if (!this.hasStorage()) return '';
    return localStorage.getItem(CONFIG.STORAGE_KEYS.LAST_CITY) || '';
  }

  static setLastCity(cityName) {
    if (!this.hasStorage() || !cityName) return;
    localStorage.setItem(CONFIG.STORAGE_KEYS.LAST_CITY, cityName);
  }
}
