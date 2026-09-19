import React, { useRef, useEffect, useState } from 'react';
import { useTelemetry } from '../data/telemetryStore';
import { Brain, ChevronRight } from 'lucide-react';

const ConfidenceBar: React.FC<{ value: number }> = ({ value }) => {
  const pct = Math.min(100, Math.max(0, value));
  const color = pct >= 80 ? '#ff3d3d' : pct >= 60 ? '#ff9800' : '#00e676';
  return (
    <div style={{ marginTop: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#5a5a72', letterSpacing: '0.08em' }}>CONFIDENCE</span>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color, fontWeight: 700 }}>{pct.toFixed(0)}%</span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          left: 0, top: 0, bottom: 0,
          width: `${pct}%`,
          background: `linear-gradient(to right, #00e676 0%, #ffc107 60%, #ff3d3d 100%)`,
          clipPath: `inset(0 ${100 - pct}% 0 0)`,
          transition: 'width 0.3s ease',
        }} />
      </div>
      {/* Probability distribution visualization */}
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'flex-end', gap: 2, height: 24 }}>
        {Array.from({ length: 20 }, (_, i) => {
          const x = i / 19;
          const center = pct / 100;
          const height = Math.exp(-((x - center) ** 2) / (2 * 0.025)) * 20;
          const barColor = i / 19 < 0.33 ? '#00e676' : i / 19 < 0.66 ? '#ffc107' : '#ff3d3d';
          return (
            <div key={i} style={{
              flex: 1,
              height: Math.max(2, height),
              background: barColor,
              opacity: 0.6 + (height / 20) * 0.4,
            }} />
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 7, color: '#3a3a52' }}>LOW</span>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 7, color: '#3a3a52' }}>HIGH</span>
      </div>
    </div>
  );
};

const PredRow: React.FC<{ label: string; value: string; valueColor?: string }> = ({ label, value, valueColor = '#e0e0e8' }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  }}>
    <span style={{ fontFamily: 'Inter', fontSize: 10, color: '#5a5a72', letterSpacing: '0.04em' }}>{label}</span>
    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: valueColor, fontWeight: 600, letterSpacing: '0.04em' }}>{value}</span>
  </div>
);

export const PredictionPanel: React.FC = () => {
  const { road } = useTelemetry();
  const [dots, setDots] = useState('');

  useEffect(() => {
    const id = setInterval(() => setDots((d) => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(id);
  }, []);

  const conditionColors: Record<string, string> = {
    smooth: '#00e676', rough: '#ff9800', bumpy: '#ffc107', potholed: '#ff3d3d', hazardous: '#ff1744',
  };
  const condColor = conditionColors[road.condition] || '#9090a8';

  return (
    <div style={{
      background: '#111118',
      border: road.potholeDetected ? '1px solid rgba(255,61,61,0.3)' : '1px solid rgba(0,229,255,0.15)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      transition: 'border-color 0.5s ease',
      boxShadow: road.potholeDetected ? '0 0 20px rgba(255,61,61,0.05)' : 'none',
    }}>
      {/* Header */}
      <div style={{
        padding: '8px 12px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Brain size={11} color="#00e5ff" />
          <span className="section-header">ROAD PREDICTION ENGINE</span>
        </div>
        {/* Processing indicator */}
        <div style={{ display: 'flex', gap: 2 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              width: 3, height: 3,
              background: '#00e5ff',
              borderRadius: '50%',
              opacity: dots.length > i ? 1 : 0.2,
              transition: 'opacity 0.2s',
            }} />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Current readings */}
        <PredRow label="Road condition" value={road.condition.toUpperCase()} valueColor={condColor} />
        <PredRow
          label="Prediction"
          value={road.potholeDetected ? 'POTHOLE AHEAD' : road.roughness === 'high' ? 'ROUGH SECTION' : 'CLEAR ROAD'}
          valueColor={road.potholeDetected ? '#ff3d3d' : road.roughness === 'high' ? '#ff9800' : '#00e676'}
        />
        <PredRow label="Distance" value={road.potholeDetected ? `${road.potholeDistance.toFixed(1)} m` : '—'} valueColor="#e0e0e8" />
        <PredRow label="Estimated impact" value={road.potholeDetected ? `${road.potholeEta.toFixed(1)} s` : '—'} valueColor="#e0e0e8" />

        {/* Confidence */}
        <ConfidenceBar value={road.confidence} />

        {/* Recommended action */}
        <div style={{
          marginTop: 4,
          padding: '8px 10px',
          background: road.potholeDetected ? 'rgba(255,61,61,0.08)' : 'rgba(0,229,255,0.06)',
          border: `1px solid ${road.potholeDetected ? 'rgba(255,61,61,0.25)' : 'rgba(0,229,255,0.15)'}`,
        }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#6a6a82', letterSpacing: '0.1em', marginBottom: 4 }}>
            RECOMMENDED ACTION
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <ChevronRight size={10} color={road.potholeDetected ? '#ff3d3d' : '#00e5ff'} />
            <span style={{
              fontFamily: 'JetBrains Mono',
              fontSize: 11,
              fontWeight: 700,
              color: road.potholeDetected ? '#ff3d3d' : '#00e5ff',
              letterSpacing: '0.06em',
            }}>
              {road.recommendedAction}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
