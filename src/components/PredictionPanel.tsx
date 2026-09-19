import React, { useRef, useEffect, useState } from 'react';
import { useTelemetry } from '../data/telemetryStore';
import { Brain, ChevronRight } from 'lucide-react';

const ConfidenceBar: React.FC<{ value: number }> = ({ value }) => {
  const pct = Math.min(100, Math.max(0, value));
  const color = pct >= 80 ? '#B84A42' : pct >= 60 ? '#C56A35' : '#718B5A';
  return (
    <div style={{ marginTop: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#73787D', letterSpacing: '0.08em' }}>CONFIDENCE</span>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color, fontWeight: 700 }}>{pct.toFixed(0)}%</span>
      </div>
      <div style={{ height: 4, background: 'rgba(231,229,223,0.07)', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          left: 0, top: 0, bottom: 0,
          width: `${pct}%`,
          background: `linear-gradient(to right, #718B5A 0%, #D59A32 60%, #B84A42 100%)`,
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
          const barColor = i / 19 < 0.33 ? '#718B5A' : i / 19 < 0.66 ? '#D59A32' : '#B84A42';
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

const PredRow: React.FC<{ label: string; value: string; valueColor?: string }> = ({ label, value, valueColor = '#E7E5DF' }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  }}>
    <span style={{ fontFamily: 'Inter', fontSize: 10, color: '#73787D', letterSpacing: '0.04em' }}>{label}</span>
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
    smooth: '#718B5A', rough: '#C56A35', bumpy: '#D59A32', potholed: '#B84A42', hazardous: '#ff1744',
  };
  const condColor = conditionColors[road.condition] || '#92979D';

  return (
    <div style={{
      background: '#181A1D',
      border: road.potholeDetected ? '1px solid rgba(184,74,66,0.3)' : '1px solid rgba(213,154,50,0.15)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      transition: 'border-color 0.5s ease',
      boxShadow: road.potholeDetected ? '0 0 20px rgba(184,74,66,0.05)' : 'none',
    }}>
      {/* Header */}
      <div style={{
        padding: '8px 12px',
        borderBottom: '1px solid rgba(231,229,223,0.07)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Brain size={11} color="#D59A32" />
          <span className="section-header">ROAD ASSESSMENT</span>
        </div>
        {/* Processing indicator */}
        <div style={{ display: 'flex', gap: 2 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              width: 3, height: 3,
              background: '#D59A32',
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
          valueColor={road.potholeDetected ? '#B84A42' : road.roughness === 'high' ? '#C56A35' : '#718B5A'}
        />
        <PredRow label="Distance" value={road.potholeDetected ? `${road.potholeDistance.toFixed(1)} m` : '—'} valueColor="#E7E5DF" />
        <PredRow label="Estimated impact" value={road.potholeDetected ? `${road.potholeEta.toFixed(1)} s` : '—'} valueColor="#E7E5DF" />

        {/* Confidence */}
        <ConfidenceBar value={road.confidence} />

        {/* Recommended action */}
        <div style={{
          marginTop: 4,
          padding: '8px 10px',
          background: road.potholeDetected ? 'rgba(184,74,66,0.08)' : 'rgba(213,154,50,0.06)',
          border: `1px solid ${road.potholeDetected ? 'rgba(184,74,66,0.25)' : 'rgba(213,154,50,0.15)'}`,
        }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#7B8085', letterSpacing: '0.1em', marginBottom: 4 }}>
            RECOMMENDED ACTION
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <ChevronRight size={10} color={road.potholeDetected ? '#B84A42' : '#D59A32'} />
            <span style={{
              fontFamily: 'JetBrains Mono',
              fontSize: 11,
              fontWeight: 700,
              color: road.potholeDetected ? '#B84A42' : '#D59A32',
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
