import React, { useState } from 'react';
import { Route, Shield, AlertTriangle, CheckCircle, Navigation, MapPin, Compass } from 'lucide-react';

export const EmergencyRoutePanel = ({ riskLevel = 'LOW', selectedSensor }) => {
  const [calculating, setCalculating] = useState(false);
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);

  const isCritical = riskLevel === 'CRITICAL';

  const routes = [
    {
      id: 'R-01',
      name: 'Corridor A: Highland Expressway (NH-48)',
      status: 'PASSABLE',
      type: 'Primary Arterial',
      elevGain: '+24 m Elevation Gain',
      clearanceTime: '11 mins',
      traffic: 'Free Flowing',
      risk: 'LOW RISK',
      details: 'Elevated viaduct structure completely above 100-year flood zone datum.'
    },
    {
      id: 'R-02',
      name: 'Corridor B: Metro Ring Elevated Bypass',
      status: isCritical ? 'CONGESTED' : 'PASSABLE',
      type: 'Secondary Arterial',
      elevGain: '+16 m Elevation Gain',
      clearanceTime: isCritical ? '24 mins' : '15 mins',
      traffic: isCritical ? 'Heavy Evacuation Traffic' : 'Moderate',
      risk: isCritical ? 'MODERATE RISK' : 'LOW RISK',
      details: 'Viaduct section open; minor surface runoff on on-ramp junctions.'
    },
    {
      id: 'R-03',
      name: 'Corridor C: Riverbank Boulevard Underpass',
      status: isCritical ? 'IMPASSABLE' : 'WARNING',
      type: 'Lowland Trench',
      elevGain: '-4 m Depression',
      clearanceTime: 'BLOCKED',
      traffic: 'Road Closed / Submerged',
      risk: 'CRITICAL HAZARD',
      details: 'Inundation depth exceeds 0.75m; automatic barricades deployed.'
    }
  ];

  const handleRecalculate = () => {
    setCalculating(true);
    setTimeout(() => {
      setCalculating(false);
    }, 800);
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div className="glass-card-header">
          <div className="card-title">
            <Route size={18} color="#38bdf8" />
            <span>Emergency Safe Route Optimization</span>
          </div>
          <button
            onClick={handleRecalculate}
            disabled={calculating}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#1e293b',
              color: '#38bdf8',
              border: '1px solid #334155',
              borderRadius: '5px',
              padding: '0.2rem 0.6rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: calculating ? 'wait' : 'pointer',
            }}
          >
            <Compass size={12} className={calculating ? 'animate-spin' : ''} />
            <span>{calculating ? 'Optimizing...' : 'Re-Route AI'}</span>
          </button>
        </div>

        {/* Designated Safe Muster Haven */}
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid #1e293b',
          borderRadius: '8px',
          padding: '0.65rem 0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.85rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} color="#10b981" />
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc' }}>
                Designated Safe Muster Haven: Highland Sports Complex
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                Grid: 28.635°N, 77.185°E • Elevation: 238m (Safe Zone)
              </div>
            </div>
          </div>
          <span className="badge badge-low" style={{ fontSize: '0.68rem' }}>2.6 km Away</span>
        </div>

        {/* Dynamic Route Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {routes.map((route, idx) => {
            const isSelected = activeRouteIndex === idx;
            const isBlocked = route.status === 'IMPASSABLE';
            const isCongested = route.status === 'CONGESTED';
            const statusColor = isBlocked ? '#ef4444' : isCongested ? '#f59e0b' : '#10b981';

            return (
              <div
                key={route.id}
                onClick={() => setActiveRouteIndex(idx)}
                style={{
                  backgroundColor: isSelected ? 'rgba(30, 41, 59, 0.8)' : 'rgba(15, 23, 42, 0.5)',
                  border: `1px solid ${isSelected ? statusColor : '#1e293b'}`,
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Navigation size={13} color={statusColor} />
                    <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#f8fafc' }}>
                      {route.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: statusColor,
                      backgroundColor: `${statusColor}18`,
                      padding: '0.1rem 0.45rem',
                      borderRadius: '4px',
                    }}
                  >
                    {route.status}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.2rem',
                }}>
                  <span>Transit Time: <strong style={{ color: '#cbd5e1' }}>{route.clearanceTime}</strong></span>
                  <span>•</span>
                  <span>{route.elevGain}</span>
                  <span>•</span>
                  <span style={{ color: statusColor }}>{route.traffic}</span>
                </div>

                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.3rem', fontStyle: 'italic' }}>
                  {route.details}
                </div>
              </div>
            );
          })}
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
        <span>A* Dynamic Elevation Pathfinding Engine</span>
        <span style={{ color: '#38bdf8' }}>Synchronized with Sector Drainage State</span>
      </div>
    </div>
  );
};
