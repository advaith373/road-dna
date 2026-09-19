// ============================================================
// RoadDNA — TypeScript Type Definitions
// All telemetry data structures for sensors, road state, system
// ============================================================

export type SensorStatus = 'online' | 'warning' | 'offline';
export type SuspensionMode = 'comfort' | 'normal' | 'sport' | 'adaptive' | 'manual';
export type DataSource = 'simulation' | 'raspberry-pi';
export type SystemStatus = 'online' | 'degraded' | 'offline';
export type RoadSurface = 'asphalt' | 'gravel' | 'concrete' | 'wet' | 'dirt';
export type RoadRoughness = 'smooth' | 'low' | 'medium' | 'high' | 'severe';
export type RoadCondition = 'smooth' | 'rough' | 'bumpy' | 'potholed' | 'hazardous';

// GPS Sensor
export interface GPSData {
  latitude: number;
  longitude: number;
  speed: number;          // km/h
  heading: number;        // degrees 0-360
  altitude: number;       // meters
  satellites: number;
  fixType: '2D' | '3D' | 'no fix';
  hdop: number;           // horizontal dilution of precision
  status: SensorStatus;
}

// Hall Effect Sensor (wheel speed)
export interface WheelData {
  rpm: number;
  speed: number;          // km/h derived from RPM + wheel circumference
  pulseCount: number;     // total pulses since start
  pulseFrequency: number; // Hz
  status: SensorStatus;
}

// Linear Potentiometer (suspension travel)
export interface PotentiometerData {
  frontPosition: number;  // mm
  frontRawAdc: number;    // 0-1023
  frontTravelPercent: number; // 0-100%
  rearPosition: number;
  rearRawAdc: number;
  rearTravelPercent: number;
  status: SensorStatus;
}

// IMU (Inertial Measurement Unit)
export interface IMUData {
  ax: number; ay: number; az: number;  // m/s² (linear acceleration)
  gx: number; gy: number; gz: number;  // °/s (gyroscope)
  pitch: number;  // degrees
  roll: number;   // degrees
  yaw: number;    // degrees
  status: SensorStatus;
}

// Suspension Control
export interface SuspensionData {
  frontPosition: number;       // mm travel
  rearPosition: number;
  frontServoAngle: number;     // degrees 0-180
  rearServoAngle: number;
  frontDamping: number;        // 0-100%
  rearDamping: number;
  frontTarget: number;         // target position mm
  rearTarget: number;
  mode: SuspensionMode;
  autoAdjusting: boolean;
}

// Road Feature
export interface RoadFeature {
  id: string;
  type: 'smooth' | 'bump' | 'pothole' | 'rough' | 'obstacle';
  label: string;
  distance: number;    // meters ahead
  severity: 'low' | 'medium' | 'high';
  detected: boolean;
}

// Road Analysis
export interface RoadData {
  condition: RoadCondition;
  surface: RoadSurface;
  roughness: RoadRoughness;
  quality: number;             // 0-100
  potholeDetected: boolean;
  potholeDistance: number;     // meters
  potholeEta: number;          // seconds
  confidence: number;          // 0-100%
  recommendedAction: string;
  features: RoadFeature[];
  roadProfile: number[];       // terrain height data points for visualization
}

// System state
export interface SystemData {
  status: SystemStatus;
  dataSource: DataSource;
  uptime: number;              // seconds
  lastUpdate: number;          // timestamp ms
  piConnected: boolean;
  wsUrl: string;
}

// System log entry
export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  level: 'info' | 'system' | 'warning' | 'error' | 'success';
}

// Telemetry history point (for charts)
export interface TelemetryPoint {
  time: number;                // ms timestamp
  frontSuspension: number;
  rearSuspension: number;
  ax: number;
  speed: number;
  frontServo: number;
  rearServo: number;
}

// Root telemetry state
export interface TelemetryState {
  gps: GPSData;
  wheel: WheelData;
  potentiometer: PotentiometerData;
  imu: IMUData;
  suspension: SuspensionData;
  road: RoadData;
  system: SystemData;
  log: LogEntry[];
  history: TelemetryPoint[];
  
  // Actions
  updateGPS: (data: Partial<GPSData>) => void;
  updateWheel: (data: Partial<WheelData>) => void;
  updatePotentiometer: (data: Partial<PotentiometerData>) => void;
  updateIMU: (data: Partial<IMUData>) => void;
  updateSuspension: (data: Partial<SuspensionData>) => void;
  updateRoad: (data: Partial<RoadData>) => void;
  setSuspensionMode: (mode: SuspensionMode) => void;
  setDataSource: (source: DataSource) => void;
  addLog: (entry: Omit<LogEntry, 'id'>) => void;
  pushHistory: (point: TelemetryPoint) => void;
}
