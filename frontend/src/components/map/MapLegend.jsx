import { RISK_COLORS } from '../../utils/constants';

export const MapLegend = () => {
  const items = [
    { label: 'Normal / Safe', color: RISK_COLORS.normal },
    { label: 'Warning / Elevated', color: RISK_COLORS.warning },
    { label: 'Critical / Flooding', color: RISK_COLORS.critical },
  ];

  return (
    <div style={{
      position: 'absolute',
      bottom: '16px',
      right: '16px',
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(4px)',
      padding: '0.6rem 0.8rem',
      borderRadius: '0.5rem',
      border: '1px solid var(--border-color)',
      zIndex: 1000,
      fontSize: '0.75rem',
    }}>
      <div style={{ fontWeight: 600, marginBottom: '0.35rem' }}>Flood Hazard Status</div>
      {items.map((item, idx) => (
        <div key={`legend-${item.label}-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color }} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};
