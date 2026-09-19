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

export const Dashboard: React.FC = () => (
  <div className="dashboard-shell">
    <Header />
    <SystemFlowIndicator />

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

    <footer className="dashboard-footer">
      <div>ROADDNA HARDWARE PROTOTYPE · Raspberry Pi 3B · NEO-6M GPS · HALL EFFECT · IMU 6-DOF</div>
      <div>ENGINEERING TELEMETRY INTERFACE · BUILD 2026.09</div>
    </footer>
  </div>
);
