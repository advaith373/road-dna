import React from 'react';

export const SystemFlowIndicator: React.FC = () => {
  const steps = [
    { label: 'SENSORS', sub: 'GPS · IMU · HALL · POT', color: '#6F8792' },
    { label: 'FUSION', sub: 'Signal conditioning', color: '#D59A32' },
    { label: 'ROAD MODEL', sub: 'Surface assessment', color: '#D59A32' },
    { label: 'PREDICTION', sub: 'Disturbance model', color: '#D59A32' },
    { label: 'SUSPENSION', sub: 'Servo actuation', color: '#718B5A' },
  ];

  return (
    <div style={{ padding: '10px 20px 4px', maxWidth: 1920, margin: '0 auto' }}>
      <div className="data-label" style={{ marginBottom: 7 }}>SYSTEM PIPELINE</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: 7 }}>
        {steps.map((step, i) => (
          <React.Fragment key={step.label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, whiteSpace: 'nowrap' }}>
              <div style={{ width: 7, height: 7, background: step.color, borderRadius: '50%', flexShrink: 0 }} />
              <div>
                <div style={{ font: '700 10px/1.2 var(--mono)', letterSpacing: '.08em', color: step.color }}>{step.label}</div>
                <div style={{ font: '10px/1.2 var(--sans)', color: '#73787D', marginTop: 2 }}>{step.sub}</div>
              </div>
            </div>
            {i < steps.length - 1 && <div style={{ width: 'clamp(24px, 5vw, 110px)', height: 1, background: '#30343A', margin: '0 12px', position: 'relative', flexShrink: 0 }}><span style={{ position: 'absolute', right: 0, top: -2, width: 0, height: 0, borderTop: '3px solid transparent', borderBottom: '3px solid transparent', borderLeft: '4px solid #30343A' }} /></div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
