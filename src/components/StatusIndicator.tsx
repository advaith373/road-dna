import React from 'react';
import type { SensorStatus } from '../data/types';

interface StatusIndicatorProps {
  status: SensorStatus | 'online' | 'degraded' | 'offline';
  label?: boolean;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG = {
  online: { color: '#718B5A', bg: 'rgba(113,139,90,0.12)', label: 'ONLINE' },
  degraded: { color: '#C56A35', bg: 'rgba(197,106,53,0.12)', label: 'DEGRADED' },
  warning: { color: '#C56A35', bg: 'rgba(197,106,53,0.12)', label: 'WARNING' },
  offline: { color: '#B84A42', bg: 'rgba(184,74,66,0.12)', label: 'OFFLINE' },
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
          opacity: 0.2,
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
