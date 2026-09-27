import React from 'react';
import { Layers, Mountain, Gauge, Droplet } from 'lucide-react';

export const InfrastructureCard = ({ sensor }) => {
  const drainageCap = sensor?.drainage_capacity_pct ?? 74.2;
  const soilMoisture = sensor?.soil_moisture_pct ?? 82.0;
  const elevation = sensor?.elevation_m ?? 215.4;

  const isDrainageOverloaded = drainageCap > 85;
  const isSoilSaturated = soilMoisture > 85;

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div className="glass-card-header">
          <div className="card-title">
            <Layers size={18} color="#a855f7" />
            <span>Infrastructure & Terrain</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            SURFACE DRAINAGE
          </span>
        </div>

        {/* 3 Infrastructure Telemetry Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.2rem' }}>
          {/* Drainage Capacity */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.2rem' }}>
              <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Gauge size={12} color="#38bdf8" />
                Stormwater Drainage Load
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: isDrainageOverloaded ? '#ef4444' : drainageCap > 70 ? '#f59e0b' : '#34d399',
              }}>
                {drainageCap.toFixed(1)}%
              </span>
            </div>
            <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(51, 65, 85, 0.5)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${drainageCap}%`,
                height: '100%',
                backgroundColor: isDrainageOverloaded ? '#ef4444' : drainageCap > 70 ? '#f59e0b' : '#38bdf8',
                borderRadius: '4px',
              }} />
            </div>
          </div>

          {/* Soil Moisture */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.2rem' }}>
              <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Droplet size={12} color="#a855f7" />
                Soil Water Saturation
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: isSoilSaturated ? '#ef4444' : '#a855f7',
              }}>
                {soilMoisture.toFixed(1)}%
              </span>
            </div>
            <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(51, 65, 85, 0.5)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${soilMoisture}%`,
                height: '100%',
                backgroundColor: isSoilSaturated ? '#ef4444' : '#a855f7',
                borderRadius: '4px',
              }} />
            </div>
          </div>

          {/* Elevation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            padding: '0.45rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid #1e293b',
            marginTop: '0.1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              <Mountain size={13} color="#f59e0b" />
              <span>Terrain Ground Level</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>
              {elevation.toFixed(1)} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>m MSL</span>
            </span>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '0.85rem',
        paddingTop: '0.6rem',
        borderTop: '1px solid rgba(51, 65, 85, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.7rem',
        color: 'var(--text-muted)',
      }}>
        <span>Runoff Risk: {soilMoisture > 80 ? 'Near Zero Infiltration' : 'Moderate Absorption'}</span>
        <span>Culvert Valves: Auto-Regulating</span>
      </div>
    </div>
  );
};
