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
                  ? '1px solid #00e5ff'
                  : '1px solid rgba(255,255,255,0.08)',
                background: active
                  ? 'rgba(0,229,255,0.12)'
                  : 'rgba(255,255,255,0.02)',
                color: active ? '#00e5ff' : '#5a5a72',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center',
                boxShadow: active ? '0 0 10px rgba(0,229,255,0.15)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.target as HTMLElement).style.borderColor = 'rgba(0,229,255,0.3)';
                  (e.target as HTMLElement).style.color = '#9090a8';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  (e.target as HTMLElement).style.color = '#5a5a72';
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
