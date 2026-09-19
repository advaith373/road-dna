import React from 'react';

export const SystemFlowIndicator: React.FC = () => {
  const steps = [
    { label: 'SENSORS', sub: 'GPS · IMU · HALL · POT', color: '#718895' },
    { label: 'ROAD INTELLIGENCE', sub: 'Data fusion & analysis', color: '#D99A2B' },
    { label: 'PREDICTION', sub: 'AI road disturbance model', color: '#C87532' },
    { label: 'SUSPENSION CTRL', sub: 'Servo actuation', color: '#718A61' },
  ];

  return (
    <div style={{
      background: '#181B1E',
      borderBottom: '1px solid #30363B',
      padding: '8px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 8,
    }}>
      <div className="section-header" style={{ color: '#92989D' }}>PIPELINE:</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, justifyContent: 'space-around', flexWrap: 'wrap' }}>
        {steps.map((step, i) => (
          <React.Fragment key={step.label}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 10px',
              background: '#202428',
              border: `1px solid #30363B`,
              borderLeft: `3px solid ${step.color}`,
              borderRadius: 2,
            }}>
              <div>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: step.color,
                }}>
                  {step.label}
                </div>
                <div style={{ fontSize: 8, color: '#92989D', fontFamily: 'JetBrains Mono' }}>
                  {step.sub}
                </div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                color: '#626970',
                fontFamily: 'JetBrains Mono',
                fontSize: 12,
                userSelect: 'none',
              }}>
                →
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
