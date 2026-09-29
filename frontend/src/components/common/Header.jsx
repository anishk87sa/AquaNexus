import React from 'react';
import { Waves, RefreshCw, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';

export const Header = ({ systemHealth, lastUpdated, onRefresh, loading, isFallbackData = false }) => {
  const isBackendOnline = systemHealth?.status === 'healthy';
  const isModelActive = systemHealth?.model_loaded === true;

  const formattedTime = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--';

  return (
    <header style={{
      background: 'linear-gradient(180deg, #111827 0%, rgba(17, 24, 39, 0.95) 100%)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.85rem 1.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backdropFilter: 'blur(8px)',
    }}>
      {/* Brand & Project Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(2, 132, 199, 0.4)',
        }}>
          <Waves size={24} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              margin: 0,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}>
              Urban Flood Intelligence
            </h1>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: '#38bdf8',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              textTransform: 'uppercase',
            }}>
              Decision Support
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            Real-Time Hydrological Defense & ML Flash-Flood Early Warning
          </p>
        </div>
      </div>

      {/* Middle: Live Monitoring Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid var(--border-color)',
        padding: '0.4rem 0.85rem',
        borderRadius: '9999px',
      }}>
        <span className={`pulse-dot ${isFallbackData ? 'pulse-dot-amber' : 'pulse-dot-green'}`} />
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: isFallbackData ? '#fbbf24' : '#34d399',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          {isFallbackData ? 'Demo Fallback Telemetry' : 'Live Monitoring'}
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>•</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          {formattedTime}
        </span>
      </div>

      {/* Right: System Status & Sync */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Backend & ML Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            padding: '0.3rem 0.65rem',
            borderRadius: '6px',
            backgroundColor: isBackendOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${isBackendOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            color: isBackendOnline ? '#34d399' : '#f87171',
          }}>
            {isBackendOnline ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
            <span>Flask API: {isBackendOnline ? 'Online' : 'Offline'}</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            padding: '0.3rem 0.65rem',
            borderRadius: '6px',
            backgroundColor: isModelActive ? 'rgba(56, 189, 248, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: `1px solid ${isModelActive ? 'rgba(56, 189, 248, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            color: isModelActive ? '#38bdf8' : '#fbbf24',
          }}>
            <Cpu size={13} />
            <span>Random Forest: {isModelActive ? 'Active' : 'Standby'}</span>
          </div>
        </div>

        {/* Sync Telemetry Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.4rem 0.85rem',
            backgroundColor: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '0.8rem',
            fontWeight: 500,
            transition: 'all 0.15s ease',
          }}
          title="Sync latest sensor telemetry and recalculate predictions"
        >
          <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          <span>{loading ? 'Refreshing...' : 'Sync'}</span>
        </button>
      </div>
    </header>
  );
};
