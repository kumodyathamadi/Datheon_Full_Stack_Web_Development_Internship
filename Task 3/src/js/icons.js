/**
 * ATMOS — Scalable Vector Icons Library
 * Clean, modern, scientific weather telemetry icons
 */

export const ICONS = {
  // Brand Logo Symbol
  logo: `
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="var(--theme-accent)" />
          <stop offset="100%" stop-color="var(--theme-accent-secondary)" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="13" stroke="url(#logo-grad)" stroke-width="1.8" stroke-dasharray="4 2" opacity="0.7"/>
      <circle cx="16" cy="16" r="7.5" fill="url(#logo-grad)"/>
      <circle cx="23" cy="9" r="2.5" fill="var(--theme-accent)"/>
    </svg>
  `,

  // Clear Day (Sun)
  clearDay: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="14" fill="url(#sun-body-grad)"/>
      <g stroke="var(--theme-accent)" stroke-width="2.5" stroke-linecap="round" opacity="0.85">
        <line x1="32" y1="6" x2="32" y2="12"/>
        <line x1="32" y1="52" x2="32" y2="58"/>
        <line x1="6" y1="32" x2="12" y2="32"/>
        <line x1="52" y1="32" x2="58" y2="32"/>
        <line x1="13.6" y1="13.6" x2="17.8" y2="17.8"/>
        <line x1="46.2" y1="46.2" x2="50.4" y2="50.4"/>
        <line x1="13.6" y1="50.4" x2="17.8" y2="46.2"/>
        <line x1="46.2" y1="17.8" x2="50.4" y2="13.6"/>
      </g>
      <defs>
        <linearGradient id="sun-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fde047"/>
          <stop offset="100%" stop-color="#f97316"/>
        </linearGradient>
      </defs>
    </svg>
  `,

  // Clear Night (Moon & Stars)
  clearNight: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M42 16C30.95 16 22 24.95 22 36C22 41.5 24.2 46.5 27.8 50C18.5 48.2 12 40.5 12 31C12 19.95 20.95 11 32 11C35.7 11 39.1 12 42 13.8V16Z" fill="url(#moon-grad)"/>
      <circle cx="46" cy="18" r="1.5" fill="#bae6fd" opacity="0.9"/>
      <circle cx="52" cy="28" r="2" fill="#e0e7ff" opacity="0.8"/>
      <circle cx="44" cy="40" r="1.2" fill="#bae6fd" opacity="0.7"/>
      <defs>
        <linearGradient id="moon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e0e7ff"/>
          <stop offset="100%" stop-color="#818cf8"/>
        </linearGradient>
      </defs>
    </svg>
  `,

  // Few Clouds (Sun with Cloud)
  fewCloudsDay: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="26" cy="26" r="10" fill="#fde047" opacity="0.9"/>
      <path d="M48 48H22C16.5 48 12 43.5 12 38C12 33 15.6 28.8 20.5 28.1C22.2 21.8 28 17 35 17C43.3 17 50 23.7 50 32C50 32.7 49.9 33.3 49.8 34C53.3 35.3 56 38.8 56 43C56 45.8 52.4 48 48 48Z" fill="url(#cloud-glass-grad)" stroke="rgba(255,255,255,0.25)" stroke-width="1.2"/>
      <defs>
        <linearGradient id="cloud-glass-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.7)"/>
          <stop offset="100%" stop-color="rgba(203,213,225,0.4)"/>
        </linearGradient>
      </defs>
    </svg>
  `,

  // Few Clouds Night (Moon with Cloud)
  fewCloudsNight: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M34 16C28 16 23.5 20.5 23.5 26.5C23.5 29.5 24.7 32.2 26.7 34.1C21.6 33.1 18 28.9 18 23.8C18 17.8 22.8 13 28.8 13C30.8 13 32.7 13.5 34 14.5V16Z" fill="#c7d2fe"/>
      <path d="M48 48H22C16.5 48 12 43.5 12 38C12 33 15.6 28.8 20.5 28.1C22.2 21.8 28 17 35 17C43.3 17 50 23.7 50 32C50 32.7 49.9 33.3 49.8 34C53.3 35.3 56 38.8 56 43C56 45.8 52.4 48 48 48Z" fill="url(#cloud-glass-grad)" stroke="rgba(255,255,255,0.25)" stroke-width="1.2"/>
    </svg>
  `,

  // Overcast / Cloudy
  clouds: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M38 20C32.5 20 27.8 23.8 26.4 29C25.6 28.7 24.8 28.5 24 28.5C18.5 28.5 14 33 14 38.5C14 44 18.5 48.5 24 48.5H46C51.5 48.5 56 44 56 38.5C56 33.3 52 29 46.9 28.6C45.6 23.6 42.2 20 38 20Z" fill="url(#cloud-dark-grad)" stroke="rgba(255,255,255,0.2)" stroke-width="1.2"/>
      <defs>
        <linearGradient id="cloud-dark-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(226,232,240,0.65)"/>
          <stop offset="100%" stop-color="rgba(148,163,184,0.4)"/>
        </linearGradient>
      </defs>
    </svg>
  `,

  // Rain / Drizzle
  rain: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M46 42H22C17 42 13 38 13 33C13 28.5 16.3 24.7 20.7 24C22.2 18.3 27.5 14 33.8 14C41.3 14 47.3 20 47.3 27.5C47.3 28.1 47.2 28.7 47.1 29.3C50.2 30.5 52.6 33.6 52.6 37.4C52.6 39.9 49.4 42 46 42Z" fill="url(#cloud-glass-grad)" stroke="rgba(255,255,255,0.25)" stroke-width="1.2"/>
      <g stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round">
        <line x1="22" y1="46" x2="19" y2="54"/>
        <line x1="32" y1="46" x2="29" y2="54"/>
        <line x1="42" y1="46" x2="39" y2="54"/>
      </g>
    </svg>
  `,

  // Heavy Rain
  heavyRain: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M46 38H22C17 38 13 34 13 29C13 24.5 16.3 20.7 20.7 20C22.2 14.3 27.5 10 33.8 10C41.3 10 47.3 16 47.3 23.5C47.3 24.1 47.2 24.7 47.1 25.3C50.2 26.5 52.6 29.6 52.6 33.4C52.6 35.9 49.4 38 46 38Z" fill="url(#cloud-dark-grad)" stroke="rgba(255,255,255,0.2)" stroke-width="1.2"/>
      <g stroke="#06b6d4" stroke-width="2.5" stroke-linecap="round">
        <line x1="20" y1="43" x2="16" y2="53"/>
        <line x1="29" y1="43" x2="25" y2="53"/>
        <line x1="38" y1="43" x2="34" y2="53"/>
        <line x1="47" y1="43" x2="43" y2="53"/>
      </g>
    </svg>
  `,

  // Thunderstorm
  thunderstorm: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M46 38H22C17 38 13 34 13 29C13 24.5 16.3 20.7 20.7 20C22.2 14.3 27.5 10 33.8 10C41.3 10 47.3 16 47.3 23.5C47.3 24.1 47.2 24.7 47.1 25.3C50.2 26.5 52.6 29.6 52.6 33.4C52.6 35.9 49.4 38 46 38Z" fill="url(#cloud-dark-grad)" stroke="rgba(255,255,255,0.2)" stroke-width="1.2"/>
      <polygon points="34,38 27,48 33,48 30,58 41,46 35,46" fill="#facc15" stroke="#ca8a04" stroke-width="0.8"/>
    </svg>
  `,

  // Snow
  snow: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M46 40H22C17 40 13 36 13 31C13 26.5 16.3 22.7 20.7 22C22.2 16.3 27.5 12 33.8 12C41.3 12 47.3 18 47.3 25.5C47.3 26.1 47.2 26.7 47.1 27.3C50.2 28.5 52.6 31.6 52.6 35.4C52.6 37.9 49.4 40 46 40Z" fill="url(#cloud-glass-grad)" stroke="rgba(255,255,255,0.25)" stroke-width="1.2"/>
      <g fill="#bae6fd">
        <circle cx="23" cy="48" r="2.5"/>
        <circle cx="33" cy="51" r="2.8"/>
        <circle cx="43" cy="47" r="2.2"/>
      </g>
    </svg>
  `,

  // Mist / Fog / Atmosphere
  mist: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="var(--theme-accent)" stroke-width="2.5" stroke-linecap="round" opacity="0.85">
        <line x1="16" y1="24" x2="48" y2="24"/>
        <line x1="12" y1="32" x2="52" y2="32"/>
        <line x1="18" y1="40" x2="46" y2="40"/>
        <line x1="22" y1="48" x2="42" y2="48"/>
      </g>
    </svg>
  `,

  // Wind / Breeze
  wind: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 26H38C41.3 26 44 23.3 44 20C44 16.7 41.3 14 38 14C34.7 14 32 16.7 32 20" stroke="var(--theme-accent)" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M16 34H46C49.3 34 52 36.7 52 40C52 43.3 49.3 46 46 46C42.7 46 40 43.3 40 40" stroke="var(--theme-accent)" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M10 42H28" stroke="var(--theme-accent)" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
    </svg>
  `,

  // UI Icons
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  clear: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  location: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>`,
  sun: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
  moon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
  settings: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
  refresh: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
  alert: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
  check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  sparkles: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>`,

  // Instruments
  windSpeed: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg>`,
  barometer: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m14 14-4-4"></path><path d="M12 6v2"></path><path d="M6 12h2"></path><path d="M16 12h2"></path></svg>`,
  humidity: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`,
  visibility: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  uv: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`,
  sunrise: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v6"></path><path d="m4.93 10.93 1.41 1.41"></path><path d="M2 18h2"></path><path d="M20 18h2"></path><path d="m19.07 10.93-1.41 1.41"></path><path d="M22 22H2"></path><path d="m16 6-4-4-4 4"></path><path d="M16 18a4 4 0 0 0-8 0"></path></svg>`,
  sunset: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V2"></path><path d="m4.93 10.93 1.41 1.41"></path><path d="M2 18h2"></path><path d="M20 18h2"></path><path d="m19.07 10.93-1.41 1.41"></path><path d="M22 22H2"></path><path d="m8 4 4 4 4-4"></path><path d="M16 18a4 4 0 0 0-8 0"></path></svg>`
};

/**
 * Maps weather condition key and day/night status to matching SVG icon.
 */
export function getWeatherIcon(conditionKey, isDay = true) {
  switch (conditionKey) {
    case 'clear':
      return isDay ? ICONS.clearDay : ICONS.clearNight;
    case 'few-clouds':
    case 'scattered-clouds':
      return isDay ? ICONS.fewCloudsDay : ICONS.fewCloudsNight;
    case 'clouds':
    case 'overcast':
      return ICONS.clouds;
    case 'drizzle':
    case 'rain':
      return ICONS.rain;
    case 'heavy-rain':
      return ICONS.heavyRain;
    case 'thunderstorm':
      return ICONS.thunderstorm;
    case 'snow':
      return ICONS.snow;
    case 'mist':
    case 'fog':
    case 'haze':
    case 'atmosphere':
      return ICONS.mist;
    case 'wind':
      return ICONS.wind;
    default:
      return isDay ? ICONS.clearDay : ICONS.clearNight;
  }
}
