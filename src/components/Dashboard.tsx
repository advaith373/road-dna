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
      background: '#101214',
      color: '#E8E5DE',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Top Engineering Header */}
      <Header />

    <main className="dashboard-main">
      <section className="workspace-grid primary-row dashboard-section" aria-label="Road intelligence">
        <div className="panel"><RoadPreview /></div>
        <div className="panel"><PredictionPanel /></div>
      </section>

      <section className="workspace-grid secondary-row dashboard-section" aria-label="Vehicle systems" style={{ marginTop: 14 }}>
        <div className="panel"><SuspensionPanel /></div>
        <div className="panel"><RoadConditionPanel /></div>
        <div className="panel"><GPSPanel /></div>
      </section>

      <section className="dashboard-section" style={{ marginTop: 14 }} aria-label="Sensors">
        <SensorGrid />
      </section>

      <section className="workspace-grid lower-row dashboard-section" style={{ marginTop: 14 }} aria-label="Telemetry and diagnostic log">
        <div className="panel"><TelemetryCharts /></div>
        <div className="panel"><SystemLog /></div>
      </section>
    </main>

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
        borderTop: '1px solid #30363B',
        background: '#181B1E',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        fontFamily: 'JetBrains Mono',
        fontSize: 9,
        color: '#92989D',
      }}>
        <div>
          <span>ROADDNA HARDWARE PROTOTYPE TARGET: </span>
          <span style={{ color: '#D99A2B' }}>Raspberry Pi 3B (1GB)</span>
          <span> | NEO-6M GPS | HALL-EFFECT | POTENTIOMETER | IMU 6-DOF | SERVO ACTUATION</span>
        </div>
        <div>
          <span>INDUSTRIAL MOTORSPORT TELEMETRY // BUILD 2026.09</span>
        </div>
      </footer>
    </div>
  );
};
