import React from 'react';
import { Bell, Radio, Siren } from 'lucide-react';

export const AlertPanel = ({ riskLevel = 'LOW', selectedSensor }) => {
  const isCritical = riskLevel === 'CRITICAL';
  const isHigh = riskLevel === 'HIGH';
  const isWarning = riskLevel === 'WARNING';

  const alerts = [
    {
      id: 1,
      severity: isCritical ? 'CRITICAL' : isHigh ? 'HIGH' : isWarning ? 'WARNING' : 'INFO',
      title: isCritical
        ? `FLASH FLOOD EMERGENCY: ${selectedSensor?.name || 'Sector 3'}`
        : isWarning
        ? `High Water Advisory: ${selectedSensor?.name || 'River Basin'}`
        : 'Normal Hydrological Stream Monitoring',
      desc: isCritical
        ? `Water elevation at ${selectedSensor?.water_level_m}m exceeded danger datum. Low-lying retention basins surcharged.`
        : isWarning
        ? `Soil saturation index reaching 80%+. Elevated surface runoff potential over the next 3 hours.`
        : 'All arterial drainage pumps operating nominally. Stormwater channels cleared.',
      time: 'Just now',
      source: 'Municipal Sensor Network',
    },
    {
      id: 2,
      severity: 'WARNING',
      title: 'Stormwater Surcharge: South Culverts',
      desc: 'Pump stations 4 and 7 triggered automated flood diversion gates to reduce urban backflow.',
      time: '14 min ago',
      source: 'Telemetry Telecontrol',
    },
    {
      id: 3,
      severity: 'INFO',
      title: 'Doppler Radar Storm Cell Inbound',
      desc: 'Projected 25mm precipitation front moving Northeast across metro catchment area.',
      time: '32 min ago',
      source: 'National Weather Service',
    }
  ];

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="glass-card-header">
        <div className="card-title">
          <Bell size={18} color="#f59e0b" />
          <span>Active Civil Defense Advisories & Warnings</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: '#f59e0b' }}>
          <Radio size={13} className="pulse-dot-amber" />
          <span>LIVE TELEMETRY BROADCAST</span>
        </div>
      </div>

      {/* Prominent Critical Emergency Warning Banner if Risk is Critical */}
      {isCritical && (
        <div style={{
          backgroundColor: 'rgba(220, 38, 38, 0.2)',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '0.85rem 1rem',
          marginBottom: '1rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.25)',
        }}>
          <div style={{
            backgroundColor: '#ef4444',
            padding: '0.4rem',
            borderRadius: '6px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Siren size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#f87171', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.04em' }}>
                IMMEDIATE EVACUATION DIRECTIVE: CRITICAL RISK
              </span>
              <span className="badge badge-critical">Code Red</span>
            </div>
            <p style={{ color: '#fecaca', fontSize: '0.75rem', marginTop: '0.25rem', lineHeight: 1.4 }}>
              Severe inundation imminent near <strong>{selectedSensor?.name}</strong>. Civil authorities have issued evacuation advisories for low-lying basements and underpasses.
            </p>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginTop: '0.5rem',
              fontSize: '0.7rem',
              fontWeight: 600,
            }}>
              <span style={{ color: '#ffffff', backgroundColor: '#dc2626', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                Action 1: Dispatch Barrier Pumps
              </span>
              <span style={{ color: '#ffffff', backgroundColor: '#991b1b', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                Action 2: Close Floodgate A-4
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {alerts.map((alert, idx) => {
          const badgeColor =
            alert.severity === 'CRITICAL' ? 'badge-critical' :
            alert.severity === 'HIGH' || alert.severity === 'WARNING' ? 'badge-warning' : 'badge-low';

          return (
            <div
              key={`alert-${alert.id}-${idx}`}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.55)',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                padding: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className={`badge ${badgeColor}`}>{alert.severity}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#f8fafc' }}>
                    {alert.title}
                  </span>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{alert.time}</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                {alert.desc}
              </p>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Source: {alert.source}</span>
                <span style={{ color: '#38bdf8' }}>Verified Channel</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
