import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../data/telemetryStore';
import { SimulationProvider, WebSocketProvider, switchProvider } from '../data/dataSource';
import { StatusIndicator } from './StatusIndicator';
import { Settings, Satellite, Cpu, Radio } from 'lucide-react';
import { formatUptime } from '../utils/formatters';

export const Header: React.FC = () => {
  const [time, setTime] = useState('');
  const { system, gps, suspension, setSuspensionMode, setDataSource } = useTelemetry();

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
      background: '#0a0a10',
      borderBottom: '1px solid rgba(0,229,255,0.12)',
      padding: '0 20px',
      height: 52,
      display: 'flex',
      alignItems: 'center',
      gap: 0,
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
          border: '1.5px solid #00e5ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          flexShrink: 0,
        }}>
          <div style={{
            position: 'absolute', inset: 3,
            background: 'rgba(0,229,255,0.15)',
          }} />
          <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 11, color: '#00e5ff', position: 'relative' }}>R</span>
        </div>
        <div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: '0.15em',
            color: '#e0e0e8',
          }}>
            ROAD<span style={{ color: '#00e5ff' }}>DNA</span>
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#5a5a72', letterSpacing: '0.12em' }}>
            ROAD INTELLIGENCE v1.0
          </div>
        </div>
      </div>

      {/* Separator */}
      <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.06)', marginRight: 20 }} />

      {/* System Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 20, flexShrink: 0 }}>
        <StatusIndicator status={system.status} size="sm" label={false} />
        <div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#6a6a82', letterSpacing: '0.08em' }}>SYSTEM</div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#00e676', fontWeight: 600, letterSpacing: '0.1em' }}>
            {system.status.toUpperCase()}
          </div>
        </div>
      </div>

      {/* GPS Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 20, flexShrink: 0 }}>
        <Satellite size={12} color="#4a9eff" />
        <div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#6a6a82', letterSpacing: '0.08em' }}>GPS</div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4a9eff', fontWeight: 600 }}>
            {gps.fixType} · {gps.satellites} SAT
          </div>
        </div>
      </div>

      {/* Sensor Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 20, flexShrink: 0 }}>
        <Cpu size={12} color="#00e5ff" />
        <div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#6a6a82', letterSpacing: '0.08em' }}>SENSORS</div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#00e5ff', fontWeight: 600 }}>4/4 ACTIVE</div>
        </div>
      </div>

      {/* Uptime */}
      <div style={{ flexShrink: 0, marginRight: 20 }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#6a6a82', letterSpacing: '0.08em' }}>UPTIME</div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#9090a8', fontWeight: 500 }}>
          {formatUptime(system.uptime)}
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Data Source Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 16, flexShrink: 0 }}>
        <Radio size={11} color="#6a6a82" />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {(['simulation', 'raspberry-pi'] as const).map((src) => {
            const active = system.dataSource === src;
            const isRPi = src === 'raspberry-pi';
            return (
              <button
                key={src}
                onClick={() => handleSourceToggle(src)}
                disabled={isRPi}
                title={isRPi ? 'Raspberry Pi — Coming Soon' : 'Simulation mode'}
                style={{
                  padding: '3px 8px',
                  fontSize: 9,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  border: active
                    ? '1px solid rgba(0,229,255,0.5)'
                    : '1px solid rgba(255,255,255,0.08)',
                  background: active
                    ? 'rgba(0,229,255,0.1)'
                    : 'rgba(255,255,255,0.02)',
                  color: active ? '#00e5ff' : isRPi ? '#3a3a52' : '#5a5a72',
                  cursor: isRPi ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  borderRadius: src === 'simulation' ? '2px 0 0 2px' : '0 2px 2px 0',
                }}
              >
                {src === 'simulation' ? 'SIM' : 'RPi'}
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
        color: '#e0e0e8',
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
        background: 'none', border: '1px solid rgba(255,255,255,0.08)',
        color: '#5a5a72', cursor: 'pointer', padding: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
        flexShrink: 0,
      }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,229,255,0.3)'; (e.currentTarget as HTMLElement).style.color = '#00e5ff'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.color = '#5a5a72'; }}
      >
        <Settings size={14} />
      </button>
    </header>
  );
};
