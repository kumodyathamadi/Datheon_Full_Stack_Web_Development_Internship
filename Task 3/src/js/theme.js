/**
 * ATMOS — Theme & Dynamic Weather Background Controller
 */

import { StorageManager } from './storage.js';

export class ThemeManager {
  /**
   * Initializes theme on page load
   */
  static init() {
    const savedTheme = StorageManager.getTheme();
    document.documentElement.setAttribute('data-theme', savedTheme);
    // Default initial atmospheric condition
    document.documentElement.setAttribute('data-condition', 'clear-night');
  }

  /**
   * Toggle between Dark and Light mode
   */
  static toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    StorageManager.setTheme(next);
    return next;
  }

  /**
   * Updates the dynamic background according to weather condition and local day/night status.
   * Conditions supported:
   * - clear-day (warm amber, golden yellow, soft peach)
   * - clear-night (midnight navy, indigo, subtle stars)
   * - rain (deep blue, slate, cool cyan)
   * - clouds (muted grey, lavender, blue-grey)
   * - snow (icy blue, white, pale violet)
   * - thunderstorm (electric violet, deep slate)
   * - atmosphere (mist/fog/haze)
   */
  static updateAtmosphericTheme(weatherData) {
    if (!weatherData) return;

    const conditionKey = weatherData.conditionKey || 'clear';
    const isDay = weatherData.isDay !== undefined ? weatherData.isDay : true;

    let themeAttribute = 'clear-night';

    if (conditionKey === 'clear') {
      themeAttribute = isDay ? 'clear-day' : 'clear-night';
    } else if (conditionKey === 'few-clouds' || conditionKey === 'scattered-clouds') {
      themeAttribute = isDay ? 'clear-day' : 'clouds';
    } else if (conditionKey === 'clouds' || conditionKey === 'overcast') {
      themeAttribute = 'clouds';
    } else if (conditionKey === 'rain' || conditionKey === 'drizzle' || conditionKey === 'heavy-rain') {
      themeAttribute = 'rain';
    } else if (conditionKey === 'snow') {
      themeAttribute = 'snow';
    } else if (conditionKey === 'thunderstorm') {
      themeAttribute = 'thunderstorm';
    } else if (conditionKey === 'mist' || conditionKey === 'fog' || conditionKey === 'haze') {
      themeAttribute = 'atmosphere';
    } else {
      themeAttribute = isDay ? 'clear-day' : 'clear-night';
    }

    document.documentElement.setAttribute('data-condition', themeAttribute);
    return themeAttribute;
  }
}
