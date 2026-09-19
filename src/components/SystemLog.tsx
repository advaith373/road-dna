import React, { useState, useRef, useEffect } from 'react';
import { useTelemetry } from '../data/telemetryStore';
import { Terminal, Trash2, ArrowDown, Search, ShieldAlert, Check, Info, Cpu } from 'lucide-react';
import type { LogEntry } from '../data/types';

export const SystemLog: React.FC = () => {
  const { log } = useTelemetry();
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive if enabled
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [log, autoScroll]);

  const filteredLogs = log.filter((entry) => {
    const matchesLevel = filterLevel === 'all' || entry.level === filterLevel;
    const matchesSearch = searchQuery === '' ||
      entry.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.timestamp.includes(searchQuery);
    return matchesLevel && matchesSearch;
  });

  const getLevelBadge = (level: LogEntry['level']) => {
    switch (level) {
      case 'system':
        return { color: '#00e5ff', bg: 'rgba(0,229,255,0.12)', border: 'rgba(0,229,255,0.25)', label: 'SYS' };
      case 'success':
        return { color: '#00e676', bg: 'rgba(0,230,118,0.12)', border: 'rgba(0,230,118,0.25)', label: 'OK ' };
      case 'warning':
        return { color: '#ff9800', bg: 'rgba(255,152,0,0.12)', border: 'rgba(255,152,0,0.25)', label: 'WRN' };
      case 'error':
        return { color: '#ff3d3d', bg: 'rgba(255,61,61,0.15)', border: 'rgba(255,61,61,0.3)', label: 'ERR' };
      case 'info':
      default:
        return { color: '#9090a8', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.08)', label: 'INF' };
    }
  };

  return (
    <div style={{
      background: '#0a0a10',
      border: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: '200px',
      overflow: 'hidden',
    }}>
      {/* Console Header */}
      <div style={{
        padding: '6px 12px',
        background: '#0d0d14',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Terminal size={12} color="#00e5ff" />
          <span className="section-header">SYSTEM EVENT LOG & DIAGNOSTICS</span>
          <span style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 9,
            color: '#5a5a72',
          }}>
            [{filteredLogs.length} events]
          </span>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: '#07070c',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '2px 6px',
            borderRadius: 2,
          }}>
            <Search size={10} color="#5a5a72" />
            <input
              type="text"
              placeholder="FILTER LOGS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#e0e0e8',
                fontFamily: 'JetBrains Mono',
                fontSize: 9,
                width: 100,
              }}
            />
          </div>

          {/* Level Filter Dropdown */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            style={{
              background: '#07070c',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#00e5ff',
              fontFamily: 'JetBrains Mono',
              fontSize: 9,
              padding: '2px 4px',
              borderRadius: 2,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">ALL LEVELS</option>
            <option value="system">SYSTEM</option>
            <option value="info">INFO</option>
            <option value="warning">WARNING</option>
            <option value="error">ERROR</option>
            <option value="success">SUCCESS</option>
          </select>

          {/* Auto-scroll toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            title={autoScroll ? 'Auto-scroll enabled' : 'Auto-scroll paused'}
            style={{
              background: autoScroll ? 'rgba(0,229,255,0.12)' : '#07070c',
              border: autoScroll ? '1px solid #00e5ff' : '1px solid rgba(255,255,255,0.08)',
              color: autoScroll ? '#00e5ff' : '#5a5a72',
              padding: '2px 6px',
              borderRadius: 2,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              fontFamily: 'JetBrains Mono',
              fontSize: 9,
            }}
          >
            <ArrowDown size={10} />
            {autoScroll ? 'LOCK' : 'FREE'}
          </button>
        </div>
      </div>

      {/* Log Output Console */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          padding: '8px 12px',
          overflowY: 'auto',
          fontFamily: 'JetBrains Mono',
          fontSize: 10,
          lineHeight: '1.6',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          minHeight: 0,
        }}
      >
        {filteredLogs.length === 0 ? (
          <div style={{ color: '#3a3a52', fontStyle: 'italic', padding: '12px 0', textAlign: 'center' }}>
            NO LOG ENTRIES MATCHING CRITERIA
          </div>
        ) : (
          filteredLogs.map((entry) => {
            const badge = getLevelBadge(entry.level);
            return (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 8,
                  padding: '2px 4px',
                  borderRadius: 2,
                  transition: 'background 0.1s ease',
                  background: entry.level === 'warning' ? 'rgba(255,152,0,0.03)' : entry.level === 'error' ? 'rgba(255,61,61,0.05)' : 'transparent',
                }}
              >
                {/* Timestamp */}
                <span style={{ color: '#5a5a72', fontSize: 9, flexShrink: 0 }}>
                  {entry.timestamp}
                </span>

                {/* Level Tag */}
                <span
                  style={{
                    color: badge.color,
                    background: badge.bg,
                    border: `1px solid ${badge.border}`,
                    fontSize: 8,
                    fontWeight: 600,
                    padding: '0 4px',
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                >
                  {badge.label}
                </span>

                {/* Message */}
                <span
                  style={{
                    color: entry.level === 'warning' ? '#ffb74d' : entry.level === 'error' ? '#ff6b6b' : entry.level === 'system' ? '#00e5ff' : '#c0c0d0',
                    wordBreak: 'break-all',
                    flex: 1,
                  }}
                >
                  {entry.message}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Terminal Footer Bar */}
      <div style={{
        padding: '4px 12px',
        background: '#07070c',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#00e5ff', animation: 'status-pulse 1s infinite' }} />
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#3a3a52' }}>STREAM READY — LOG_BUFFER ACTIVE</span>
        </div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#3a3a52' }}>
          ROADDNA RTOS KERNEL
        </div>
      </div>
    </div>
  );
};
