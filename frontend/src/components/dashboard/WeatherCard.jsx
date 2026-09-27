import React from 'react';
import { CloudRain, Droplets, CloudLightning, ArrowUpRight } from 'lucide-react';

export const WeatherCard = ({ sensor }) => {
  const rainfall1h = sensor?.rainfall_1h_mm ?? 18.5;
  const rainfall6h = sensor?.rainfall_6h_mm ?? 42.0;

  // Determine precipitation intensity label
  let intensity = 'Light Showers';
  let intensityColor = '#34d399';
  if (rainfall1h > 30) {
    intensity = 'Torrential Downpour';
    intensityColor = '#ef4444';
  } else if (rainfall1h > 15) {
    intensity = 'Heavy Precipitation';
    intensityColor = '#f59e0b';
  } else if (rainfall1h > 5) {
    intensity = 'Moderate Rain';
    intensityColor = '#38bdf8';
  }

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div className="glass-card-header">
          <div className="card-title">
            <CloudRain size={18} color="#38bdf8" />
            <span>Precipitation Telemetry</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.7rem',
            color: intensityColor,
            fontWeight: 600,
            backgroundColor: `${intensityColor}15`,
            padding: '0.15rem 0.5rem',
            borderRadius: '4px',
          }}>
            <CloudLightning size={12} />
            <span>{intensity}</span>
          </div>
        </div>

        {/* 1h and 6h Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
          {/* 1h Rainfall */}
          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            padding: '0.85rem',
            borderRadius: '8px',
            border: '1px solid #1e293b',
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Droplets size={12} color="#38bdf8" />
              <span>Rainfall 1h</span>
            </div>
            <div style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              color: rainfall1h > 20 ? '#ef4444' : '#38bdf8',
              fontFamily: 'var(--font-mono)',
              marginTop: '0.2rem',
            }}>
              {rainfall1h.toFixed(1)} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>mm</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Instant surge rate
            </div>
          </div>

          {/* 6h Rainfall */}
          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            padding: '0.85rem',
            borderRadius: '8px',
            border: '1px solid #1e293b',
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Droplets size={12} color="#06b6d4" />
              <span>Rainfall 6h</span>
            </div>
            <div style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              color: '#f8fafc',
              fontFamily: 'var(--font-mono)',
              marginTop: '0.2rem',
            }}>
              {rainfall6h.toFixed(1)} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>mm</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Cumulative storm depth
            </div>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '1rem',
        fontSize: '0.72rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.6rem',
        borderTop: '1px solid rgba(51, 65, 85, 0.4)',
      }}>
        <span>Radar Doppler Feed: Active</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#38bdf8' }}>
          <span>Rain Gauge Array</span>
          <ArrowUpRight size={12} />
        </div>
      </div>
    </div>
  );
};
