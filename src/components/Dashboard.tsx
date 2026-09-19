import React, { useEffect, useState } from 'react';
import { Header, type LayoutMode } from './Header';
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
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(() => {
    if (typeof window === 'undefined') return 'auto';
    const saved = window.localStorage.getItem('roaddna-layout-mode');
    return saved === 'pc' || saved === 'mobile' ? saved : 'auto';
  });

  useEffect(() => {
    window.localStorage.setItem('roaddna-layout-mode', layoutMode);
  }, [layoutMode]);

  return (
    <div className="dashboard-shell" data-layout-mode={layoutMode}>
      <Header layoutMode={layoutMode} onLayoutModeChange={setLayoutMode} />
      <SystemFlowIndicator />

      <main className="dashboard-main">
        <section className="workspace-grid primary-row dashboard-section" aria-label="Road intelligence">
          <div className="panel road-preview-card"><RoadPreview /></div>
          <div className="panel prediction-card"><PredictionPanel /></div>
        </section>

        <section className="workspace-grid secondary-row dashboard-section" style={{ marginTop: 14 }} aria-label="Vehicle systems">
          <div className="panel suspension-card"><SuspensionPanel /></div>
          <div className="panel condition-card"><RoadConditionPanel /></div>
          <div className="panel gps-card"><GPSPanel /></div>
        </section>

        <section className="dashboard-section sensors-card" style={{ marginTop: 14 }} aria-label="Sensors">
          <SensorGrid />
        </section>

        <section className="workspace-grid lower-row dashboard-section" style={{ marginTop: 14 }} aria-label="Telemetry and diagnostic log">
          <div className="panel telemetry-card"><TelemetryCharts /></div>
          <div className="panel log-card"><SystemLog /></div>
        </section>
      </main>

      <footer className="dashboard-footer">
        <div>ROADDNA HARDWARE PROTOTYPE · Raspberry Pi 3B · NEO-6M GPS · HALL EFFECT · IMU 6-DOF</div>
        <div>INDUSTRIAL MOTORSPORT TELEMETRY · BUILD 2026.09</div>
      </footer>
    </div>
  );
};
