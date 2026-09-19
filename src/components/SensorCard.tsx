import React, { useState } from 'react';
import { StatusIndicator } from './StatusIndicator';
import type { SensorStatus } from '../data/types';
import { X } from 'lucide-react';

export interface SensorCardField {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
}

interface SensorCardProps {
  title: string;
  icon?: React.ReactNode;
  status: SensorStatus;
  fields: SensorCardField[];
  detailFields?: SensorCardField[];
  accent?: string;
}

export const SensorCard: React.FC<SensorCardProps> = ({
  title, icon, status, fields, detailFields, accent = '#00e5ff'
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div
        onClick={() => setExpanded(true)}
        style={{
          background: '#0f0f16',
          border: '1px solid rgba(255,255,255,0.06)',
          padding: '10px 12px',
          cursor: 'pointer',
          transition: 'border-color 0.2s, background 0.2s',
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = `${accent}30`;
          (e.currentTarget as HTMLElement).style.background = '#131320';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
          (e.currentTarget as HTMLElement).style.background = '#0f0f16';
        }}
      >
        {/* Corner accent */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0,
          width: 10, height: 10,
          borderTop: `1px solid ${accent}`,
          borderLeft: `1px solid ${accent}`,
        }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {icon && <div style={{ color: accent, display: 'flex', alignItems: 'center' }}>{icon}</div>}
            <span style={{
              fontFamily: 'JetBrains Mono',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: accent,
            }}>
              {title}
            </span>
          </div>
          <StatusIndicator status={status} size="sm" label={false} />
        </div>

        {/* Fields */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {fields.map((f, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '2px 0',
              borderBottom: i < fields.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
            }}>
              <span style={{ fontFamily: 'Inter', fontSize: 10, color: '#5a5a72' }}>{f.label}</span>
              <span style={{
                fontFamily: 'JetBrains Mono',
                fontSize: 11,
                color: f.highlight ? accent : '#9090a8',
                fontWeight: f.highlight ? 600 : 400,
              }}>
                {typeof f.value === 'number' ? f.value : f.value}
                {f.unit && <span style={{ fontSize: 9, color: '#5a5a72' }}> {f.unit}</span>}
              </span>
            </div>
          ))}
        </div>

        {/* Expand hint */}
        <div style={{ marginTop: 6, textAlign: 'right' }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#3a3a52', letterSpacing: '0.08em' }}>
            CLICK FOR DETAILS ›
          </span>
        </div>
      </div>

      {/* Detail Modal */}
      {expanded && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setExpanded(false)}
        >
          <div
            style={{
              background: '#111118',
              border: `1px solid ${accent}30`,
              width: 360,
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: `0 0 40px rgba(0,0,0,0.8), 0 0 0 1px ${accent}20`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: accent, fontWeight: 700, letterSpacing: '0.1em' }}>
                  {title}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#5a5a72', marginTop: 2 }}>SENSOR DETAIL VIEW</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <StatusIndicator status={status} size="sm" />
                <button
                  onClick={() => setExpanded(false)}
                  style={{ background: 'none', border: 'none', color: '#5a5a72', cursor: 'pointer', padding: 4 }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Detail fields */}
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 0 }}>
              {(detailFields || fields).map((f, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 11, color: '#6a6a82' }}>{f.label}</span>
                  <span style={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: 12,
                    color: f.highlight ? accent : '#b0b0c8',
                    fontWeight: f.highlight ? 600 : 400,
                  }}>
                    {f.value}{f.unit && <span style={{ fontSize: 10, color: '#5a5a72' }}> {f.unit}</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
