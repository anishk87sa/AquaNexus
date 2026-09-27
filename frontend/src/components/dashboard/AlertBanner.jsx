import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export const AlertBanner = ({ criticalCount = 0, warningCount = 0 }) => {
  if (criticalCount === 0 && warningCount === 0) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1.25rem',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid #10b981',
        borderRadius: '0.5rem',
        marginBottom: '1.5rem',
      }}>
        <CheckCircle2 color="#10b981" size={20} />
        <span style={{ color: '#10b981', fontWeight: 500, fontSize: '0.9rem' }}>
          All hydrological monitoring sectors operating within normal safety limits.
        </span>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1.25rem',
      backgroundColor: criticalCount > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
      border: `1px solid ${criticalCount > 0 ? '#ef4444' : '#f59e0b'}`,
      borderRadius: '0.5rem',
      marginBottom: '1.5rem',
    }}>
      <AlertTriangle color={criticalCount > 0 ? '#ef4444' : '#f59e0b'} size={20} />
      <span style={{ color: criticalCount > 0 ? '#ef4444' : '#f59e0b', fontWeight: 600, fontSize: '0.9rem' }}>
        {criticalCount > 0
          ? `CRITICAL ALERT: ${criticalCount} station(s) reporting water levels above emergency threshold!`
          : `ADVISORY: ${warningCount} station(s) experiencing elevated water levels and drainage pressure.`}
      </span>
    </div>
  );
};
