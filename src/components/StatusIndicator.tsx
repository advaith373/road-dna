import React from 'react';
import type { SensorStatus } from '../data/types';

interface StatusIndicatorProps {
  status: SensorStatus | 'online' | 'degraded' | 'offline';
  label?: boolean;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG = {
  online: { color: '#718A61', bg: 'rgba(113,138,97,0.15)', label: 'ONLINE' },
  degraded: { color: '#C87532', bg: 'rgba(200,117,50,0.15)', label: 'DEGRADED' },
  warning: { color: '#C87532', bg: 'rgba(200,117,50,0.15)', label: 'WARNING' },
  offline: { color: '#B84D45', bg: 'rgba(184,77,69,0.15)', label: 'OFFLINE' },
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label = true, size = 'md' }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.offline;
  const dotSize = size === 'sm' ? 6 : 8;

  return (
    <div className="flex items-center gap-1.5">
      <div style={{ position: 'relative', width: dotSize, height: dotSize }}>
        {/* Outer glow pulse */}
        <div style={{
          position: 'absolute',
          inset: -3,
          borderRadius: '50%',
          background: cfg.color,
          opacity: 0.25,
          animation: status !== 'offline' ? 'status-pulse 2s ease-in-out infinite' : 'none',
        }} />
        {/* Main dot */}
        <div style={{
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          background: cfg.color,
          boxShadow: `0 0 6px ${cfg.color}`,
          flexShrink: 0,
        }} />
      </div>
      {label && (
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: size === 'sm' ? 9 : 10,
          fontWeight: 600,
          letterSpacing: '0.1em',
          color: cfg.color,
        }}>
          {cfg.label}
        </span>
      )}
    </div>
  );
};
