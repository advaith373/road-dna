import React, { useState, useRef, useEffect } from 'react';
import { useTelemetry } from '../data/telemetryStore';
import { Terminal, ArrowDown, Search } from 'lucide-react';
import type { LogEntry } from '../data/types';

export const SystemLog: React.FC = () => {
  const { log } = useTelemetry();
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const scrollRef = useRef<HTMLDivElement>(null);

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
        return { color: '#D99A2B', bg: 'rgba(217,154,43,0.18)', border: 'rgba(217,154,43,0.35)', label: 'SYS' };
      case 'success':
        return { color: '#718A61', bg: 'rgba(113,138,97,0.18)', border: 'rgba(113,138,97,0.35)', label: 'OK ' };
      case 'warning':
        return { color: '#C87532', bg: 'rgba(200,117,50,0.18)', border: 'rgba(200,117,50,0.35)', label: 'WRN' };
      case 'error':
        return { color: '#B84D45', bg: 'rgba(184,77,69,0.18)', border: 'rgba(184,77,69,0.35)', label: 'ERR' };
      case 'info':
      default:
        return { color: '#92989D', bg: 'rgba(146,152,157,0.12)', border: 'rgba(146,152,157,0.25)', label: 'INF' };
    }
  };

  return (
    <div style={{
      background: '#181B1E',
      border: '1px solid #30363B',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: '200px',
      overflow: 'hidden',
    }}>
      {/* Console Header */}
      <div style={{
        padding: '6px 12px',
        background: '#202428',
        borderBottom: '1px solid #30363B',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Terminal size={12} color="#D99A2B" />
          <span className="section-header">SYSTEM EVENT LOG & DIAGNOSTICS</span>
          <span style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 9,
            color: '#626970',
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
            background: '#101214',
            border: '1px solid #30363B',
            padding: '2px 6px',
            borderRadius: 2,
          }}>
            <Search size={10} color="#92989D" />
            <input
              type="text"
              placeholder="FILTER LOGS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#E8E5DE',
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
              background: '#101214',
              border: '1px solid #30363B',
              color: '#D99A2B',
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
              background: autoScroll ? 'rgba(217,154,43,0.18)' : '#101214',
              border: autoScroll ? '1px solid #D99A2B' : '1px solid #30363B',
              color: autoScroll ? '#D99A2B' : '#92989D',
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
          background: '#101214',
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
          <div style={{ color: '#626970', fontStyle: 'italic', padding: '12px 0', textAlign: 'center' }}>
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
                  background: entry.level === 'warning' ? 'rgba(200,117,50,0.06)' : entry.level === 'error' ? 'rgba(184,77,69,0.08)' : 'transparent',
                }}
              >
                {/* Timestamp */}
                <span style={{ color: '#626970', fontSize: 9, flexShrink: 0 }}>
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
                    color: entry.level === 'warning' ? '#C87532' : entry.level === 'error' ? '#B84D45' : entry.level === 'system' ? '#D99A2B' : '#E8E5DE',
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
        background: '#202428',
        borderTop: '1px solid #30363B',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#D99A2B', animation: 'status-pulse 1s infinite' }} />
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#92989D' }}>STREAM READY — LOG_BUFFER ACTIVE</span>
        </div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#626970' }}>
          ROADDNA RTOS KERNEL
        </div>
      </div>
    </div>
  );
};
