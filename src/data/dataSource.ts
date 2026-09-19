// ============================================================
// RoadDNA — Data Source Abstraction Layer
// Swap between simulation and live Raspberry Pi WebSocket
// ============================================================

export interface DataProvider {
  connect: () => void;
  disconnect: () => void;
  isConnected: () => boolean;
}

// ── Simulation Provider ──────────────────────────────────────
import { startSimulation, stopSimulation } from './simulation';

export const SimulationProvider: DataProvider = {
  connect: () => startSimulation(),
  disconnect: () => stopSimulation(),
  isConnected: () => true,
};

// ── WebSocket Provider (Raspberry Pi) ────────────────────────
// TODO: Implement when Raspberry Pi server is ready
// Expects messages matching TelemetryState shape on ws://raspberrypi.local:8765
// Protocol: JSON messages with { type: 'gps' | 'imu' | 'wheel' | ... , data: {...} }

import { useTelemetry } from './telemetryStore';

let ws: WebSocket | null = null;
let wsConnected = false;

export const WebSocketProvider: DataProvider = {
  connect: () => {
    const { wsUrl } = useTelemetry.getState().system;
    useTelemetry.getState().addLog({
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      message: `ATTEMPTING CONNECTION TO ${wsUrl} ...`,
      level: 'system',
    });
    try {
      ws = new WebSocket(wsUrl);
      ws.onopen = () => {
        wsConnected = true;
        useTelemetry.getState().addLog({
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          message: 'RASPBERRY PI CONNECTED — live data stream active',
          level: 'success',
        });
      };
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          const store = useTelemetry.getState();
          switch (msg.type) {
            case 'gps': store.updateGPS(msg.data); break;
            case 'imu': store.updateIMU(msg.data); break;
            case 'wheel': store.updateWheel(msg.data); break;
            case 'potentiometer': store.updatePotentiometer(msg.data); break;
            case 'suspension': store.updateSuspension(msg.data); break;
            case 'road': store.updateRoad(msg.data); break;
            case 'log': store.addLog(msg.data); break;
          }
        } catch {
          console.error('Failed to parse WebSocket message');
        }
      };
      ws.onerror = () => {
        wsConnected = false;
        useTelemetry.getState().addLog({
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          message: 'CONNECTION FAILED — check Raspberry Pi is running',
          level: 'error',
        });
      };
      ws.onclose = () => {
        wsConnected = false;
        useTelemetry.getState().addLog({
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          message: 'RASPBERRY PI DISCONNECTED',
          level: 'warning',
        });
      };
    } catch (err) {
      useTelemetry.getState().addLog({
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        message: 'WEBSOCKET ERROR — ' + String(err),
        level: 'error',
      });
    }
  },
  disconnect: () => {
    if (ws) { ws.close(); ws = null; wsConnected = false; }
  },
  isConnected: () => wsConnected,
};

// ── Active Provider ──────────────────────────────────────────
let activeProvider: DataProvider = SimulationProvider;

export function switchProvider(provider: DataProvider) {
  activeProvider.disconnect();
  activeProvider = provider;
  activeProvider.connect();
}

export function getActiveProvider() {
  return activeProvider;
}
