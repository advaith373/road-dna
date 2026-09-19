import React, { useState } from 'react';
import { useTelemetry } from '../data/telemetryStore';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Activity, TrendingUp, Compass, Cpu } from 'lucide-react';

type ChartMetric = 'all' | 'suspension' | 'dynamics' | 'servos';

export const TelemetryCharts: React.FC = () => {
  const { history, suspension, imu, wheel } = useTelemetry();
  const [activeTab, setActiveTab] = useState<ChartMetric>('all');

  // Format data for recharts (last 30-40 points for fast smooth rendering)
  const chartData = history.slice(-40).map((pt, i) => ({
    index: i,
    time: (pt.time % 60000) / 1000,
    frontSuspension: Number(pt.frontSuspension?.toFixed(1) || 0),
    rearSuspension: Number(pt.rearSuspension?.toFixed(1) || 0),
    ax: Number(pt.ax?.toFixed(2) || 0),
    speed: Number(pt.speed?.toFixed(1) || 0),
    frontServo: Number(pt.frontServo?.toFixed(1) || 0),
    rearServo: Number(pt.rearServo?.toFixed(1) || 0),
  }));

  const tabs: { id: ChartMetric; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'OVERVIEW', icon: <Activity size={11} /> },
    { id: 'suspension', label: 'TRAVEL (MM)', icon: <TrendingUp size={11} /> },
    { id: 'dynamics', label: 'DYNAMICS', icon: <Compass size={11} /> },
    { id: 'servos', label: 'ACTUATORS', icon: <Cpu size={11} /> },
  ];

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid rgba(231,229,223,0.08)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: '220px',
      overflow: 'hidden',
    }}>
      {/* Header & Tabs */}
      <div style={{
        padding: '8px 12px',
        borderBottom: '1px solid rgba(231,229,223,0.07)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Activity size={12} color="var(--amber)" />
          <span className="section-header">REAL-TIME TELEMETRY TRACE</span>
          <span style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 8,
            color: 'var(--success)',
            background: 'rgba(113,139,90,0.1)',
            padding: '1px 5px',
            borderRadius: 2,
            border: '1px solid rgba(113,139,90,0.2)',
          }}>
            4 HZ LIVE
          </span>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: 4 }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: 9,
                letterSpacing: '0.06em',
                padding: '3px 8px',
                border: activeTab === tab.id ? '1px solid var(--amber)' : '1px solid rgba(231,229,223,0.08)',
                background: activeTab === tab.id ? 'rgba(213,154,50,0.1)' : 'rgba(231,229,223,0.025)',
                color: activeTab === tab.id ? 'var(--amber)' : 'var(--text-label)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                borderRadius: 2,
                transition: 'all 0.15s ease',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart Area */}
      <div style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
        {/* Quick Stat Badges */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: 6,
          flexShrink: 0,
        }}>
          <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.04)', padding: '4px 8px', borderRadius: 2 }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 7, color: 'var(--text-muted)' }}>FRONT TRAVEL</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--amber)', fontWeight: 600 }}>
              {suspension.frontPosition.toFixed(1)} <span style={{ fontSize: 8, color: 'var(--text-muted)' }}>mm</span>
            </div>
          </div>
          <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.04)', padding: '4px 8px', borderRadius: 2 }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 7, color: 'var(--text-muted)' }}>REAR TRAVEL</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--steel)', fontWeight: 600 }}>
              {suspension.rearPosition.toFixed(1)} <span style={{ fontSize: 8, color: 'var(--text-muted)' }}>mm</span>
            </div>
          </div>
          <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.04)', padding: '4px 8px', borderRadius: 2 }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 7, color: 'var(--text-muted)' }}>VERT ACCEL (AZ)</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: Math.abs(imu.az + 9.81) > 2 ? 'var(--warning)' : '#a78bfa', fontWeight: 600 }}>
              {imu.az.toFixed(2)} <span style={{ fontSize: 8, color: 'var(--text-muted)' }}>m/s²</span>
            </div>
          </div>
          <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.04)', padding: '4px 8px', borderRadius: 2 }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 7, color: 'var(--text-muted)' }}>SPEED</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--success)', fontWeight: 600 }}>
              {wheel.speed.toFixed(1)} <span style={{ fontSize: 8, color: 'var(--text-muted)' }}>km/h</span>
            </div>
          </div>
        </div>

        {/* Dynamic Chart Container */}
        <div style={{ flex: 1, minHeight: 120, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            {(activeTab === 'all' || activeTab === 'suspension') ? (
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="frontGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--amber)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--amber)" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="rearGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--steel)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--steel)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="index" hide />
                <YAxis
                  stroke="#3a3a52"
                  fontSize={8}
                  fontFamily="JetBrains Mono"
                  domain={['auto', 'auto']}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#0d0d14',
                    border: '1px solid rgba(213,154,50,0.3)',
                    borderRadius: 2,
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono',
                    color: 'var(--text-primary)',
                  }}
                  itemStyle={{ padding: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="frontSuspension"
                  name="Front Travel (mm)"
                  stroke="var(--amber)"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#frontGrad)"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="rearSuspension"
                  name="Rear Travel (mm)"
                  stroke="var(--steel)"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#rearGrad)"
                  isAnimationActive={false}
                />
              </AreaChart>
            ) : activeTab === 'dynamics' ? (
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="index" hide />
                <YAxis stroke="#3a3a52" fontSize={8} fontFamily="JetBrains Mono" domain={['auto', 'auto']} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#0d0d14',
                    border: '1px solid rgba(167,139,250,0.3)',
                    borderRadius: 2,
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ax"
                  name="Accel X (m/s²)"
                  stroke="#a78bfa"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="speed"
                  name="Speed (km/h)"
                  stroke="var(--success)"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="index" hide />
                <YAxis stroke="#3a3a52" fontSize={8} fontFamily="JetBrains Mono" domain={[0, 180]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#0d0d14',
                    border: '1px solid rgba(197,106,53,0.3)',
                    borderRadius: 2,
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="frontServo"
                  name="Front Servo (°)"
                  stroke="var(--warning)"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="rearServo"
                  name="Rear Servo (°)"
                  stroke="#eab308"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
