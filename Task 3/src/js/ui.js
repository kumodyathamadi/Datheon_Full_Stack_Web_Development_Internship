/**
 * ATMOS — UI Controller & DOM Rendering Engine
 */

import { ICONS, getWeatherIcon } from './icons.js';
import { StorageManager } from './storage.js';
import { AtmosphereStoryGenerator } from './story.js';
import { CONFIG } from './config.js';

export class UIManager {
  constructor() {
    this.localClockInterval = null;
    this.currentCityTimezoneOffset = 0;
  }

  /**
   * Render the Cinematic Current-Weather Hero
   */
  renderHero(data, unitSystem) {
    const heroContainer = document.getElementById('weather-hero');
    if (!heroContainer || !data) return;

    this.currentCityTimezoneOffset = data.timezoneOffset || 0;
    const tempUnit = unitSystem === 'imperial' ? '°F' : '°C';
    const weatherIconSvg = getWeatherIcon(data.conditionKey, data.isDay);

    const latStr = Math.abs(data.coord.lat).toFixed(2) + '° ' + (data.coord.lat >= 0 ? 'N' : 'S');
    const lonStr = Math.abs(data.coord.lon).toFixed(2) + '° ' + (data.coord.lon >= 0 ? 'E' : 'W');
    const utcStr = this.formatUtcOffset(data.timezoneOffset);

    const sunriseStr = data.sunrise ? this.formatEpochToLocalTime(data.sunrise, data.timezoneOffset) : '—';
    const sunsetStr = data.sunset ? this.formatEpochToLocalTime(data.sunset, data.timezoneOffset) : '—';

    heroContainer.innerHTML = `
      <div class="hero-ambient-glow" aria-hidden="true"></div>

      <!-- Telemetry Strip -->
      <div class="hero-telemetry-strip">
        <div class="station-coords">
          <span class="live-indicator">LIVE FEED</span>
          <span>LAT ${latStr}</span>
          <span>•</span>
          <span>LON ${lonStr}</span>
          <span>•</span>
          <span>${utcStr}</span>
        </div>
        <div class="station-time" id="hero-local-clock">
          ${this.formatLocalClock(data.timezoneOffset)}
        </div>
      </div>

      <!-- Main Display -->
      <div class="hero-main-content">
        <div class="hero-primary">
          <div class="location-group">
            <h1 class="location-city-title">
              <span>${data.city}</span>
              ${data.country ? `<span class="location-country-tag">${data.country}</span>` : ''}
            </h1>
            <div class="local-date-display" id="hero-local-date">
              ${this.formatLocalDate(data.timezoneOffset)}
            </div>
          </div>

          <!-- Oversized Temperature Showcase -->
          <div class="temp-showcase-row">
            <div class="oversized-temp" id="hero-main-temp">
              <span>${data.temp}</span>
              <span class="temp-unit-symbol">${tempUnit}</span>
            </div>
          </div>

          <!-- Weather Description & Range -->
          <div class="condition-details-group">
            <div class="condition-headline">
              <span>${data.description}</span>
            </div>

            <div class="temp-extremes-row">
              <div class="temp-extreme-item">
                <span>Feels like</span>
                <strong>${data.feelsLike}${tempUnit}</strong>
              </div>
              <div class="temp-extreme-item">
                <span>High</span>
                <strong>${data.tempMax}${tempUnit}</strong>
              </div>
              <div class="temp-extreme-item">
                <span>Low</span>
                <strong>${data.tempMin}${tempUnit}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Weather Visual Column -->
        <div class="hero-visual-column">
          <div class="hero-weather-illustration" aria-label="${data.description}">
            ${weatherIconSvg}
          </div>

          <!-- Sunrise & Sunset Strip -->
          <div class="hero-ephemeris-strip">
            <div class="ephemeris-item">
              <div class="ephemeris-icon">${ICONS.sunrise}</div>
              <div class="ephemeris-meta">
                <span class="ephemeris-label">Sunrise</span>
                <span class="ephemeris-time">${sunriseStr}</span>
              </div>
            </div>
            <div class="ephemeris-item">
              <div class="ephemeris-icon">${ICONS.sunset}</div>
              <div class="ephemeris-meta">
                <span class="ephemeris-label">Sunset</span>
                <span class="ephemeris-time">${sunsetStr}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Start ticking local clock
    this.startLocalClock(data.timezoneOffset);
  }

  /**
   * Render Precision Telemetry Panel
   */
  renderTelemetry(data, unitSystem) {
    const container = document.getElementById('telemetry-grid');
    if (!container || !data) return;

    const speedUnit = unitSystem === 'imperial' ? 'mph' : 'km/h';
    const tempUnit = unitSystem === 'imperial' ? '°F' : '°C';
    const visUnit = unitSystem === 'imperial' ? 'mi' : 'km';

    // 1. Wind Needle Angle
    const windDeg = data.windDeg || 0;
    const windBeaufort = this.getBeaufortScale(data.windSpeed, unitSystem);

    // 2. Barometer System Rating
    const pressureSystem = data.pressure >= 1020 
      ? 'High Pressure System' 
      : data.pressure <= 1008 
        ? 'Low Pressure Depression' 
        : 'Normal Atmospheric Ridge';

    // 3. Humidity Comfort Rating
    const humidityComfort = data.humidity >= 80 
      ? 'High Moisture' 
      : data.humidity <= 35 
        ? 'Dry Air' 
        : 'Optimal Comfort';

    // 4. Optical Clarity
    const visNum = parseFloat(data.visibility);
    const visRating = visNum >= 10 
      ? 'Crystal Clear' 
      : visNum >= 5 
        ? 'Moderate Haze' 
        : 'Reduced Visibility';

    // 5. UV Index
    const uvMarkup = data.uv !== null && data.uv !== undefined
      ? `
        <div class="card-indicator">
          <div class="uv-spectrum-track">
            <div class="uv-spectrum-marker" style="left: ${Math.min(100, (data.uv / 11) * 100)}%;"></div>
          </div>
          <div class="indicator-status-text">
            <span>Risk Level</span>
            <strong>${this.getUvRiskLabel(data.uv)}</strong>
          </div>
        </div>
      `
      : `
        <div class="card-indicator">
          <div class="indicator-status-text">
            <span>Index Status</span>
            <strong style="color: var(--text-tertiary);">N/A in Free Feed</strong>
          </div>
        </div>
      `;

    // 6. Solar Arc Position
    const solarArcMarkup = this.renderSolarArcSvg(data.sunrise, data.sunset, data.timezoneOffset);

    container.innerHTML = `
      <!-- 1. Wind Vector -->
      <div class="telemetry-card">
        <div class="card-top">
          <div class="instrument-label-group">
            <span class="instrument-code">VECTOR // 01</span>
            <h3 class="instrument-name">Wind Velocity</h3>
          </div>
          <div class="instrument-icon">${ICONS.windSpeed}</div>
        </div>

        <div class="metric-reading-row">
          <span class="metric-value">${data.windSpeed}</span>
          <span class="metric-unit">${speedUnit}</span>
        </div>

        <div class="card-indicator">
          <div class="wind-compass-container">
            <div class="compass-dial">
              <div class="compass-needle" style="transform: rotate(${windDeg}deg);"></div>
            </div>
            <div class="indicator-status-text" style="flex: 1;">
              <div>
                <div><strong>${data.windDirectionCardinal} (${windDeg}°)</strong></div>
                <div style="font-size: 0.6875rem; color: var(--text-tertiary);">${windBeaufort}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Barometer -->
      <div class="telemetry-card">
        <div class="card-top">
          <div class="instrument-label-group">
            <span class="instrument-code">BARO // 02</span>
            <h3 class="instrument-name">Pressure</h3>
          </div>
          <div class="instrument-icon">${ICONS.barometer}</div>
        </div>

        <div class="metric-reading-row">
          <span class="metric-value">${data.pressure}</span>
          <span class="metric-unit">hPa</span>
        </div>

        <div class="card-indicator">
          <div class="telemetry-progress-track">
            <div class="telemetry-progress-fill" style="width: ${Math.max(10, Math.min(100, ((data.pressure - 950) / 100) * 100))}%;"></div>
          </div>
          <div class="indicator-status-text">
            <span>Barometric Status</span>
            <strong>${pressureSystem}</strong>
          </div>
        </div>
      </div>

      <!-- 3. Moisture & Dew Point -->
      <div class="telemetry-card">
        <div class="card-top">
          <div class="instrument-label-group">
            <span class="instrument-code">HYGRO // 03</span>
            <h3 class="instrument-name">Humidity</h3>
          </div>
          <div class="instrument-icon">${ICONS.humidity}</div>
        </div>

        <div class="metric-reading-row">
          <span class="metric-value">${data.humidity}</span>
          <span class="metric-unit">%</span>
        </div>

        <div class="card-indicator">
          <div class="telemetry-progress-track">
            <div class="telemetry-progress-fill" style="width: ${data.humidity}%;"></div>
          </div>
          <div class="indicator-status-text">
            <span>Dew Point: <strong>${data.dewPoint}${tempUnit}</strong></span>
            <strong>${humidityComfort}</strong>
          </div>
        </div>
      </div>

      <!-- 4. Visibility -->
      <div class="telemetry-card">
        <div class="card-top">
          <div class="instrument-label-group">
            <span class="instrument-code">OPTIC // 04</span>
            <h3 class="instrument-name">Visibility</h3>
          </div>
          <div class="instrument-icon">${ICONS.visibility}</div>
        </div>

        <div class="metric-reading-row">
          <span class="metric-value">${data.visibility}</span>
          <span class="metric-unit">${visUnit}</span>
        </div>

        <div class="card-indicator">
          <div class="telemetry-progress-track">
            <div class="telemetry-progress-fill" style="width: ${Math.min(100, (parseFloat(data.visibility) / (unitSystem === 'imperial' ? 6.2 : 10)) * 100)}%;"></div>
          </div>
          <div class="indicator-status-text">
            <span>Optical Index</span>
            <strong>${visRating}</strong>
          </div>
        </div>
      </div>

      <!-- 5. UV Index -->
      <div class="telemetry-card">
        <div class="card-top">
          <div class="instrument-label-group">
            <span class="instrument-code">SOLAR // 05</span>
            <h3 class="instrument-name">UV Radiation</h3>
          </div>
          <div class="instrument-icon">${ICONS.uv}</div>
        </div>

        <div class="metric-reading-row">
          <span class="metric-value">${data.uv !== null && data.uv !== undefined ? data.uv : '—'}</span>
          <span class="metric-unit">UVI</span>
        </div>

        ${uvMarkup}
      </div>

      <!-- 6. Solar Arc Ephemeris -->
      <div class="telemetry-card">
        <div class="card-top">
          <div class="instrument-label-group">
            <span class="instrument-code">ORBIT // 06</span>
            <h3 class="instrument-name">Daylight Arc</h3>
          </div>
          <div class="instrument-icon">${ICONS.sunrise}</div>
        </div>

        ${solarArcMarkup}
      </div>
    `;
  }

  /**
   * Render Five-Day Forecast Timeline
   */
  renderForecast(dailyForecasts, weekMin, weekMax, unitSystem) {
    const container = document.getElementById('forecast-grid');
    if (!container) return;

    if (!Array.isArray(dailyForecasts) || dailyForecasts.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-tertiary);">Forecast data unavailable.</div>`;
      return;
    }

    const tempUnit = unitSystem === 'imperial' ? '°F' : '°C';
    const tempRangeSpan = Math.max(1, weekMax - weekMin);

    container.innerHTML = dailyForecasts.map((day, idx) => {
      const isToday = idx === 0;
      const iconSvg = getWeatherIcon(day.conditionKey, true);

      // Relative position of day min/max within week's min/max
      const leftPercent = Math.max(0, Math.min(100, ((day.minTemp - weekMin) / tempRangeSpan) * 100));
      const widthPercent = Math.max(12, Math.min(100 - leftPercent, ((day.maxTemp - day.minTemp) / tempRangeSpan) * 100));

      return `
        <div class="forecast-card ${isToday ? 'is-today' : ''}">
          <div class="forecast-date-group">
            <span class="forecast-day-name">${isToday ? 'Today' : day.dayName}</span>
            <span class="forecast-calendar-date">${day.dateFormatted}</span>
          </div>

          <div class="forecast-icon-box" title="${day.description}">
            ${iconSvg}
          </div>

          <div class="forecast-condition-desc">
            ${day.description}
          </div>

          <div class="forecast-temps-group">
            <div class="forecast-temp-readings">
              <span class="temp-max-val">${day.maxTemp}${tempUnit}</span>
              <span class="temp-min-val">${day.minTemp}${tempUnit}</span>
            </div>

            <!-- Temperature Span Visual Bar -->
            <div class="forecast-temp-bar-container" title="Low: ${day.minTemp}°, High: ${day.maxTemp}°">
              <div class="forecast-temp-bar-fill" style="left: ${leftPercent}%; width: ${widthPercent}%;"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Render Today's Atmosphere Meteorological Story
   */
  renderStory(telemetry) {
    const container = document.getElementById('atmosphere-story');
    if (!container || !telemetry) return;

    const { narrative, pills } = AtmosphereStoryGenerator.generateStory(telemetry);

    container.innerHTML = `
      <div class="story-header">
        <div class="story-badge">
          ${ICONS.sparkles}
          <span>TODAY'S ATMOSPHERIC BRIEFING</span>
        </div>
        <div class="story-timestamp">
          DATA SYNC: ${this.formatLocalClock(telemetry.timezoneOffset)}
        </div>
      </div>

      <p class="story-body">${narrative}</p>

      <div class="story-takeaways-list">
        ${pills.map(p => `
          <div class="story-pill">
            ${ICONS[p.icon] || ICONS.sparkles}
            <span>${p.text}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Render Welcome Discovery State
   */
  renderWelcome(onSelectHub) {
    const mainSection = document.getElementById('main-weather-content');
    if (!mainSection) return;

    mainSection.innerHTML = `
      <div class="welcome-card glass-panel">
        <div class="welcome-symbol-wrap">
          ${ICONS.logo}
        </div>

        <div style="display: flex; flex-direction: column; gap: var(--space-xs); align-items: center;">
          <h2 class="welcome-headline">Explore Earth's Atmosphere</h2>
          <p class="welcome-tagline">
            Real-time planetary telemetry, precision environmental instrumentation, and multi-day meteorological forecasting across worldwide stations.
          </p>
        </div>

        <div style="width: 100%; display: flex; flex-direction: column; gap: var(--space-sm); align-items: flex-start;">
          <span class="quick-hubs-label" style="font-size: 0.75rem;">CURATED GLOBAL TELEMETRY STATIONS</span>
          <div class="welcome-stations-grid">
            ${CONFIG.DEFAULT_HUBS.map(hub => `
              <div class="station-quick-card" data-city="${hub.query || hub.name}">
                <span class="station-name">${hub.name}</span>
                <span class="station-sub">${hub.desc} (${hub.country})</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Attach click listeners to discovery cards
    mainSection.querySelectorAll('.station-quick-card').forEach(card => {
      card.addEventListener('click', () => {
        const city = card.getAttribute('data-city');
        if (city && onSelectHub) onSelectHub(city);
      });
    });
  }

  /**
   * Render Error State
   */
  renderError(error, onRetry, onOpenSettings) {
    const mainSection = document.getElementById('main-weather-content');
    if (!mainSection) return;

    let retryBtn = `<button class="btn-primary" id="error-retry-btn">Try Again</button>`;
    let settingsBtn = '';

    if (error.type === 'API_KEY_ERROR') {
      settingsBtn = `<button class="btn-secondary" id="error-settings-btn">Configure API Key / Provider</button>`;
    }

    mainSection.innerHTML = `
      <div class="error-card glass-panel">
        <div class="error-icon-box">
          ${ICONS.alert}
        </div>
        <h2 class="error-title">Telemetry Signal Interrupted</h2>
        <p class="error-message">${error.message}</p>
        <div class="error-actions">
          ${retryBtn}
          ${settingsBtn}
        </div>
      </div>
    `;

    const retryEl = document.getElementById('error-retry-btn');
    if (retryEl && onRetry) {
      retryEl.addEventListener('click', onRetry);
    }

    const settingsEl = document.getElementById('error-settings-btn');
    if (settingsEl && onOpenSettings) {
      settingsEl.addEventListener('click', onOpenSettings);
    }
  }

  /**
   * Set Loading State
   */
  setLoading(isLoading) {
    const spinner = document.getElementById('search-spinner');
    const searchBtn = document.getElementById('search-submit-btn');
    const searchInput = document.getElementById('city-search-input');

    if (spinner) {
      spinner.classList.toggle('active', isLoading);
    }
    if (searchBtn) {
      searchBtn.disabled = isLoading;
    }
    if (searchInput) {
      searchInput.setAttribute('aria-busy', isLoading ? 'true' : 'false');
    }
  }

  /**
   * Update Provider Badge in Navigation
   */
  updateProviderBadge() {
    const badge = document.getElementById('provider-badge');
    if (!badge) return;
    const provider = StorageManager.getProvider();
    if (provider === CONFIG.PROVIDERS.OPENWEATHERMAP) {
      badge.innerHTML = `<span class="badge-dot"></span><span>FEED: OPENWEATHERMAP</span>`;
      badge.classList.add('active');
    } else {
      badge.innerHTML = `<span class="badge-dot" style="background: #38bdf8; box-shadow: 0 0 8px #38bdf8;"></span><span>FEED: OPEN-METEO LIVE</span>`;
      badge.classList.remove('active');
    }
  }

  /**
   * Toast notification
   */
  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${type === 'success' ? ICONS.check : ICONS.sparkles}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  /* ==========================================================================
     Time & Formatting Utilities
     ========================================================================== */

  formatUtcOffset(seconds) {
    const hours = seconds / 3600;
    const sign = hours >= 0 ? '+' : '';
    return `UTC${sign}${hours}`;
  }

  formatLocalClock(timezoneOffsetSeconds) {
    const nowUtcMs = Date.now() + (new Date().getTimezoneOffset() * 60000);
    const targetLocalMs = nowUtcMs + (timezoneOffsetSeconds * 1000);
    const targetDate = new Date(targetLocalMs);

    return targetDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }

  formatLocalDate(timezoneOffsetSeconds) {
    const nowUtcMs = Date.now() + (new Date().getTimezoneOffset() * 60000);
    const targetLocalMs = nowUtcMs + (timezoneOffsetSeconds * 1000);
    const targetDate = new Date(targetLocalMs);

    return targetDate.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  formatEpochToLocalTime(epochSeconds, timezoneOffsetSeconds) {
    const targetLocalMs = (epochSeconds + timezoneOffsetSeconds) * 1000;
    const targetDate = new Date(targetLocalMs);
    return targetDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    });
  }

  startLocalClock(timezoneOffsetSeconds) {
    if (this.localClockInterval) {
      clearInterval(this.localClockInterval);
    }
    const clockEl = document.getElementById('hero-local-clock');
    if (!clockEl) return;

    this.localClockInterval = setInterval(() => {
      clockEl.textContent = this.formatLocalClock(timezoneOffsetSeconds);
    }, 1000);
  }

  getBeaufortScale(speed, unitSystem) {
    const kmh = unitSystem === 'imperial' ? speed * 1.60934 : speed;
    if (kmh < 1) return 'Calm';
    if (kmh <= 5) return 'Light Air';
    if (kmh <= 11) return 'Light Breeze';
    if (kmh <= 19) return 'Gentle Breeze';
    if (kmh <= 28) return 'Moderate Breeze';
    if (kmh <= 38) return 'Fresh Breeze';
    if (kmh <= 49) return 'Strong Breeze';
    if (kmh <= 61) return 'High Wind';
    return 'Gale Force';
  }

  getUvRiskLabel(uv) {
    if (uv <= 2) return 'Low Risk (0-2)';
    if (uv <= 5) return 'Moderate (3-5)';
    if (uv <= 7) return 'High (6-7)';
    if (uv <= 10) return 'Very High (8-10)';
    return 'Extreme (11+)';
  }

  renderSolarArcSvg(sunrise, sunset, timezoneOffset) {
    if (!sunrise || !sunset) {
      return `
        <div class="card-indicator">
          <div class="indicator-status-text">
            <span>Ephemeris</span>
            <strong style="color: var(--text-tertiary);">Station cycle pending</strong>
          </div>
        </div>
      `;
    }

    const currentUtc = Math.floor(Date.now() / 1000);
    const dayDuration = sunset - sunrise;
    const elapsed = currentUtc - sunrise;
    const progress = Math.max(0, Math.min(1, elapsed / dayDuration));

    // Parabolic arc path points: (x: 10 to 190, y: 38 down to 10 up to 38)
    const sunX = 15 + progress * 170;
    // Parabola: y = 40 - 32 * sin(progress * PI)
    const sunY = 40 - 28 * Math.sin(progress * Math.PI);
    const isDaylight = currentUtc >= sunrise && currentUtc <= sunset;

    return `
      <div style="width: 100%; display: flex; flex-direction: column; gap: var(--space-xs);">
        <svg class="solar-arc-svg" viewBox="0 0 200 48">
          <path class="solar-arc-track" d="M 15 42 Q 100 -5 185 42" fill="none" stroke-width="2"/>
          ${isDaylight ? `
            <circle class="solar-arc-sun" cx="${sunX}" cy="${sunY}" r="5"/>
          ` : `
            <circle cx="100" cy="42" r="4" fill="var(--text-tertiary)"/>
          `}
        </svg>
        <div class="indicator-status-text">
          <span>Daylight Arc</span>
          <strong>${isDaylight ? `${Math.round(progress * 100)}% Traversed` : 'Night Phase'}</strong>
        </div>
      </div>
    `;
  }
}
