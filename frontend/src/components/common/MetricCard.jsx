import React from 'react';

export const MetricCard = ({ title, value, subtext, icon: Icon, color = '#38bdf8' }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {title}
        </span>
        {Icon && <Icon size={20} color={color} />}
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        {value}
      </div>
      {subtext && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {subtext}
        </div>
      )}
    </div>
  );
};
