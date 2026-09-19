import React, { useRef, useEffect, useState } from 'react';
import { useTelemetry } from '../data/telemetryStore';
import { ModeSelector } from './ModeSelector';
import { Zap } from 'lucide-react';

interface GaugeBarProps {
  label: string;
  value: number;       // 0-100
  color?: string;
  unit?: string;
}

const GaugeBar: React.FC<GaugeBarProps> = ({ label, value, color = '#00e5ff', unit = '%' }) => {
  const [displayed, setDisplayed] = useState(value);
  const animRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const target = value;
    const step = () => {
      setDisplayed((prev) => {
        const diff = target - prev;
        if (Math.abs(diff) < 0.2) return target;
        animRef.current = requestAnimationFrame(step);
        return prev + diff * 0.12;
      });
    };
    animRef.current = requestAnimationFrame(step);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [value]);

  const pct = Math.min(100, Math.max(0, displayed));
  const warningColor = pct > 85 ? '#ff9800' : pct > 95 ? '#ff3d3d' : color;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#6a6a82', letterSpacing: '0.08em', fontWeight: 600 }}>
          {label}
        </span>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 14, color: warningColor, fontWeight: 700 }}>
          {pct.toFixed(0)}<span style={{ fontSize: 9, color: '#5a5a72' }}>{unit}</span>
        </span>
      </div>
      <div style={{
        height: 6,
        background: 'rgba(255,255,255,0.05)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          left: 0, top: 0, bottom: 0,
          width: `${pct}%`,
          background: warningColor,
          boxShadow: `0 0 8px ${warningColor}60`,
          transition: 'width 0.1s ease',
        }} />
        {/* Tick marks */}
        {[25, 50, 75].map((t) => (
          <div key={t} style={{
            position: 'absolute',
            left: `${t}%`,
            top: 0, bottom: 0,
            width: 1,
            background: 'rgba(255,255,255,0.1)',
          }} />
        ))}
      </div>
    </div>
  );
};

interface DataRowProps {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
}

const DataRow: React.FC<DataRowProps> = ({ label, value, unit, highlight }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '3px 0',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
  }}>
    <span style={{ fontFamily: 'Inter', fontSize: 10, color: '#6a6a82', letterSpacing: '0.04em' }}>{label}</span>
    <span style={{
      fontFamily: 'JetBrains Mono',
      fontSize: 11,
      color: highlight ? '#00e5ff' : '#9090a8',
      fontWeight: highlight ? 600 : 400,
    }}>
      {value}{unit && <span style={{ fontSize: 9, color: '#5a5a72' }}> {unit}</span>}
    </span>
  </div>
);

export const SuspensionPanel: React.FC = () => {
  const { suspension, setSuspensionMode } = useTelemetry();

  return (
    <div style={{
      background: '#111118',
      border: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
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
          <Zap size={11} color="#00e5ff" />
          <span className="section-header">SUSPENSION CONTROL</span>
        </div>
        {suspension.autoAdjusting && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '2px 6px',
            background: 'rgba(0,229,255,0.08)',
            border: '1px solid rgba(0,229,255,0.2)',
          }}>
            <div style={{
              width: 5, height: 5,
              background: '#00e5ff',
              borderRadius: '50%',
              animation: 'status-pulse 0.8s ease-in-out infinite',
            }} />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#00e5ff', letterSpacing: '0.08em' }}>ADJUSTING</span>
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Front Suspension */}
        <div style={{ padding: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#4a9eff', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 8 }}>
            FRONT SUSPENSION
          </div>
          <GaugeBar label="DAMPING" value={suspension.frontDamping} color="#00e5ff" />
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 0 }}>
            <DataRow label="Position" value={suspension.frontPosition.toFixed(1)} unit="mm" />
            <DataRow label="Servo Angle" value={suspension.frontServoAngle.toFixed(1)} unit="°" highlight />
            <DataRow label="Target" value={suspension.frontTarget.toFixed(1)} unit="mm" />
          </div>
        </div>

        {/* Rear Suspension */}
        <div style={{ padding: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#4a9eff', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 8 }}>
            REAR SUSPENSION
          </div>
          <GaugeBar label="DAMPING" value={suspension.rearDamping} color="#00b8d4" />
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 0 }}>
            <DataRow label="Position" value={suspension.rearPosition.toFixed(1)} unit="mm" />
            <DataRow label="Servo Angle" value={suspension.rearServoAngle.toFixed(1)} unit="°" highlight />
            <DataRow label="Target" value={suspension.rearTarget.toFixed(1)} unit="mm" />
          </div>
        </div>

        {/* Visual dual gauge */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          {[
            { label: 'FRONT', value: suspension.frontDamping, color: '#00e5ff' },
            { label: 'REAR', value: suspension.rearDamping, color: '#00b8d4' },
          ].map((g) => (
            <div key={g.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: g.color }}>{g.value.toFixed(0)}%</span>
              <div style={{ width: '100%', height: 60, background: 'rgba(255,255,255,0.04)', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute',
                  bottom: 0, left: 0, right: 0,
                  height: `${Math.min(100, g.value)}%`,
                  background: g.color,
                  opacity: 0.7,
                  boxShadow: `0 0 12px ${g.color}40`,
                  transition: 'height 0.15s ease',
                }} />
                {/* Horizontal grid lines */}
                {[25, 50, 75].map((t) => (
                  <div key={t} style={{
                    position: 'absolute',
                    left: 0, right: 0,
                    bottom: `${t}%`,
                    height: 1,
                    background: 'rgba(255,255,255,0.08)',
                  }} />
                ))}
              </div>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#5a5a72', letterSpacing: '0.08em' }}>{g.label}</span>
            </div>
          ))}
        </div>

        {/* Mode selector */}
        <ModeSelector current={suspension.mode} onChange={setSuspensionMode} />
      </div>
    </div>
  );
};
