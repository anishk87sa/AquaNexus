import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export const MainRiskCard = ({ riskPercentage = 0, riskLevel = 'LOW', prediction, predictionError = null, selectedSensor }) => {
  const getTheme = () => {
    switch (riskLevel) {
      case 'CRITICAL':
        return {
          color: '#ef4444',
          bgGlow: 'rgba(239, 68, 68, 0.15)',
          border: 'rgba(239, 68, 68, 0.4)',
          badgeClass: 'badge-critical',
          pulseClass: 'pulse-dot-red',
          icon: ShieldAlert,
          statusText: 'Immediate Flash Inundation Hazard',
          desc: 'Water levels exceeding critical datum. Emergency containment required.'
        };
      case 'HIGH':
        return {
          color: '#f97316',
          bgGlow: 'rgba(249, 115, 22, 0.15)',
          border: 'rgba(249, 115, 22, 0.4)',
          badgeClass: 'badge-warning',
          pulseClass: 'pulse-dot-amber',
          icon: AlertTriangle,
          statusText: 'Severe Drainage Surcharging',
          desc: 'Runoff rates accelerating. Vulnerable culverts near capacity.'
        };
      case 'WARNING':
        return {
          color: '#f59e0b',
          bgGlow: 'rgba(245, 158, 11, 0.15)',
          border: 'rgba(245, 158, 11, 0.4)',
          badgeClass: 'badge-warning',
          pulseClass: 'pulse-dot-amber',
          icon: AlertTriangle,
          statusText: 'Hydrological Surge Warning',
          desc: 'Persistent rainfall accumulation. Soil saturation elevated.'
        };
      case 'LOW':
      default:
        return {
          color: '#10b981',
          bgGlow: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.35)',
          badgeClass: 'badge-low',
          pulseClass: 'pulse-dot-green',
          icon: ShieldCheck,
          statusText: 'Hydrological Basins Normal',
          desc: 'Runoff within channel capacities. Nominal retention capacity available.'
        };
    }
  };

  const theme = getTheme();
  const Icon = theme.icon;

  return (
    <div
      className="glass-card"
      style={{
        border: `1px solid ${theme.border}`,
        background: `linear-gradient(135deg, ${theme.bgGlow} 0%, rgba(21, 30, 50, 0.95) 100%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
      }}
    >
      <div>
        {/* Card Header */}
        <div className="glass-card-header" style={{ marginBottom: '0.6rem' }}>
          <div className="card-title">
            <Icon size={18} color={theme.color} />
            <span>Composite Flood Risk Index</span>
          </div>
          <div className={`badge ${theme.badgeClass}`}>
            <span className={`pulse-dot ${theme.pulseClass}`} />
            <span>{riskLevel}</span>
          </div>
        </div>

        {/* Big Risk Value Display */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.5rem' }}>
          <span style={{
            fontSize: '3.25rem',
            fontWeight: 800,
            lineHeight: 1,
            color: theme.color,
            fontFamily: 'var(--font-mono)',
            textShadow: `0 0 20px ${theme.color}40`,
          }}>
            {riskPercentage}%
          </span>
          <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Probability
          </span>
        </div>

        {/* Dynamic Progress Bar */}
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: 'rgba(51, 65, 85, 0.5)',
          borderRadius: '9999px',
          overflow: 'hidden',
          marginTop: '0.85rem',
        }}>
          <div style={{
            width: `${riskPercentage}%`,
            height: '100%',
            background: `linear-gradient(90deg, #10b981 0%, #f59e0b 50%, ${theme.color} 100%)`,
            borderRadius: '9999px',
            transition: 'width 0.5s ease',
          }} />
        </div>

        {/* Dynamic Status Text */}
        <div style={{ marginTop: '0.85rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
            {theme.statusText}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {theme.desc}
          </div>
          {predictionError && (
            <div style={{
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#f87171',
              fontSize: '0.72rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '4px',
              padding: '0.25rem 0.5rem',
            }}>
              <AlertTriangle size={12} color="#f87171" />
              <span>Prediction API Error ({predictionError}) — Falling back to heuristic engine</span>
            </div>
          )}
        </div>
      </div>

      {/* Model & Sector Metadata Footer */}
      <div style={{
        marginTop: '1.25rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid rgba(51, 65, 85, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.72rem',
        color: 'var(--text-muted)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Zap size={12} color={predictionError ? "#f59e0b" : "#38bdf8"} />
          <span style={{ color: predictionError ? "#fbbf24" : "inherit" }}>
            {prediction?.engine || 'Scikit-Learn Random Forest'}
          </span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)' }}>
          {selectedSensor?.name?.slice(0, 22) || 'Station 01'}
        </span>
      </div>
    </div>
  );
};
