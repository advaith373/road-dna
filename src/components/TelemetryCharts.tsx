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
      background: '#181B1E',
      border: '1px solid #30363B',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: '220px',
      overflow: 'hidden',
    }}>
      {/* Header & Tabs */}
      <div style={{
        padding: '8px 12px',
        borderBottom: '1px solid #30363B',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Activity size={12} color="#D99A2B" />
          <span className="section-header">REAL-TIME TELEMETRY TRACE</span>
          <span style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 8,
            color: '#718A61',
            background: 'rgba(113,138,97,0.15)',
            padding: '1px 5px',
            borderRadius: 2,
            border: '1px solid rgba(113,138,97,0.3)',
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
                border: activeTab === tab.id ? '1px solid #D99A2B' : '1px solid #30363B',
                background: activeTab === tab.id ? 'rgba(217,154,43,0.18)' : '#202428',
                color: activeTab === tab.id ? '#D99A2B' : '#92989D',
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
          <div style={{ background: '#202428', border: '1px solid #30363B', padding: '4px 8px', borderRadius: 2 }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 7, color: '#92989D' }}>FRONT TRAVEL</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#D99A2B', fontWeight: 600 }}>
              {suspension.frontPosition.toFixed(1)} <span style={{ fontSize: 8, color: '#626970' }}>mm</span>
            </div>
          </div>
          <div style={{ background: '#202428', border: '1px solid #30363B', padding: '4px 8px', borderRadius: 2 }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 7, color: '#92989D' }}>REAR TRAVEL</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#718895', fontWeight: 600 }}>
              {suspension.rearPosition.toFixed(1)} <span style={{ fontSize: 8, color: '#626970' }}>mm</span>
            </div>
          </div>
          <div style={{ background: '#202428', border: '1px solid #30363B', padding: '4px 8px', borderRadius: 2 }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 7, color: '#92989D' }}>VERT ACCEL (AZ)</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: Math.abs(imu.az + 9.81) > 2 ? '#C87532' : '#E8E5DE', fontWeight: 600 }}>
              {imu.az.toFixed(2)} <span style={{ fontSize: 8, color: '#626970' }}>m/s²</span>
            </div>
          </div>
          <div style={{ background: '#202428', border: '1px solid #30363B', padding: '4px 8px', borderRadius: 2 }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 7, color: '#92989D' }}>SPEED</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#718A61', fontWeight: 600 }}>
              {wheel.speed.toFixed(1)} <span style={{ fontSize: 8, color: '#626970' }}>km/h</span>
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
                    <stop offset="5%" stopColor="#D99A2B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D99A2B" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="rearGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#718895" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#718895" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke="#30363B" vertical={false} />
                <XAxis dataKey="index" hide />
                <YAxis
                  stroke="#626970"
                  fontSize={8}
                  fontFamily="JetBrains Mono"
                  domain={['auto', 'auto']}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#202428',
                    border: '1px solid #D99A2B',
                    borderRadius: 2,
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono',
                    color: '#E8E5DE',
                  }}
                  itemStyle={{ padding: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="frontSuspension"
                  name="Front Travel (mm)"
                  stroke="#D99A2B"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#frontGrad)"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="rearSuspension"
                  name="Rear Travel (mm)"
                  stroke="#718895"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#rearGrad)"
                  isAnimationActive={false}
                />
              </AreaChart>
            ) : activeTab === 'dynamics' ? (
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="#30363B" vertical={false} />
                <XAxis dataKey="index" hide />
                <YAxis stroke="#626970" fontSize={8} fontFamily="JetBrains Mono" domain={['auto', 'auto']} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#202428',
                    border: '1px solid #718895',
                    borderRadius: 2,
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono',
                    color: '#E8E5DE',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ax"
                  name="Accel X (m/s²)"
                  stroke="#C87532"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="speed"
                  name="Speed (km/h)"
                  stroke="#718A61"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="#30363B" vertical={false} />
                <XAxis dataKey="index" hide />
                <YAxis stroke="#626970" fontSize={8} fontFamily="JetBrains Mono" domain={[0, 180]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#202428',
                    border: '1px solid #D99A2B',
                    borderRadius: 2,
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono',
                    color: '#E8E5DE',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="frontServo"
                  name="Front Servo (°)"
                  stroke="#D99A2B"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="rearServo"
                  name="Rear Servo (°)"
                  stroke="#718895"
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
