import React from 'react';
import { useTelemetry } from '../data/telemetryStore';
import { CheckCircle, AlertTriangle, Radio } from 'lucide-react';
import { roughnessColor, qualityColor } from '../utils/formatters';

export const RoadConditionPanel: React.FC = () => {
  const { road } = useTelemetry();

  const qualColor = qualityColor(road.quality);
  const roughColor = roughnessColor(road.roughness);

  // Arc gauge for road quality
  const angle = (road.quality / 100) * 180; // 0-180 degrees
  const r = 28;
  const cx = 36, cy = 36;
  const arcStart = Math.PI;
  const arcEnd = arcStart + (angle / 180) * Math.PI;
  const x1 = cx + r * Math.cos(arcStart);
  const y1 = cy + r * Math.sin(arcStart);
  const x2 = cx + r * Math.cos(arcEnd);
  const y2 = cy + r * Math.sin(arcEnd);
  const largeArc = angle > 180 ? 1 : 0;

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
        flexShrink: 0,
      }}>
        <span className="section-header">ROAD CONDITION</span>
      </div>

      <div style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto' }}>
        {/* Surface + quality row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Arc gauge */}
          <div style={{ flexShrink: 0 }}>
            <svg width={72} height={44} style={{ overflow: 'visible' }}>
              {/* Track */}
              <path
                d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={4}
              />
              {/* Value arc */}
              {road.quality > 0 && (
                <path
                  d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
                  fill="none"
                  stroke={qualColor}
                  strokeWidth={4}
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 3px ${qualColor}60)` }}
                />
              )}
              <text x={cx} y={cy - 2} textAnchor="middle" fill={qualColor} fontSize={11} fontFamily="JetBrains Mono" fontWeight="700">
                {Math.round(road.quality)}
              </text>
              <text x={cx} y={cy + 10} textAnchor="middle" fill="#5a5a72" fontSize={7} fontFamily="JetBrains Mono">
                /100
              </text>
            </svg>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 6 }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#5a5a72', letterSpacing: '0.08em', marginBottom: 2 }}>SURFACE</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#e0e0e8', fontWeight: 600, letterSpacing: '0.06em' }}>
                {road.surface.toUpperCase()}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#5a5a72', letterSpacing: '0.08em', marginBottom: 2 }}>ROUGHNESS</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: roughColor, fontWeight: 600, letterSpacing: '0.06em' }}>
                {road.roughness.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Roughness bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#5a5a72', letterSpacing: '0.08em' }}>ROAD ROUGHNESS INDEX</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.05)' }}>
            <div style={{
              height: '100%',
              width: `${['smooth', 'low', 'medium', 'high', 'severe'].indexOf(road.roughness) / 4 * 100}%`,
              background: roughColor,
              boxShadow: `0 0 6px ${roughColor}60`,
              transition: 'width 0.5s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 7, color: '#3a3a52' }}>SMOOTH</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 7, color: '#3a3a52' }}>SEVERE</span>
          </div>
        </div>

        {/* Detected features */}
        <div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#5a5a72', letterSpacing: '0.08em', marginBottom: 6 }}>
            DETECTED FEATURES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {road.features.map((f) => (
              <div key={f.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '3px 6px',
                background: f.type === 'pothole' ? 'rgba(255,61,61,0.06)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${f.type === 'pothole' ? 'rgba(255,61,61,0.15)' : 'rgba(255,255,255,0.04)'}`,
              }}>
                {f.type === 'pothole' ? (
                  <AlertTriangle size={10} color="#ff9800" />
                ) : (
                  <CheckCircle size={10} color="#00e676" />
                )}
                <span style={{ fontFamily: 'Inter', fontSize: 10, color: f.type === 'pothole' ? '#ff9800' : '#6a6a82', flex: 1 }}>
                  {f.label}
                </span>
                {f.distance > 0 && (
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#5a5a72' }}>
                    {f.distance.toFixed(1)}m
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
