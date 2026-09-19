import React from 'react';

export const SystemFlowIndicator: React.FC = () => {
  const steps = [
    { label: 'SENSORS', sub: 'GPS · IMU · HALL · POT', color: '#4a9eff' },
    { label: 'ROAD INTELLIGENCE', sub: 'Data fusion & analysis', color: '#00e5ff' },
    { label: 'PREDICTION', sub: 'AI road disturbance model', color: '#00e5ff' },
    { label: 'SUSPENSION CTRL', sub: 'Servo actuation', color: '#00e676' },
  ];

  return (
    <div style={{ padding: '12px 10px' }}>
      <div className="data-label mb-3" style={{ textAlign: 'center' }}>SYSTEM PIPELINE</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {steps.map((step, i) => (
          <React.Fragment key={step.label}>
            <div style={{
              padding: '6px 10px',
              border: `1px solid ${step.color}20`,
              background: `${step.color}08`,
              position: 'relative',
            }}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: step.color,
                marginBottom: 1,
              }}>
                {step.label}
              </div>
              <div style={{ fontSize: 9, color: '#5a5a72', fontFamily: 'Inter, sans-serif' }}>
                {step.sub}
              </div>
              {/* Active pulse line */}
              <div style={{
                position: 'absolute',
                left: 0, top: 0, bottom: 0,
                width: 2,
                background: step.color,
                opacity: 0.6,
                boxShadow: `0 0 6px ${step.color}`,
              }} />
            </div>
            {i < steps.length - 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 12,
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  animation: 'flow-pulse 1.5s ease-in-out infinite',
                  animationDelay: `${i * 0.3}s`,
                }}>
                  <div style={{ width: 1, height: 4, background: 'rgba(0,229,255,0.4)' }} />
                  <div style={{
                    width: 0, height: 0,
                    borderLeft: '3px solid transparent',
                    borderRight: '3px solid transparent',
                    borderTop: '4px solid rgba(0,229,255,0.4)',
                  }} />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
