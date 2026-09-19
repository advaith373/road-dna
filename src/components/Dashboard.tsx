import React from 'react';
import { Header } from './Header';
import { SystemFlowIndicator } from './SystemFlowIndicator';
import { RoadPreview } from './RoadPreview';
import { PredictionPanel } from './PredictionPanel';
import { SuspensionPanel } from './SuspensionPanel';
import { RoadConditionPanel } from './RoadConditionPanel';
import { GPSPanel } from './GPSPanel';
import { SensorGrid } from './SensorGrid';
import { TelemetryCharts } from './TelemetryCharts';
import { SystemLog } from './SystemLog';

export const Dashboard: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#09090f',
      color: '#e0e0e8',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Top Engineering Header */}
      <Header />

      {/* System Data Flow Pipeline Indicator */}
      <SystemFlowIndicator />

      {/* Main Dashboard Workspace */}
      <main style={{
        flex: 1,
        padding: '12px 16px 24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxWidth: 1920,
        width: '100%',
        margin: '0 auto',
      }}>
        {/* Row 1: 3D Road Surface Visualization + AI Prediction Panel */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 12,
          minHeight: 320,
        }}>
          {/* 3D Road Profile Visualizer */}
          <div style={{ minHeight: 320, height: '100%' }}>
            <RoadPreview />
          </div>

          {/* AI Road Intelligence & Predictive Mitigation Panel */}
          <div style={{ minHeight: 320, height: '100%' }}>
            <PredictionPanel />
          </div>
        </section>

        {/* Row 2: Suspension Telemetry & Actuation, Road Condition, and GPS/Route */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 12,
        }}>
          <div style={{ minHeight: 270 }}>
            <SuspensionPanel />
          </div>
          <div style={{ minHeight: 270 }}>
            <RoadConditionPanel />
          </div>
          <div style={{ minHeight: 270 }}>
            <GPSPanel />
          </div>
        </section>

        {/* Row 3: Hardware Sensor Telemetry Grid (NEO-6M, Hall, Potentiometer, IMU) */}
        <section>
          <SensorGrid />
        </section>

        {/* Row 4: Live Telemetry Line/Area Charts + RTOS System Event Console */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: 12,
          minHeight: 260,
        }}>
          <div style={{ minHeight: 260 }}>
            <TelemetryCharts />
          </div>
          <div style={{ minHeight: 260 }}>
            <SystemLog />
          </div>
        </section>
      </main>

      {/* Footer Branding & Hardware Specs */}
      <footer style={{
        padding: '8px 16px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        background: '#07070c',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        fontFamily: 'JetBrains Mono',
        fontSize: 9,
        color: '#4a4a62',
      }}>
        <div>
          <span>ROADDNA HARDWARE PROTOTYPE TARGET: </span>
          <span style={{ color: '#00e5ff' }}>Raspberry Pi 3B (1GB)</span>
          <span> | NEO-6M GPS | HALL-EFFECT | POTENTIOMETER | IMU 6-DOF | SERVO ACTUATION</span>
        </div>
        <div>
          <span>ENGINEERING TELEMETRY INTERFACE // BUILD 2026.09</span>
        </div>
      </footer>
    </div>
  );
};
