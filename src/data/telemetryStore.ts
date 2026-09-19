import { create } from 'zustand';
import type {
  TelemetryState, GPSData, WheelData, PotentiometerData, IMUData,
  SuspensionData, RoadData, SystemData, LogEntry, TelemetryPoint, SuspensionMode, DataSource
} from './types';

// Maximum history points to keep (~5 min at 4Hz)
const MAX_HISTORY = 1200;
const MAX_LOG = 150;

const initialGPS: GPSData = {
  latitude: 12.9716,
  longitude: 77.5946,
  speed: 0,
  heading: 45,
  altitude: 920,
  satellites: 7,
  fixType: '3D',
  hdop: 1.2,
  status: 'online',
};

const initialWheel: WheelData = {
  rpm: 0,
  speed: 0,
  pulseCount: 0,
  pulseFrequency: 0,
  status: 'online',
};

const initialPot: PotentiometerData = {
  frontPosition: 120,
  frontRawAdc: 512,
  frontTravelPercent: 50,
  rearPosition: 110,
  rearRawAdc: 490,
  rearTravelPercent: 48,
  status: 'online',
};

const initialIMU: IMUData = {
  ax: 0, ay: 0, az: -9.81,
  gx: 0, gy: 0, gz: 0,
  pitch: 0, roll: 0, yaw: 0,
  status: 'online',
};

const initialSuspension: SuspensionData = {
  frontPosition: 120,
  rearPosition: 110,
  frontServoAngle: 90,
  rearServoAngle: 85,
  frontDamping: 78,
  rearDamping: 62,
  frontTarget: 120,
  rearTarget: 110,
  mode: 'adaptive',
  autoAdjusting: true,
};

const initialRoad: RoadData = {
  condition: 'rough',
  surface: 'asphalt',
  roughness: 'medium',
  quality: 72,
  potholeDetected: true,
  potholeDistance: 12.4,
  potholeEta: 1.8,
  confidence: 92,
  recommendedAction: 'INCREASE DAMPING +18%',
  features: [
    { id: 'f1', type: 'smooth', label: 'Smooth section', distance: 0, severity: 'low', detected: true },
    { id: 'f2', type: 'bump', label: 'Small bump', distance: 6.2, severity: 'low', detected: true },
    { id: 'f3', type: 'pothole', label: 'Pothole ahead', distance: 12.4, severity: 'high', detected: true },
  ],
  roadProfile: Array.from({ length: 64 }, (_, i) => {
    if (i > 48 && i < 56) return 0.4 + Math.random() * 0.3;
    if (i > 32 && i < 36) return 0.15 + Math.random() * 0.1;
    return Math.random() * 0.06;
  }),
};

const initialSystem: SystemData = {
  status: 'online',
  dataSource: 'simulation',
  uptime: 0,
  lastUpdate: Date.now(),
  piConnected: false,
  wsUrl: 'ws://raspberrypi.local:8765',
};

function now(): string {
  return new Date().toLocaleTimeString('en-US', { hour12: false });
}

const initialLog: LogEntry[] = [
  { id: '1', timestamp: now(), message: 'SYSTEM BOOT — RoadDNA v1.0.0-alpha', level: 'system' },
  { id: '2', timestamp: now(), message: 'GPS FIX ACQUIRED — 3D FIX, 7 satellites', level: 'success' },
  { id: '3', timestamp: now(), message: 'IMU CALIBRATION COMPLETE', level: 'info' },
  { id: '4', timestamp: now(), message: 'HALL SENSOR ACTIVE — pulse detection enabled', level: 'info' },
  { id: '5', timestamp: now(), message: 'POTENTIOMETER CALIBRATED — travel range set', level: 'info' },
  { id: '6', timestamp: now(), message: 'ROAD INTELLIGENCE ENGINE STARTED', level: 'system' },
  { id: '7', timestamp: now(), message: 'SUSPENSION MODE: ADAPTIVE', level: 'info' },
  { id: '8', timestamp: now(), message: 'ROAD PROFILE UPDATED — surface scan active', level: 'info' },
];

export const useTelemetry = create<TelemetryState>((set) => ({
  gps: initialGPS,
  wheel: initialWheel,
  potentiometer: initialPot,
  imu: initialIMU,
  suspension: initialSuspension,
  road: initialRoad,
  system: initialSystem,
  log: initialLog,
  history: [],

  updateGPS: (data) => set((s) => ({ gps: { ...s.gps, ...data } })),
  updateWheel: (data) => set((s) => ({ wheel: { ...s.wheel, ...data } })),
  updatePotentiometer: (data) => set((s) => ({ potentiometer: { ...s.potentiometer, ...data } })),
  updateIMU: (data) => set((s) => ({ imu: { ...s.imu, ...data } })),
  updateSuspension: (data) => set((s) => ({ suspension: { ...s.suspension, ...data } })),
  updateRoad: (data) => set((s) => ({ road: { ...s.road, ...data } })),

  setSuspensionMode: (mode: SuspensionMode) =>
    set((s) => ({ suspension: { ...s.suspension, mode } })),

  setDataSource: (source: DataSource) =>
    set((s) => ({ system: { ...s.system, dataSource: source } })),

  addLog: (entry) =>
    set((s) => {
      const log = [
        ...s.log,
        { ...entry, id: Date.now().toString() + Math.random().toString(36).slice(2) },
      ].slice(-MAX_LOG);
      return { log };
    }),

  pushHistory: (point) =>
    set((s) => ({
      history: [...s.history, point].slice(-MAX_HISTORY),
    })),
}));
