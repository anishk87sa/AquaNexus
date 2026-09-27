import React from 'react';
import { Waves, TrendingUp, TrendingDown, AlertOctagon } from 'lucide-react';

export const WaterLevelCard = ({ sensor }) => {
  const currentLevel = sensor?.water_level_m ?? 4.12;
  const dangerThreshold = sensor?.danger_threshold_m ?? 5.00;
  const isOverThreshold = currentLevel >= dangerThreshold;
  const percentageOfThreshold = Math.min(Math.round((currentLevel / dangerThreshold) * 100), 120);

  // Determine trend
  const isRising = currentLevel > 3.0;
  const TrendIcon = isRising ? TrendingUp : TrendingDown;
  const trendColor = isRising ? (isOverThreshold ? '#ef4444' : '#f59e0b') : '#10b981';

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div className="glass-card-header">
          <div className="card-title">
            <Waves size={18} color="#06b6d4" />
            <span>Water Elevation</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: trendColor,
            backgroundColor: `${trendColor}15`,
            padding: '0.15rem 0.5rem',
            borderRadius: '4px',
          }}>
            <TrendIcon size={13} />
            <span>{isRising ? '+0.32 m/h Rising' : '-0.15 m/h Receding'}</span>
          </div>
        </div>

        {/* Current Reading & Threshold */}
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: isOverThreshold ? '#ef4444' : '#f8fafc',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1,
            }}>
              {currentLevel.toFixed(2)}
            </span>
            <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              meters (datum)
            </span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            marginTop: '0.6rem',
          }}>
            <span>Datum: Riverbed 0.0m</span>
            <span style={{ color: isOverThreshold ? '#ef4444' : '#cbd5e1', fontWeight: 600 }}>
              Danger Mark: {dangerThreshold.toFixed(2)} m
            </span>
          </div>

          {/* Level Progress Gauge Bar */}
          <div style={{
            width: '100%',
            height: '7px',
            backgroundColor: 'rgba(51, 65, 85, 0.5)',
            borderRadius: '9999px',
            overflow: 'hidden',
            marginTop: '0.35rem',
          }}>
            <div style={{
              width: `${Math.min(percentageOfThreshold, 100)}%`,
              height: '100%',
              backgroundColor: isOverThreshold ? '#ef4444' : percentageOfThreshold > 75 ? '#f59e0b' : '#38bdf8',
              borderRadius: '9999px',
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Overflow Status Flag */}
      <div style={{
        marginTop: '1rem',
        paddingTop: '0.6rem',
        borderTop: '1px solid rgba(51, 65, 85, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.72rem',
      }}>
        {isOverThreshold ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444', fontWeight: 600 }}>
            <AlertOctagon size={13} />
            <span>Spillway Overflow Imminent (+{(currentLevel - dangerThreshold).toFixed(2)}m)</span>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)' }}>
            Safety Headroom: <strong style={{ color: '#34d399' }}>{(dangerThreshold - currentLevel).toFixed(2)} m</strong> remaining
          </div>
        )}
        <span style={{ color: 'var(--text-muted)' }}>Hydro-Sensor ID: {sensor?.id || '01'}</span>
      </div>
    </div>
  );
};
