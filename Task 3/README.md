# ATMOS — Planetary Weather Telemetry

> *"Weather, in a different light."*

**ATMOS** is a high-precision, cinematic live weather telemetry application engineered with a modern aerospace/meteorological startup identity. Departing from generic dashboard templates and emoji-heavy consumer apps, ATMOS presents atmospheric data through an editorial lens: oversized display typography, responsive fluid gradients, 60fps canvas particle layers, scientific instrumentation, and deterministic meteorological briefings.

---

## ✦ Design Concept & Creative Direction

ATMOS merges cinematic environmental atmosphere with scientific precision:
- **Atmospheric Chromatic Gradients**: The interface dynamically morphs its color palette and ambient glows according to the searched station's real-time weather and local daylight phase:
  - ☀️ **Clear Day**: Warm amber, solar gold, and soft peach with drifting ambient solar rays.
  - 🌙 **Clear Night**: Midnight navy, deep indigo aura, and a restrained twinkling starfield.
  - 🌧️ **Rain / Drizzle**: Deep ocean slate, cyan highlights, and gentle falling rain streaks.
  - ☁️ **Cloudy / Overcast**: Muted slate grey, lavender undertones, and slow volumetric cloud silhouettes.
  - ❄️ **Snow**: Crystalline icy blue, soft white, and drifting snowflakes with wind turbulence.
  - ⚡ **Thunderstorm**: Electric violet, deep stormy navy, and subtle distant lightning flashes.
  - 🌫️ **Mist / Fog**: Ethereal pearl grey and stratified horizontal atmospheric layers.
- **Editorial Typography**: Striking oversized temperature figures powered by *Outfit*, crisp interface labels via *Inter*, and monospaced scientific telemetry data using *JetBrains Mono*.
- **Tactile Glassmorphism**: High-performance backdrop-filtered frosted glass panels, subtle 1px translucent borders, and restrained directional highlights.
- **Micro-Animations & Telemetry Dials**: Directional compass rose for wind vectors, dynamic barometer gauges, UV risk spectrum markers, and a daylight arc tracking the sun's trajectory across the sky.

---

## ✦ Core Features

### 1. Minimal Top Navigation
- **Custom ATMOS Wordmark & Orbital Symbol**: Vector telemetry brand mark.
- **Global Search**: Search any city or station worldwide with keyboard shortcut (`/`), clear button, real-time loading spinner, and keyboard navigation.
- **Recent Observations**: LocalStorage-persisted station history with quick recall and one-click clear.
- **Curated Global Stations**: Fast one-click access to requested climate hubs (*SRI LANKA - COLOMBO, INDIA - DILLI, UK, USA, MELBORN*).
- **Metric / Imperial Unit Switcher**: Instant switching between Celsius (°C, km/h, km) and Fahrenheit (°F, mph, mi).
- **Orbital Geolocation**: Single-click GPS station acquisition with browser permissions handling.
- **Dark / Light Theme Modes**: Dark atmospheric mode as primary default with a titanium frosted-glass light mode alternative.
- **Feed Status & API Configuration**: Live provider status badge with modal settings dialog.

### 2. Cinematic Current-Weather Hero
- **Station Coordinates & Telemetry**: Precise Latitude, Longitude, and UTC offset.
- **Live Local Clock**: Ticking clock dynamically calculated against the searched city's actual timezone offset.
- **Massive Temperature Showcase**: Heroic display typography with animated smooth transitions.
- **Dynamic Scalable Vector Illustrations**: Handcrafted SVG illustrations representing exact atmospheric conditions.
- **Thermal Extremes & Feels-Like**: High/Low temperatures, apparent thermal comfort, and ephemeris sunrise/sunset times with daylight counters.

### 3. Precision Scientific Telemetry Grid
- **Vector // 01 (Wind Velocity)**: Speed in km/h or mph, cardinal direction heading, animated compass dial with rotated magnetic needle, and Beaufort wind force scale rating.
- **Baro // 02 (Atmospheric Pressure)**: Barometric reading in hPa, progress bar, and regional pressure system classification (*High Pressure Ridge*, *Balanced Ridge*, *Low Pressure Trough*).
- **Hygro // 03 (Moisture & Dew Point)**: Relative humidity percentage, progress track, and calculated dew point temperature ($T_{dp} = T - \frac{100 - RH}{5}$).
- **Optic // 04 (Visibility)**: Optical atmospheric range in km or miles with clarity indexing (*Crystal Clear*, *Moderate Haze*, *Reduced Visibility*).
- **Solar // 05 (UV Radiation)**: Real-time UV index with color-coded risk scale (*Low*, *Moderate*, *High*, *Very High*, *Extreme*) and skin safety guidance.
- **Orbit // 06 (Daylight Arc)**: Dynamic parabolic SVG ephemeris arc mapping the exact celestial sun position between sunrise and sunset based on station local time.

### 4. Deterministic "Today's Atmosphere" Briefing
- Generates an articulate, professional meteorological narrative synthesized from real retrieved API metrics (thermal conditions, barometric stability, humidity texture, wind ventilation, and solar/precipitation outlook).
- Completely transparent rules without relying on external generative AI APIs.
- Accompanied by key takeaway telemetry pills.

### 5. Five-Day Forecast Timeline
- **Strict Data Aggregation**: Aggregates OpenWeatherMap's 5-day / 3-hour data slices by **local calendar date** using the station's timezone offset. Does **not** present 3-hour intervals as daily forecasts.
- Calculates true daily minimum and maximum temperatures across all periods.
- Features relative temperature span bars visualizing where each day's thermal extremes sit within the 5-day cycle.
- Desktop horizontal timeline and mobile touch-friendly smooth horizontal scroll strip.

### 6. Dual Meteorological Feeds
- **OpenWeatherMap Integration**: Full support for commercial OWM `/data/2.5/weather` and `/data/2.5/forecast` endpoints with custom key configuration.
- **Open-Meteo Integration**: Instant, keyless, zero-setup live worldwide feed providing 100% operational real-time weather out of the box.
- Seamless provider switching via the top navigation badge or settings modal.

---

## ✦ Technology Stack

| Layer | Technology |
|---|---|
| **Core Architecture** | HTML5 semantic markup, ES6+ Modular JavaScript |
| **Bundler & Dev Server** | [Vite 8](https://vitejs.dev/) |
| **Styling & Design Tokens** | Pure Vanilla CSS3 (Custom Properties, CSS Grid, Flexbox, Glassmorphism) |
| **Visual FX** | HTML5 Canvas 60fps particle engine |
| **Icons** | Custom Scalable Vector Graphics (SVG) |
| **Typography** | Google Fonts (*Outfit*, *Inter*, *JetBrains Mono*) |
| **Testing** | Node.js Built-In Test Runner (`node --test`) |
| **Data APIs** | OpenWeatherMap API & Open-Meteo Forecast API |

---

## ✦ Getting Started & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [npm](https://www.npmjs.com/) v9.0.0 or higher

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd "Task 3"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   Copy the example environment configuration:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and insert your OpenWeatherMap API key:
   ```env
   VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key_here
   ```
   > *Note: If no API key is set, ATMOS automatically defaults to the keyless Open-Meteo live feed, remaining 100% functional out of the box! You can also enter your key directly inside the running application via the Settings modal.*

4. **Launch the development server**:
   ```bash
   npm run dev
   ```
   Open `http://127.0.0.1:5173/` in your browser.

5. **Execute the automated test suite**:
   ```bash
   npm test
   ```

6. **Create a production build**:
   ```bash
   npm run build
   ```

---

## ✦ API Key Configuration & Security Notice

### How to Obtain a Free OpenWeatherMap API Key
1. Visit [https://openweathermap.org/api](https://openweathermap.org/api).
2. Sign up for a free account.
3. Navigate to **API Keys** in your user dashboard and generate a key.
4. Copy the 32-character key into your `.env` file or into the ATMOS in-app settings modal.
5. *Note on activation*: New OpenWeatherMap keys typically require between 10 minutes and 2 hours to activate globally on their servers.

### Client-Side Security & Production Architecture
- Variables prefixed with `VITE_` in Vite applications are compiled into the client-side JavaScript bundle and are **visible to any end user** inspecting network traffic.
- `.env` is included in `.gitignore` to prevent committing secrets to version control.
- **Production Recommendation**: For public enterprise deployments requiring API key confidentiality, implement a backend proxy (e.g. Node.js Express server, Cloudflare Worker, or Vercel Serverless Function) that attaches the secret API key server-side.

---

## ✦ Known API Limitations

1. **OpenWeatherMap Free Tier**:
   - The free `/data/2.5/forecast` endpoint provides forecasts at 3-hour intervals up to 5 days. ATMOS aggregates these slices into daily values; midday hours are prioritized for daytime condition representation.
   - UV index is not included in the standard `/data/2.5/weather` free endpoint. When using OpenWeatherMap, the UV card displays a graceful `"N/A in Free Feed"` status. When using Open-Meteo, real-time UV radiation index is provided.
   - Standard rate limit: 60 calls/minute.

2. **Network Dependency**:
   - Live telemetry retrieval requires an active internet connection. If connectivity drops, ATMOS preserves the last successfully viewed weather station while displaying an offline notice with a retry action.

---

## ✦ Deployment Instructions

ATMOS is a static single-page application and can be hosted on any modern static hosting platform:

### Deploying to Vercel
```bash
npm install -g vercel
vercel
```
Set `VITE_OPENWEATHER_API_KEY` in the Vercel Project Settings > Environment Variables.

### Deploying to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploying to Cloudflare Pages / GitHub Pages
Build the production bundle:
```bash
npm run build
```
Deploy the generated `dist/` directory.

---

## ✦ Verification Checklist

| Requirement | Implementation Status | Notes |
|---|---|---|
| **Live Weather Integration** | ✅ Complete | Dual-feed architecture (OpenWeatherMap + Open-Meteo) |
| **5-Day Forecast Aggregation** | ✅ Complete | Aggregated by local calendar date from 3-hour slices |
| **Visual Atmosphere FX** | ✅ Complete | Dynamic background gradients + 60fps canvas particles |
| **Precision Telemetry** | ✅ Complete | Wind vector compass, Barometer, Humidity, UV, Daylight Arc |
| **Meteorological Story** | ✅ Complete | Deterministic "Today's Atmosphere" briefing |
| **Search & Recents** | ✅ Complete | Keyboard shortcut (`/`), recent searches, curated stations |
| **Unit Conversion** | ✅ Complete | Seamless Celsius / Fahrenheit toggling |
| **Responsive Design** | ✅ Complete | Tested from 320px mobile to 1440px+ ultra-wide desktop |
| **Accessibility & Motion** | ✅ Complete | Full `prefers-reduced-motion` compliance, ARIA live tags |
| **Test Suite** | ✅ Complete | 10/10 automated tests passing (`npm test`) |

---

*ATMOS — Meteorological telemetry engineered with aesthetic craftsmanship.*
