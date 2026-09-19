import React from 'react';
import type { SuspensionMode } from '../data/types';

const MODES: { id: SuspensionMode; label: string; desc: string }[] = [
  { id: 'comfort', label: 'COMFORT', desc: 'Soft damping, max comfort' },
  { id: 'normal', label: 'NORMAL', desc: 'Balanced performance' },
  { id: 'sport', label: 'SPORT', desc: 'Firm, responsive handling' },
  { id: 'adaptive', label: 'ADAPTIVE', desc: 'AI-driven real-time adjustment' },
  { id: 'manual', label: 'MANUAL', desc: 'User-defined settings' },
];

interface ModeSelectorProps {
  current: SuspensionMode;
  onChange: (mode: SuspensionMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ current, onChange }) => {
  return (
    <div>
      <div className="data-label mb-2">SUSPENSION MODE</div>
      <div style={{ display: 'flex', gap: 4 }}>
        {MODES.map((m) => {
          const active = m.id === current;
          return (
            <button
              key={m.id}
              onClick={() => onChange(m.id)}
              title={m.desc}
              style={{
                flex: 1,
                padding: '5px 2px',
                fontSize: 9,
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 600,
                letterSpacing: '0.06em',
                border: active
                  ? '1px solid #D99A2B'
                  : '1px solid #30363B',
                background: active
                  ? 'rgba(217, 154, 43, 0.18)'
                  : '#202428',
                color: active ? '#D99A2B' : '#92989D',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center',
                boxShadow: active ? '0 0 10px rgba(217, 154, 43, 0.2)' : 'none',
                borderRadius: 2,
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.target as HTMLElement).style.borderColor = '#718895';
                  (e.target as HTMLElement).style.color = '#E8E5DE';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.target as HTMLElement).style.borderColor = '#30363B';
                  (e.target as HTMLElement).style.color = '#92989D';
                }
              }}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
