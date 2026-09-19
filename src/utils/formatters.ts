// ============================================================
// RoadDNA — Utility Formatters (Industrial Motorsport Palette)
// ============================================================

export function formatLatLng(val: number, decimals = 6): string {
  return val.toFixed(decimals);
}

export function formatHeading(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const idx = Math.round(((deg % 360) / 360) * 16) % 16;
  return `${Math.round(deg)}° ${directions[idx]}`;
}

export function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}m`;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

export function formatSpeed(kmh: number): string {
  return `${kmh.toFixed(1)} km/h`;
}

export function formatAngle(deg: number): string {
  return `${deg.toFixed(1)}°`;
}

export function formatPercent(val: number): string {
  return `${val.toFixed(1)}%`;
}

export function formatMm(val: number): string {
  return `${val.toFixed(1)} mm`;
}

export function formatAccel(val: number): string {
  return `${val.toFixed(3)} m/s²`;
}

export function formatGyro(val: number): string {
  return `${val.toFixed(2)} °/s`;
}

export function conditionColor(condition: string): string {
  switch (condition) {
    case 'smooth': return '#718A61';    // Muted Green
    case 'rough': return '#C87532';     // Burnt Orange
    case 'bumpy': return '#D99A2B';     // Racing Amber
    case 'potholed': return '#B84D45';  // Muted Red
    case 'hazardous': return '#B84D45'; // Muted Red
    default: return '#92989D';          // Cool Grey
  }
}

export function roughnessColor(roughness: string): string {
  switch (roughness) {
    case 'smooth': case 'low': return '#718A61'; // Muted Green
    case 'medium': return '#D99A2B';            // Racing Amber
    case 'high': return '#C87532';              // Burnt Orange
    case 'severe': return '#B84D45';            // Muted Red
    default: return '#92989D';                 // Cool Grey
  }
}

export function qualityColor(quality: number): string {
  if (quality >= 80) return '#718A61'; // Muted Green
  if (quality >= 60) return '#D99A2B'; // Racing Amber
  if (quality >= 40) return '#C87532'; // Burnt Orange
  return '#B84D45';                    // Muted Red
}
