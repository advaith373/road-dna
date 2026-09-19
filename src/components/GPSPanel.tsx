import React, { useRef, useEffect } from 'react';
import { useTelemetry } from '../data/telemetryStore';
import { MapPin, Navigation } from 'lucide-react';
import { formatHeading } from '../utils/formatters';

// Simulated dark map using canvas
const MapCanvas: React.FC<{ lat: number; lng: number; heading: number }> = ({ lat, lng, heading }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = (t: number) => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Background
      ctx.fillStyle = '#101214';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      const gridSpacing = 30;
      const offsetX = ((lng * 1000) % gridSpacing + gridSpacing) % gridSpacing;
      const offsetY = ((lat * 1000) % gridSpacing + gridSpacing) % gridSpacing;

      ctx.strokeStyle = '#202428';
      ctx.lineWidth = 1;
      for (let x = -offsetX; x < width + gridSpacing; x += gridSpacing) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = -offsetY; y < height + gridSpacing; y += gridSpacing) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Road lines
      const roads = [
        { x1: 0.1, y1: 0.5, x2: 0.9, y2: 0.5, w: 4 },
        { x1: 0.5, y1: 0.0, x2: 0.5, y2: 1.0, w: 4 },
        { x1: 0.0, y1: 0.25, x2: 0.7, y2: 0.25, w: 2 },
        { x1: 0.3, y1: 0.0, x2: 0.3, y2: 0.75, w: 2 },
        { x1: 0.7, y1: 0.25, x2: 0.7, y2: 1.0, w: 2 },
        { x1: 0.0, y1: 0.75, x2: 1.0, y2: 0.75, w: 2 },
      ];

      roads.forEach((r) => {
        ctx.strokeStyle = r.w > 3 ? '#30363B' : '#202428';
        ctx.lineWidth = r.w;
        ctx.beginPath();
        ctx.moveTo(r.x1 * width, r.y1 * height);
        ctx.lineTo(r.x2 * width, r.y2 * height);
        ctx.stroke();
      });

      // Route path
      const routePoints = [
        [0.1, 0.9], [0.3, 0.75], [0.3, 0.5], [0.5, 0.5], [0.5, 0.25], [0.7, 0.25],
      ] as [number, number][];

      ctx.strokeStyle = '#D99A2B';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#D99A2B';
      ctx.beginPath();
      routePoints.forEach(([rx, ry], i) => {
        if (i === 0) ctx.moveTo(rx * width, ry * height);
        else ctx.lineTo(rx * width, ry * height);
      });
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;

      // Motorcycle position dot
      const cx = width / 2;
      const cy = height / 2;
      const pulse = Math.sin(t * 0.003) * 0.5 + 0.5;

      ctx.beginPath();
      ctx.arc(cx, cy, 10 + pulse * 6, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(217,154,43,${0.2 + pulse * 0.15})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(217,154,43,0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Heading triangle
      const headRad = ((heading - 90) * Math.PI) / 180;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(headRad);
      ctx.fillStyle = '#D99A2B';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#D99A2B';
      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.lineTo(-4, 4);
      ctx.lineTo(4, 4);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#E8E5DE';
      ctx.fill();

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [lat, lng, heading]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={200}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
};

export const GPSPanel: React.FC = () => {
  const { gps } = useTelemetry();

  return (
    <div style={{
      background: '#181B1E',
      border: '1px solid #30363B',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '8px 12px',
        borderBottom: '1px solid #30363B',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MapPin size={11} color="#718895" />
          <span className="section-header">GPS / ROUTE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 5, height: 5, background: '#718A61', borderRadius: '50%', boxShadow: '0 0 4px #718A61', animation: 'status-pulse 1.5s ease-in-out infinite' }} />
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#718A61' }}>{gps.fixType} FIX</span>
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden' }}>
        <MapCanvas lat={gps.latitude} lng={gps.longitude} heading={gps.heading} />
        <div style={{
          position: 'absolute',
          top: 8, left: 8,
          fontFamily: 'JetBrains Mono',
          fontSize: 8,
          color: '#626970',
          letterSpacing: '0.08em',
          pointerEvents: 'none',
        }}>
          SIMULATED MAP — BENGALURU
        </div>
        {/* Compass */}
        <div style={{
          position: 'absolute',
          top: 8, right: 8,
          width: 28, height: 28,
          border: '1px solid #30363B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(16,18,20,0.85)',
          borderRadius: '50%',
        }}>
          <Navigation
            size={14}
            color="#D99A2B"
            style={{ transform: `rotate(${gps.heading}deg)`, transition: 'transform 0.5s ease' }}
          />
        </div>
      </div>

      {/* Coordinate data */}
      <div style={{
        padding: '8px 12px',
        borderTop: '1px solid #30363B',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4px 12px',
        flexShrink: 0,
      }}>
        {[
          { label: 'LAT', value: gps.latitude.toFixed(6) + '°' },
          { label: 'LNG', value: gps.longitude.toFixed(6) + '°' },
          { label: 'SPEED', value: `${gps.speed.toFixed(1)} km/h` },
          { label: 'HEADING', value: formatHeading(gps.heading) },
        ].map((item) => (
          <div key={item.label}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#92989D', letterSpacing: '0.08em' }}>{item.label}</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#E8E5DE', fontWeight: 500 }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
