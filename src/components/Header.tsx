import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../data/telemetryStore';
import { SimulationProvider, WebSocketProvider, switchProvider } from '../data/dataSource';
import { StatusIndicator } from './StatusIndicator';
import { Settings, Satellite, Cpu, Radio, Sun, Moon } from 'lucide-react';
import { formatUptime } from '../utils/formatters';

export const Header: React.FC = () => {
  const [time, setTime] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    return window.localStorage.getItem('roaddna-theme') === 'light' ? 'light' : 'dark';
  });
  const { system, gps, suspension, setSuspensionMode, setDataSource } = useTelemetry();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('roaddna-theme', theme);
  }, [theme]);

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
    <header className="dashboard-header" style={{
      background: 'var(--bg-console)',
      borderBottom: '1px solid rgba(213,154,50,0.12)',
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
          border: '1.5px solid var(--amber)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          flexShrink: 0,
        }}>
          <div style={{
            position: 'absolute', inset: 3,
            background: 'rgba(213,154,50,0.15)',
          }} />
          <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 11, color: 'var(--amber)', position: 'relative' }}>R</span>
        </div>
        <div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: '0.15em',
            color: 'var(--text-primary)',
          }}>
            ROAD<span style={{ color: 'var(--amber)' }}>DNA</span>
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
            ROAD INTELLIGENCE v1.0
          </div>
        </div>
      </div>

      {/* Separator */}
      <div style={{ width: 1, height: 32, background: 'rgba(231,229,223,0.08)', marginRight: 20 }} />

      {/* System Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 20, flexShrink: 0 }}>
        <StatusIndicator status={system.status} size="sm" label={false} />
        <div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-label)', letterSpacing: '0.08em' }}>SYSTEM</div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--success)', fontWeight: 600, letterSpacing: '0.1em' }}>
            {system.status.toUpperCase()}
          </div>
        </div>
      </div>

      {/* GPS Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 20, flexShrink: 0 }}>
        <Satellite size={12} color="var(--steel)" />
        <div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-label)', letterSpacing: '0.08em' }}>GPS</div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--steel)', fontWeight: 600 }}>
            {gps.fixType} · {gps.satellites} SAT
          </div>
        </div>
      </div>

      {/* Sensor Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 20, flexShrink: 0 }}>
        <Cpu size={12} color="var(--amber)" />
        <div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-label)', letterSpacing: '0.08em' }}>SENSORS</div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--amber)', fontWeight: 600 }}>4/4 ACTIVE</div>
        </div>
      </div>

      {/* Uptime */}
      <div style={{ flexShrink: 0, marginRight: 20 }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-label)', letterSpacing: '0.08em' }}>UPTIME</div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500 }}>
          {formatUptime(system.uptime)}
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Data Source Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 16, flexShrink: 0 }}>
        <Radio size={11} color="var(--text-label)" />
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
                    ? '1px solid rgba(213,154,50,0.5)'
                    : '1px solid rgba(231,229,223,0.11)',
                  background: active
                    ? 'rgba(213,154,50,0.1)'
                    : 'rgba(231,229,223,0.025)',
                  color: active ? 'var(--amber)' : isRPi ? '#3a3a52' : 'var(--text-muted)',
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
        color: 'var(--text-primary)',
        letterSpacing: '0.05em',
        marginRight: 16,
        flexShrink: 0,
        minWidth: 68,
        textAlign: 'right',
      }}>
        {time}
      </div>

      {/* Theme + settings */}
      <button
        className="theme-toggle"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
      </button>
      <button style={{
        background: 'none', border: '1px solid rgba(231,229,223,0.11)',
        color: 'var(--text-muted)', cursor: 'pointer', padding: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
        flexShrink: 0,
      }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(213,154,50,0.3)'; (e.currentTarget as HTMLElement).style.color = 'var(--amber)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(231,229,223,0.11)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
      >
        <Settings size={14} />
      </button>
    </header>
  );
};
