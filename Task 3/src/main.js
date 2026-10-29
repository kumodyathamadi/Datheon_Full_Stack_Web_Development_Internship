/**
 * ATMOS — Application Bootstrap & Orchestration
 */

import './style.css';
import { ICONS } from './js/icons.js';
import { CONFIG, getOpenWeatherApiKey } from './js/config.js';
import { StorageManager } from './js/storage.js';
import { ThemeManager } from './js/theme.js';
import { WeatherApiService } from './js/api.js';
import { AtmosphericCanvas } from './js/canvas-fx.js';
import { UIManager } from './js/ui.js';

class AtmosApp {
  constructor() {
    this.ui = new UIManager();
    this.canvasFx = null;
    this.currentWeatherData = null;
    this.unitSystem = StorageManager.getUnitSystem();
    this.lastQueriedCity = '';
  }

  init() {
    ThemeManager.init();

    // Initialize Atmospheric Canvas FX
    const canvasEl = document.getElementById('atmospheric-canvas');
    if (canvasEl) {
      this.canvasFx = new AtmosphericCanvas(canvasEl);
    }

    this.renderLayoutStructure();
    this.attachEventListeners();
    this.ui.updateProviderBadge();

    // Check last city or load default station
    const lastCity = StorageManager.getLastCity();
    if (lastCity) {
      this.loadWeather(lastCity);
    } else {
      // Load curated initial station
      this.loadWeather(CONFIG.DEFAULT_CITY);
    }
  }

  renderLayoutStructure() {
    const appEl = document.getElementById('app');
    if (!appEl) return;

    appEl.innerHTML = `
      <a href="#main-weather-content" class="skip-to-content">Skip to weather content</a>
      <div class="atmospheric-vignette" aria-hidden="true"></div>

      <div class="app-wrapper">
        <!-- Top Navigation -->
        <header class="top-nav" role="banner">
          <a href="#" class="brand-link" id="brand-home-link" aria-label="ATMOS Home">
            <div class="brand-symbol">${ICONS.logo}</div>
            <div class="brand-text-group">
              <span class="brand-title">${CONFIG.APP_NAME}</span>
              <span class="brand-subtitle">Planetary Telemetry</span>
            </div>
          </a>

          <!-- Global City Search -->
          <div class="search-wrapper">
            <form class="search-form" id="city-search-form" role="search">
              <span class="search-icon-btn" aria-hidden="true">${ICONS.search}</span>
              <input
                type="text"
                class="search-input"
                id="city-search-input"
                placeholder="Search global city or coordinates (e.g. Tokyo, Zürich)..."
                autocomplete="off"
                spellcheck="false"
                aria-label="Search city or coordinates"
              />
              <div class="search-actions-group">
                <div class="search-spinner" id="search-spinner" aria-hidden="true"></div>
                <button type="button" class="search-clear-btn" id="search-clear-btn" aria-label="Clear search input">
                  ${ICONS.clear}
                </button>
                <span class="search-shortcut-pill" aria-hidden="true">/</span>
                <button type="submit" class="control-btn" id="search-submit-btn" aria-label="Submit search" style="padding: 0.35rem 0.65rem;">
                  ${ICONS.search}
                </button>
              </div>
            </form>

            <!-- Search Dropdown / Recents -->
            <div class="search-dropdown" id="search-dropdown" role="listbox">
              <div class="dropdown-header">
                <span>Recent Observations</span>
                <button type="button" class="clear-history-btn" id="clear-recents-btn">Clear</button>
              </div>
              <div id="dropdown-items-container"></div>
            </div>
          </div>

          <!-- Controls Toolbar -->
          <nav class="nav-controls" aria-label="Application controls">
            <!-- Provider Status Badge -->
            <button type="button" class="telemetry-badge" id="provider-badge" title="Data provider configuration">
              <span class="badge-dot"></span>
              <span>FEED: OPEN-METEO</span>
            </button>

            <!-- Unit Toggle (°C / °F) -->
            <div class="unit-toggle-switch" role="group" aria-label="Temperature units">
              <button type="button" class="unit-option-btn ${this.unitSystem === 'metric' ? 'active' : ''}" id="unit-metric-btn" aria-label="Celsius">°C</button>
              <button type="button" class="unit-option-btn ${this.unitSystem === 'imperial' ? 'active' : ''}" id="unit-imperial-btn" aria-label="Fahrenheit">°F</button>
            </div>

            <!-- Geolocation Button -->
            <button type="button" class="control-btn icon-btn" id="geo-location-btn" aria-label="Use current location" title="Locate via GPS">
              ${ICONS.location}
            </button>

            <!-- Theme Toggle Button -->
            <button type="button" class="control-btn icon-btn" id="theme-toggle-btn" aria-label="Toggle dark/light theme" title="Toggle theme">
              <span id="theme-icon-container">${ICONS.sun}</span>
            </button>

            <!-- Settings / API Key Button -->
            <button type="button" class="control-btn icon-btn" id="settings-toggle-btn" aria-label="Open API settings" title="API Configuration">
              ${ICONS.settings}
            </button>
          </nav>
        </header>

        <!-- Quick Hubs Bar -->
        <div class="quick-hubs-bar" role="navigation" aria-label="Curated global hubs">
          <span class="quick-hubs-label">GLOBAL STATIONS:</span>
          ${CONFIG.DEFAULT_HUBS.map(hub => `
            <button type="button" class="quick-hub-pill" data-city="${hub.query || hub.name}">
              ${hub.name}
            </button>
          `).join('')}
        </div>

        <!-- Main Dynamic Content Container -->
        <main id="main-weather-content" class="main-content-flow" role="main">
          <!-- Hero Section Placeholder -->
          <section id="weather-hero" class="weather-hero glass-panel" aria-label="Current Weather Station"></section>

          <!-- Telemetry Instruments Section -->
          <section class="telemetry-section" aria-label="Scientific Telemetry Instruments">
            <div class="section-header">
              <h2 class="section-title">
                ${ICONS.barometer}
                <span>Atmospheric Telemetry Grid</span>
              </h2>
            </div>
            <div class="telemetry-grid" id="telemetry-grid"></div>
          </section>

          <!-- Today's Atmosphere Briefing -->
          <section id="atmosphere-story" class="atmosphere-story-section glass-panel" aria-label="Meteorological Briefing"></section>

          <!-- Five-Day Forecast Section -->
          <section class="forecast-section" aria-label="Five-Day Meteorological Forecast">
            <div class="section-header">
              <h2 class="section-title">
                ${ICONS.sparkles}
                <span>Five-Day Forecast Timeline</span>
              </h2>
            </div>
            <div class="forecast-grid" id="forecast-grid"></div>
          </section>
        </main>
      </div>

      <!-- Settings & API Modal -->
      <div class="modal-overlay" id="settings-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-dialog">
          <div class="modal-header">
            <h2 class="modal-title" id="modal-title">
              ${ICONS.settings}
              <span>API & Data Feed Settings</span>
            </h2>
            <button type="button" class="modal-close-btn" id="modal-close-btn" aria-label="Close dialog">
              ${ICONS.clear}
            </button>
          </div>

          <div class="modal-body">
            <p>
              ATMOS supports dual telemetry engines: <strong>OpenWeatherMap</strong> (commercial API key) and <strong>Open-Meteo</strong> (free, keyless real-time global feed).
            </p>

            <div class="form-group">
              <label class="form-label">Active Meteorological Provider</label>
              <div class="provider-selector-tabs">
                <button type="button" class="provider-tab-btn" id="provider-tab-owm">OpenWeatherMap</button>
                <button type="button" class="provider-tab-btn" id="provider-tab-meteo">Open-Meteo (Keyless)</button>
              </div>
            </div>

            <div class="form-group" id="owm-key-group">
              <label class="form-label" for="owm-api-key-input">OpenWeatherMap API Key</label>
              <input
                type="text"
                class="form-input"
                id="owm-api-key-input"
                placeholder="Enter 32-character key..."
                autocomplete="off"
              />
              <span class="form-hint">
                Get a free API key at <a href="https://openweathermap.org/api" target="_blank" rel="noopener">openweathermap.org/api</a>.
                Saved locally in browser storage. Vite client-side builds embed environment keys.
              </span>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" id="modal-cancel-btn">Cancel</button>
            <button type="button" class="btn-primary" id="modal-save-btn">Save & Apply Feed</button>
          </div>
        </div>
      </div>
    `;

    this.updateThemeButtonIcon();
  }

  attachEventListeners() {
    // 1. Search Form
    const searchForm = document.getElementById('city-search-form');
    const searchInput = document.getElementById('city-search-input');
    const clearBtn = document.getElementById('search-clear-btn');
    const dropdown = document.getElementById('search-dropdown');

    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          this.loadWeather(query);
          this.closeSearchDropdown();
        }
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        clearBtn.classList.toggle('visible', searchInput.value.length > 0);
      });

      searchInput.addEventListener('focus', () => {
        this.renderRecentSearches();
      });

      // Clear button
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          searchInput.value = '';
          clearBtn.classList.remove('visible');
          searchInput.focus();
        });
      }
    }

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-wrapper')) {
        this.closeSearchDropdown();
      }
    });

    // Clear Recents Button
    const clearRecentsBtn = document.getElementById('clear-recents-btn');
    if (clearRecentsBtn) {
      clearRecentsBtn.addEventListener('click', () => {
        StorageManager.clearRecentSearches();
        this.renderRecentSearches();
      });
    }

    // 2. Unit Switcher
    const metricBtn = document.getElementById('unit-metric-btn');
    const imperialBtn = document.getElementById('unit-imperial-btn');

    if (metricBtn && imperialBtn) {
      metricBtn.addEventListener('click', () => this.switchUnit('metric'));
      imperialBtn.addEventListener('click', () => this.switchUnit('imperial'));
    }

    // 3. Geolocation
    const geoBtn = document.getElementById('geo-location-btn');
    if (geoBtn) {
      geoBtn.addEventListener('click', () => this.handleGeolocation());
    }

    // 4. Theme Toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        ThemeManager.toggleTheme();
        this.updateThemeButtonIcon();
      });
    }

    // 5. Settings Modal
    const settingsBtn = document.getElementById('settings-toggle-btn');
    const providerBadge = document.getElementById('provider-badge');
    const modal = document.getElementById('settings-modal');
    const modalClose = document.getElementById('modal-close-btn');
    const modalCancel = document.getElementById('modal-cancel-btn');
    const modalSave = document.getElementById('modal-save-btn');

    if (settingsBtn) settingsBtn.addEventListener('click', () => this.openSettingsModal());
    if (providerBadge) providerBadge.addEventListener('click', () => this.openSettingsModal());
    if (modalClose) modalClose.addEventListener('click', () => this.closeSettingsModal());
    if (modalCancel) modalCancel.addEventListener('click', () => this.closeSettingsModal());
    if (modalSave) modalSave.addEventListener('click', () => this.saveSettingsModal());

    // Brand Home Link
    const brandLink = document.getElementById('brand-home-link');
    if (brandLink) {
      brandLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.loadWeather(CONFIG.DEFAULT_CITY);
      });
    }

    // Quick Hubs
    document.querySelectorAll('.quick-hub-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const city = pill.getAttribute('data-city');
        if (city) {
          if (searchInput) searchInput.value = city;
          this.loadWeather(city);
        }
      });
    });

    // Global Keyboard Shortcuts ('/' for search, 'Escape' for modals/dropdowns)
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
      } else if (e.key === 'Escape') {
        this.closeSearchDropdown();
        this.closeSettingsModal();
      }
    });
  }

  async loadWeather(cityName) {
    if (!cityName) return;
    this.lastQueriedCity = cityName;
    this.ui.setLoading(true);

    try {
      const data = await WeatherApiService.searchCityWeather(cityName, this.unitSystem);
      if (!data) return; // Request was aborted or superceded

      this.currentWeatherData = data;
      this.renderFullWeather(data);
      this.ui.setLoading(false);
    } catch (err) {
      this.ui.setLoading(false);
      console.error('Weather load error:', err);

      // Preserve last successfully displayed weather if already present, or render error state
      if (!this.currentWeatherData) {
        this.ui.renderError(
          err,
          () => this.loadWeather(cityName),
          () => this.openSettingsModal()
        );
      } else {
        this.ui.showToast(`Search failed: ${err.message}`, 'error');
      }
    }
  }

  async handleGeolocation() {
    if (!navigator.geolocation) {
      this.ui.showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }

    this.ui.setLoading(true);
    this.ui.showToast('Acquiring orbital GPS position...', 'info');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const data = await WeatherApiService.searchCoordsWeather(lat, lon, this.unitSystem);
          if (data) {
            this.currentWeatherData = data;
            this.lastQueriedCity = data.city;
            const searchInput = document.getElementById('city-search-input');
            if (searchInput) searchInput.value = data.city;
            this.renderFullWeather(data);
            this.ui.showToast(`Position locked: ${data.city}`, 'success');
          }
        } catch (err) {
          this.ui.showToast(`GPS lookup failed: ${err.message}`, 'error');
        } finally {
          this.ui.setLoading(false);
        }
      },
      (err) => {
        this.ui.setLoading(false);
        this.ui.showToast('Location permission denied or unavailable.', 'error');
      },
      { timeout: 10000 }
    );
  }

  renderFullWeather(data) {
    // 1. Update Atmospheric Theme & Canvas
    ThemeManager.updateAtmosphericTheme(data);
    if (this.canvasFx) {
      this.canvasFx.setCondition(data.conditionKey);
    }

    // 2. Render Hero
    this.ui.renderHero(data, this.unitSystem);

    // 3. Render Telemetry Instruments
    this.ui.renderTelemetry(data, this.unitSystem);

    // 4. Render Today's Atmosphere Briefing
    this.ui.renderStory(data);

    // 5. Render Five-Day Forecast Timeline
    this.ui.renderForecast(data.dailyForecasts, data.weekMin, data.weekMax, this.unitSystem);

    // 6. Update Provider Badge
    this.ui.updateProviderBadge();
  }

  switchUnit(newUnit) {
    if (this.unitSystem === newUnit) return;
    this.unitSystem = newUnit;
    StorageManager.setUnitSystem(newUnit);

    document.getElementById('unit-metric-btn').classList.toggle('active', newUnit === 'metric');
    document.getElementById('unit-imperial-btn').classList.toggle('active', newUnit === 'imperial');

    // Reload active city with new unit
    if (this.lastQueriedCity) {
      this.loadWeather(this.lastQueriedCity);
      this.ui.showToast(`Units switched to ${newUnit === 'metric' ? 'Metric (°C, km/h)' : 'Imperial (°F, mph)'}`, 'success');
    }
  }

  renderRecentSearches() {
    const dropdown = document.getElementById('search-dropdown');
    const container = document.getElementById('dropdown-items-container');
    if (!dropdown || !container) return;

    const recents = StorageManager.getRecentSearches();
    if (recents.length === 0) {
      container.innerHTML = `<div style="padding: var(--space-md); text-align: center; color: var(--text-tertiary); font-size: 0.8125rem;">No recent stations saved</div>`;
    } else {
      container.innerHTML = recents.map(r => `
        <div class="dropdown-item" data-city="${r.name}">
          <span>${r.name}</span>
          <span class="city-meta">${r.country || 'GLOBAL'}</span>
        </div>
      `).join('');

      container.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
          const city = item.getAttribute('data-city');
          if (city) {
            const input = document.getElementById('city-search-input');
            if (input) input.value = city;
            this.loadWeather(city);
            this.closeSearchDropdown();
          }
        });
      });
    }

    dropdown.classList.add('open');
  }

  closeSearchDropdown() {
    const dropdown = document.getElementById('search-dropdown');
    if (dropdown) dropdown.classList.remove('open');
  }

  updateThemeButtonIcon() {
    const container = document.getElementById('theme-icon-container');
    if (!container) return;
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    container.innerHTML = currentTheme === 'dark' ? ICONS.sun : ICONS.moon;
  }

  /* ==========================================================================
     Settings Modal Logic
     ========================================================================== */

  openSettingsModal() {
    const modal = document.getElementById('settings-modal');
    const input = document.getElementById('owm-api-key-input');
    const tabOwm = document.getElementById('provider-tab-owm');
    const tabMeteo = document.getElementById('provider-tab-meteo');

    if (!modal) return;

    const activeProvider = StorageManager.getProvider();
    const currentKey = getOpenWeatherApiKey();

    if (input) input.value = currentKey;

    if (activeProvider === CONFIG.PROVIDERS.OPENWEATHERMAP) {
      tabOwm.classList.add('active');
      tabMeteo.classList.remove('active');
    } else {
      tabMeteo.classList.add('active');
      tabOwm.classList.remove('active');
    }

    tabOwm.onclick = () => {
      tabOwm.classList.add('active');
      tabMeteo.classList.remove('active');
    };

    tabMeteo.onclick = () => {
      tabMeteo.classList.add('active');
      tabOwm.classList.remove('active');
    };

    modal.classList.add('open');
  }

  closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (modal) modal.classList.remove('open');
  }

  saveSettingsModal() {
    const tabOwm = document.getElementById('provider-tab-owm');
    const input = document.getElementById('owm-api-key-input');
    const selectedProvider = tabOwm.classList.contains('active')
      ? CONFIG.PROVIDERS.OPENWEATHERMAP
      : CONFIG.PROVIDERS.OPENMETEO;

    const keyVal = input ? input.value.trim() : '';

    if (selectedProvider === CONFIG.PROVIDERS.OPENWEATHERMAP && !keyVal) {
      alert('Please enter an OpenWeatherMap API key or select Open-Meteo for keyless operation.');
      return;
    }

    StorageManager.setCustomApiKey(keyVal);
    StorageManager.setProvider(selectedProvider);
    this.ui.updateProviderBadge();
    this.closeSettingsModal();
    this.ui.showToast(`Feed provider updated: ${selectedProvider === CONFIG.PROVIDERS.OPENWEATHERMAP ? 'OpenWeatherMap' : 'Open-Meteo'}`, 'success');

    // Reload current city with newly applied provider
    if (this.lastQueriedCity) {
      this.loadWeather(this.lastQueriedCity);
    }
  }
}

// Start Application on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new AtmosApp();
  app.init();
});
