/**
 * ATMOS — Meteorological Narrative Generator ("Today's Atmosphere")
 * Produces deterministic, articulate summaries based on real scientific telemetry
 */

export class AtmosphereStoryGenerator {
  /**
   * Generates deterministic meteorological briefing
   */
  static generateStory(telemetry) {
    if (!telemetry) return { narrative: '', pills: [] };

    const {
      city = 'the area',
      temp = 20,
      feelsLike = 20,
      humidity = 50,
      pressure = 1013,
      windSpeed = 10,
      windDirectionCardinal = 'NW',
      conditionKey = 'clear',
      description = 'clear sky',
      uv = null,
      unitSystem = 'metric'
    } = telemetry;

    const tempUnit = unitSystem === 'imperial' ? '°F' : '°C';
    const speedUnit = unitSystem === 'imperial' ? 'mph' : 'km/h';
    const pills = [];

    // 1. Thermal classification
    // Normalize temp to Celsius for threshold analysis
    const tempInC = unitSystem === 'imperial' ? ((temp - 32) * 5) / 9 : temp;
    let thermalDesc = '';

    if (tempInC <= 0) {
      thermalDesc = `Sub-freezing, arctic conditions settle across ${city} with ambient readings hovering near ${temp}${tempUnit}`;
      pills.push({ text: 'Sub-Zero Freeze', icon: 'snow' });
    } else if (tempInC < 12) {
      thermalDesc = `Crisp, bracing temperatures define ${city}'s atmosphere today at ${temp}${tempUnit}`;
      pills.push({ text: 'Cool & Brisk', icon: 'wind' });
    } else if (tempInC < 22) {
      thermalDesc = `Temperate and pleasantly balanced conditions encompass ${city} with temperatures reaching ${temp}${tempUnit}`;
      pills.push({ text: 'Mild Atmosphere', icon: 'sun' });
    } else if (tempInC < 30) {
      thermalDesc = `Warm, radiant air envelops ${city} with daytime temperatures peaking around ${temp}${tempUnit}`;
      pills.push({ text: 'Pleasant Warmth', icon: 'sun' });
    } else {
      thermalDesc = `Substantial thermal intensity dominates ${city} with elevated temperatures testing ${temp}${tempUnit}`;
      pills.push({ text: 'High Thermal Index', icon: 'sun' });
    }

    // Feels-like delta
    const delta = Math.abs(feelsLike - temp);
    let feelsLikeNote = '';
    if (delta >= 2) {
      feelsLikeNote = `, though convective airflow and moisture make it feel closer to ${feelsLike}${tempUnit}`;
    }

    // 2. Barometric pressure dynamics
    let pressureDesc = '';
    if (pressure >= 1020) {
      pressureDesc = `A sturdy high-pressure ridge (${pressure} hPa) anchors the local airspace, establishing atmospheric stability and suppressing sudden cloud turbulence`;
      pills.push({ text: 'High Pressure Ridge', icon: 'barometer' });
    } else if (pressure <= 1008) {
      pressureDesc = `A transient low-pressure depression (${pressure} hPa) is sweeping through the boundary layer, fostering atmospheric instability`;
      pills.push({ text: 'Low Pressure Trough', icon: 'barometer' });
    } else {
      pressureDesc = `Surface barometric pressure is holding remarkably steady at ${pressure} hPa`;
    }

    // 3. Moisture & Humidity
    let humidityDesc = '';
    if (humidity >= 80) {
      humidityDesc = `Elevated relative moisture (${humidity}%) imparts a noticeable density to the air`;
      pills.push({ text: 'High Moisture', icon: 'humidity' });
    } else if (humidity <= 35) {
      humidityDesc = `Dry continental air (${humidity}% humidity) maintains sharp optical clarity across the horizon`;
      pills.push({ text: 'Crisp & Dry', icon: 'visibility' });
    } else {
      humidityDesc = `Relative humidity sits at an optimal ${humidity}%`;
    }

    // 4. Wind dynamics
    let windDesc = '';
    const speedVal = Math.round(windSpeed);
    if (speedVal < 8) {
      windDesc = `calm breezes gently ventilate the area`;
    } else if (speedVal < 25) {
      windDesc = `${windDirectionCardinal} airflow at ${speedVal} ${speedUnit} sustains steady air displacement`;
      pills.push({ text: `${windDirectionCardinal} Breeze ${speedVal} ${speedUnit}`, icon: 'windSpeed' });
    } else {
      windDesc = `stout, gusty winds arriving from the ${windDirectionCardinal} at ${speedVal} ${speedUnit} will be noticeable in open corridors`;
      pills.push({ text: `Elevated Wind: ${speedVal} ${speedUnit}`, icon: 'windSpeed' });
    }

    // 5. Environmental & UV outlook
    let outlook = '';
    if (conditionKey === 'rain' || conditionKey === 'drizzle' || conditionKey === 'heavy-rain') {
      outlook = `Active precipitation continues across the station; expect slick surface transits and reduced visibility.`;
      pills.push({ text: 'Precipitation Active', icon: 'humidity' });
    } else if (conditionKey === 'snow') {
      outlook = `Snow accumulation is present; ground traction and thermal insulation should be prioritized.`;
    } else if (conditionKey === 'thunderstorm') {
      outlook = `Thunderstorm cells are present; seek sheltered structures and monitor convective updates.`;
      pills.push({ text: 'Convective Storm Alert', icon: 'alert' });
    } else if (uv !== null && uv >= 6) {
      outlook = `Solar ultraviolet radiation is elevated at index ${uv}; broad-spectrum sun defense is advised during midday exposure.`;
      pills.push({ text: `UV Alert: Index ${uv}`, icon: 'uv' });
    } else {
      outlook = `Overall atmospheric parameters provide a favorable window for outdoor operations.`;
    }

    const narrative = `${thermalDesc}${feelsLikeNote}. ${pressureDesc}. ${humidityDesc}, while ${windDesc}. ${outlook}`;

    return {
      narrative,
      pills: pills.slice(0, 4) // Show top 4 key takeaway tags
    };
  }
}
