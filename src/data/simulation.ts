// ============================================================
// RoadDNA — Simulation Engine
// Generates realistic sensor data at ~4Hz
// Replace with WebSocket feed for Raspberry Pi integration
// ============================================================

import { useTelemetry } from './telemetryStore';
import type { TelemetryPoint, LogEntry } from './types';

let intervalId: ReturnType<typeof setInterval> | null = null;
let uptimeInterval: ReturnType<typeof setInterval> | null = null;
let tick = 0;

// Simulation parameters
const SIM = {
  baseSpeed: 35,          // km/h base speed
  wheelCircumference: 1.9, // meters (typical motorcycle)
  speedVariance: 8,
  potholeChance: 0.004,   // chance per tick of pothole event
  bumpChance: 0.008,
  roughSectionDuration: 60, // ticks
};

// Smooth noise function
function smoothNoise(t: number, freq: number, amp: number): number {
  return Math.sin(t * freq * 0.01) * amp + Math.sin(t * freq * 0.037) * amp * 0.4;
}

// Clamp
function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

// Random in range
function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

// Format timestamp
function ts() {
  return new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

let logCount = 0;
function log(message: string, level: LogEntry['level'] = 'info') {
  logCount++;
  useTelemetry.getState().addLog({ timestamp: ts(), message, level });
}

// Road event state
let potholeActive = false;
let potholeDistance = 0;
let roughSection = 0;
let bumpActive = false;
let bumpDistance = 0;

function generateTick() {
  tick++;
  const store = useTelemetry.getState();
  const t = tick;

  // ── GPS ──────────────────────────────────────
  const speed = clamp(SIM.baseSpeed + smoothNoise(t, 1.2, SIM.speedVariance), 8, 65);
  const heading = (45 + smoothNoise(t, 0.3, 15) + 360) % 360;
  const latDrift = (speed / 111320) * 0.02;
  const lonDrift = (speed / 111320) * 0.02;

  store.updateGPS({
    speed: parseFloat(speed.toFixed(1)),
    heading: parseFloat(heading.toFixed(1)),
    latitude: parseFloat((store.gps.latitude + latDrift * 0.001).toFixed(6)),
    longitude: parseFloat((store.gps.longitude + lonDrift * 0.001).toFixed(6)),
    satellites: clamp(Math.round(7 + smoothNoise(t, 0.5, 1.5)), 4, 12),
  });

  // ── Wheel ────────────────────────────────────
  const wheelRpm = (speed * 1000) / (60 * SIM.wheelCircumference);
  const pulseFreq = (wheelRpm / 60) * 20; // 20 magnets on wheel
  store.updateWheel({
    rpm: parseFloat(wheelRpm.toFixed(0)),
    speed: parseFloat(speed.toFixed(1)),
    pulseFrequency: parseFloat(pulseFreq.toFixed(1)),
    pulseCount: store.wheel.pulseCount + Math.round(pulseFreq * 0.25),
  });

  // ── Pothole/bump event trigger ────────────────
  if (!potholeActive && Math.random() < SIM.potholeChance) {
    potholeActive = true;
    potholeDistance = rand(15, 35);
    log('ROUGH SURFACE DETECTED — road profile scan in progress', 'warning');
    setTimeout(() => log('POTHOLE PREDICTION GENERATED — confidence 92%', 'system'), 800);
  }
  if (!bumpActive && Math.random() < SIM.bumpChance) {
    bumpActive = true;
    bumpDistance = rand(6, 18);
  }
  if (Math.random() < 0.01 && roughSection === 0) {
    roughSection = SIM.roughSectionDuration;
    log('ROAD CONDITION: ROUGH — adaptive suspension engaged', 'warning');
  }
  if (roughSection > 0) roughSection--;
  if (potholeActive) {
    potholeDistance -= speed / (4 * 3.6); // distance decreases at vehicle speed
    if (potholeDistance <= 0) {
      potholeActive = false;
      log('POTHOLE IMPACT — suspension absorbed', 'success');
      log('SERVO POSITION UPDATED — damping +18%', 'system');
    }
  }
  if (bumpActive) {
    bumpDistance -= speed / (4 * 3.6);
    if (bumpDistance <= 0) bumpActive = false;
  }

  // ── IMU ──────────────────────────────────────
  const roughFactor = roughSection > 0 ? 3.5 : 1;
  const potholeFactor = (potholeActive && potholeDistance < 2) ? 6 : 1;
  const bumpFactor = (bumpActive && bumpDistance < 1) ? 3 : 1;
  const noiseMult = roughFactor * Math.max(potholeFactor, bumpFactor);

  const ax = parseFloat((smoothNoise(t, 4, 0.3 * noiseMult) + rand(-0.1, 0.1)).toFixed(3));
  const ay = parseFloat((smoothNoise(t, 3.7, 0.2 * noiseMult) + rand(-0.05, 0.05)).toFixed(3));
  const az = parseFloat((-9.81 + smoothNoise(t, 5, 0.4 * noiseMult)).toFixed(3));
  const pitch = parseFloat((smoothNoise(t, 1.5, 2) + (roughSection > 0 ? rand(-4, 4) : 0)).toFixed(2));
  const roll = parseFloat((smoothNoise(t, 2, 6) + rand(-1, 1)).toFixed(2));
  const yaw = parseFloat(heading.toFixed(2));

  store.updateIMU({
    ax, ay, az,
    gx: parseFloat((smoothNoise(t, 2.5, 8 * roughFactor)).toFixed(2)),
    gy: parseFloat((smoothNoise(t, 3, 5 * roughFactor)).toFixed(2)),
    gz: parseFloat((smoothNoise(t, 1.8, 12 * roughFactor)).toFixed(2)),
    pitch, roll, yaw,
  });

  // ── Suspension ────────────────────────────────
  const mode = store.suspension.mode;
  const modeGain = { comfort: 0.5, normal: 1, sport: 1.5, adaptive: 1.2, manual: 0.8 }[mode];
  const frontBase = 120 + smoothNoise(t, 2, 8 * roughFactor * modeGain);
  const rearBase  = 110 + smoothNoise(t, 2.3, 7 * roughFactor * modeGain);
  const frontSusp = clamp(frontBase + (potholeActive && potholeDistance < 3 ? rand(-20, 30) : 0), 60, 200);
  const rearSusp  = clamp(rearBase  + (potholeActive && potholeDistance < 3 ? rand(-15, 25) : 0), 60, 200);
  const frontDamp = clamp(78 + (potholeActive ? 18 : 0) + smoothNoise(t, 0.8, 5), 30, 100);
  const rearDamp  = clamp(62 + (potholeActive ? 15 : 0) + smoothNoise(t, 0.9, 5), 30, 100);
  const frontAngle = clamp(90 + smoothNoise(t, 1.5, 12 * modeGain), 45, 135);
  const rearAngle  = clamp(85 + smoothNoise(t, 1.6, 10 * modeGain), 45, 135);

  store.updateSuspension({
    frontPosition: parseFloat(frontSusp.toFixed(1)),
    rearPosition: parseFloat(rearSusp.toFixed(1)),
    frontServoAngle: parseFloat(frontAngle.toFixed(1)),
    rearServoAngle: parseFloat(rearAngle.toFixed(1)),
    frontDamping: parseFloat(frontDamp.toFixed(1)),
    rearDamping: parseFloat(rearDamp.toFixed(1)),
    frontTarget: parseFloat((frontSusp + smoothNoise(t, 3, 5)).toFixed(1)),
    rearTarget: parseFloat((rearSusp + smoothNoise(t, 3.2, 5)).toFixed(1)),
    autoAdjusting: potholeActive || roughSection > 0,
  });

  // ── Potentiometer ────────────────────────────
  const fTravel = clamp((frontSusp - 60) / 140 * 100, 0, 100);
  const rTravel = clamp((rearSusp - 60) / 140 * 100, 0, 100);
  store.updatePotentiometer({
    frontPosition: parseFloat(frontSusp.toFixed(1)),
    frontRawAdc: Math.round(fTravel / 100 * 1023),
    frontTravelPercent: parseFloat(fTravel.toFixed(1)),
    rearPosition: parseFloat(rearSusp.toFixed(1)),
    rearRawAdc: Math.round(rTravel / 100 * 1023),
    rearTravelPercent: parseFloat(rTravel.toFixed(1)),
  });

  // ── Road ─────────────────────────────────────
  const roughness = roughSection > 40 ? 'high' : roughSection > 0 ? 'medium' : 'low';
  const condition = potholeActive && potholeDistance < 20 ? 'potholed' : roughSection > 0 ? 'rough' : 'smooth';
  const conf = potholeActive ? clamp(92 + rand(-3, 3), 80, 99) : clamp(rand(20, 45), 10, 60);
  const quality = clamp(72 - (roughSection > 0 ? 15 : 0) - (potholeActive ? 20 : 0) + rand(-3, 3), 10, 95);

  const newProfile = Array.from({ length: 64 }, (_, i) => {
    const dist = i / 64 * 50; // 0-50m ahead
    if (potholeActive && dist > potholeDistance - 2 && dist < potholeDistance + 2) {
      return 0.4 + Math.random() * 0.35;
    }
    if (bumpActive && dist > bumpDistance - 1 && dist < bumpDistance + 1) {
      return 0.15 + Math.random() * 0.1;
    }
    return Math.random() * (roughSection > 0 ? 0.12 : 0.04);
  });

  store.updateRoad({
    condition,
    roughness: roughness as any,
    quality: parseFloat(quality.toFixed(0)),
    potholeDetected: potholeActive && potholeDistance > 0,
    potholeDistance: potholeActive ? parseFloat(potholeDistance.toFixed(1)) : 0,
    potholeEta: potholeActive ? parseFloat((potholeDistance / (speed / 3.6)).toFixed(1)) : 0,
    confidence: parseFloat(conf.toFixed(0)),
    recommendedAction: potholeActive ? 'INCREASE DAMPING +18%' : roughSection > 0 ? 'MODERATE DAMPING +8%' : 'MAINTAIN CURRENT SETTINGS',
    roadProfile: newProfile,
    features: [
      { id: 'f1', type: 'smooth', label: 'Smooth section', distance: 0, severity: 'low', detected: true },
      ...(bumpActive ? [{ id: 'f2', type: 'bump' as const, label: 'Small bump', distance: parseFloat(bumpDistance.toFixed(1)), severity: 'low' as const, detected: true }] : []),
      ...(potholeActive && potholeDistance > 0 ? [{ id: 'f3', type: 'pothole' as const, label: 'Pothole ahead', distance: parseFloat(potholeDistance.toFixed(1)), severity: 'high' as const, detected: true }] : []),
    ],
  });

  // ── History ───────────────────────────────────
  const point: TelemetryPoint = {
    time: Date.now(),
    frontSuspension: parseFloat(frontSusp.toFixed(1)),
    rearSuspension: parseFloat(rearSusp.toFixed(1)),
    ax,
    speed: parseFloat(speed.toFixed(1)),
    frontServo: parseFloat(frontAngle.toFixed(1)),
    rearServo: parseFloat(rearAngle.toFixed(1)),
  };
  store.pushHistory(point);

  // ── Periodic log messages ─────────────────────
  if (t % 20 === 0) log('ROAD PROFILE UPDATED — 50m scan ahead', 'info');
  if (t % 40 === 0) log(`GPS FIX: ${store.gps.satellites} satellites — HDOP 1.${Math.round(rand(1, 9))}`, 'info');
  if (t % 60 === 0) log(`SPEED: ${parseFloat(speed.toFixed(1))} km/h — heading ${parseFloat(heading.toFixed(0))}°`, 'info');
  if (potholeActive && potholeDistance > 0 && potholeDistance < 20 && t % 4 === 0) {
    log(`SUSPENSION ADJUSTMENT — damping +18% — ETA ${parseFloat(potholeDistance.toFixed(1))}m`, 'system');
  }
}

export function startSimulation() {
  if (intervalId) return;
  log('SIMULATION MODE ACTIVE — synthetic sensor data enabled', 'system');
  intervalId = setInterval(generateTick, 250); // 4 Hz
  uptimeInterval = setInterval(() => {
    const store = useTelemetry.getState();
    store.updateRoad({}); // trigger system uptime
    useTelemetry.setState((s) => ({
      system: { ...s.system, uptime: s.system.uptime + 1, lastUpdate: Date.now() },
    }));
  }, 1000);
}

export function stopSimulation() {
  if (intervalId) { clearInterval(intervalId); intervalId = null; }
  if (uptimeInterval) { clearInterval(uptimeInterval); uptimeInterval = null; }
}
