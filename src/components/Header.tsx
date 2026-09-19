import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../data/telemetryStore';
import { SimulationProvider, WebSocketProvider, switchProvider } from '../data/dataSource';
import { StatusIndicator } from './StatusIndicator';
import { Settings, Satellite, Cpu, Radio } from 'lucide-react';
import { formatUptime } from '../utils/formatters';

export const Header: React.FC = () => {
  const [time, setTime] = useState('');
  const { system, gps, setDataSource } = useTelemetry();

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const handleSourceToggle = (src: 'simulation' | 'raspberry-pi') => {
    if (src === system.dataSource) return;
    setDataSource(src);
    if (src === 'simulation') {
      switchProvider(SimulationProvider);
    } else {
      switchProvider(WebSocketProvider);
    }
  };

  return (
    <header style={{
      background: '#181B1E',
      borderBottom: '1px solid #30363B',
      padding: '0 20px',
      height: 52,
      display: 'flex',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 24, flexShrink: 0 }}>
        {/* Logo mark */}
        <div style={{
          width: 28, height: 28,
          border: '1.5px solid #D99A2B',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          background: '#202428',
          borderRadius: 2,
          flexShrink: 0,
        }}>
          <div style={{
            position: 'absolute', inset: 3,
            background: 'rgba(217, 154, 43, 0.15)',
          }} />
          <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 11, color: '#D99A2B', position: 'relative' }}>R</span>
        </div>
        <div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: '0.15em',
            color: '#E8E5DE',
          }}>
            ROAD<span style={{ color: '#D99A2B' }}>DNA</span>
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#626970', letterSpacing: '0.12em' }}>
            ROAD INTELLIGENCE v1.0
          </div>
        </div>
      </div>

      {/* Separator */}
      <div style={{ width: 1, height: 32, background: '#30363B', marginRight: 20 }} />

      {/* System Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 20, flexShrink: 0 }}>
        <StatusIndicator status={system.status} size="sm" label={false} />
        <div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#92989D', letterSpacing: '0.08em' }}>SYSTEM</div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#718A61', fontWeight: 600, letterSpacing: '0.1em' }}>
            {system.status.toUpperCase()}
          </div>
        </div>
      </div>

      {/* GPS Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 20, flexShrink: 0 }}>
        <Satellite size={12} color="#718895" />
        <div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#92989D', letterSpacing: '0.08em' }}>GPS</div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#718895', fontWeight: 600 }}>
            {gps.fixType} · {gps.satellites} SAT
          </div>
        </div>
      </div>

      {/* Sensor Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 20, flexShrink: 0 }}>
        <Cpu size={12} color="#D99A2B" />
        <div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#92989D', letterSpacing: '0.08em' }}>SENSORS</div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#D99A2B', fontWeight: 600 }}>4/4 ACTIVE</div>
        </div>
      </div>

      {/* Uptime */}
      <div style={{ flexShrink: 0, marginRight: 20 }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#92989D', letterSpacing: '0.08em' }}>UPTIME</div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#E8E5DE', fontWeight: 500 }}>
          {formatUptime(system.uptime)}
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Data Source Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 16, flexShrink: 0 }}>
        <Radio size={11} color="#92989D" />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {(['simulation', 'raspberry-pi'] as const).map((src) => {
            const active = system.dataSource === src;
            const isRPi = src === 'raspberry-pi';
            return (
              <button
                key={src}
                onClick={() => handleSourceToggle(src)}
                disabled={isRPi}
                title={isRPi ? 'Raspberry Pi — WebSocket ready' : 'Simulation mode'}
                style={{
                  padding: '4px 10px',
                  fontSize: 9,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  border: active
                    ? '1px solid #D99A2B'
                    : '1px solid #30363B',
                  background: active
                    ? 'rgba(217, 154, 43, 0.18)'
                    : '#202428',
                  color: active ? '#D99A2B' : isRPi ? '#626970' : '#92989D',
                  cursor: isRPi ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  borderRadius: src === 'simulation' ? '2px 0 0 2px' : '0 2px 2px 0',
                }}
              >
                {src === 'simulation' ? 'SIMULATION' : 'RASPBERRY PI'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clock */}
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 14,
        fontWeight: 600,
        color: '#E8E5DE',
        letterSpacing: '0.05em',
        marginRight: 16,
        flexShrink: 0,
        minWidth: 68,
        textAlign: 'right',
      }}>
        {time}
      </div>

      {/* Settings */}
      <button style={{
        background: '#202428',
        border: '1px solid #30363B',
        color: '#92989D',
        cursor: 'pointer',
        padding: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        borderRadius: 2,
        flexShrink: 0,
      }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#D99A2B'; (e.currentTarget as HTMLElement).style.color = '#D99A2B'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#30363B'; (e.currentTarget as HTMLElement).style.color = '#92989D'; }}
      >
        <Settings size={14} />
      </button>
    </header>
  );
};
