import React, { useState, useEffect } from 'react';
import {
  Route,
  Navigation,
  MapPin,
  Compass,
  CheckCircle,
  AlertTriangle,
  Shield
} from 'lucide-react';

export const EmergencyRoutePanel = ({
  riskLevel = 'LOW',
  selectedSensor
}) => {
  const [calculating, setCalculating] = useState(false);
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);
  const [recommendation, setRecommendation] = useState(
    'AI route optimization ready.'
  );

  const getSensorSeverity = () => {
    if (!selectedSensor) return 0;

    const waterLevel = Number(selectedSensor.water_level_m || 0);
    const dangerLevel = Number(selectedSensor.danger_threshold_m || 1);
    const rainfall = Number(selectedSensor.rainfall_1h_mm || 0);

    const waterRatio = waterLevel / dangerLevel;

    if (waterRatio >= 1 || rainfall >= 30) {
      return 3;
    }

    if (waterRatio >= 0.85 || rainfall >= 20) {
      return 2;
    }

    if (waterRatio >= 0.65 || rainfall >= 15) {
      return 1;
    }

    return 0;
  };

  const sensorSeverity = getSensorSeverity();

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
      details:
        'Elevated viaduct structure completely above 100-year flood zone datum.',
      score:
        riskLevel === 'CRITICAL'
          ? 95
          : riskLevel === 'HIGH'
            ? 92
            : 98
    },
    {
      id: 'R-02',
      name: 'Corridor B: Metro Ring Elevated Bypass',
      status:
        riskLevel === 'CRITICAL' ? 'CONGESTED' : 'PASSABLE',
      type: 'Secondary Arterial',
      elevGain: '+16 m Elevation Gain',
      clearanceTime:
        riskLevel === 'CRITICAL' ? '24 mins' : '15 mins',
      traffic:
        riskLevel === 'CRITICAL'
          ? 'Heavy Evacuation Traffic'
          : 'Moderate',
      risk:
        riskLevel === 'CRITICAL'
          ? 'MODERATE RISK'
          : 'LOW RISK',
      details:
        'Viaduct section open; minor surface runoff on on-ramp junctions.',
      score:
        riskLevel === 'CRITICAL'
          ? 65
          : riskLevel === 'HIGH'
            ? 88
            : 82
    },
    {
      id: 'R-03',
      name: 'Corridor C: Riverbank Boulevard Underpass',
      status:
        riskLevel === 'CRITICAL' ? 'IMPASSABLE' : 'WARNING',
      type: 'Lowland Trench',
      elevGain: '-4 m Depression',
      clearanceTime: 'BLOCKED',
      traffic: 'Road Closed / Submerged',
      risk: 'CRITICAL HAZARD',
      details:
        'Inundation depth exceeds 0.75m; automatic barricades deployed.',
      score: 5
    }
  ];

  const calculateBestRoute = () => {
    let bestIndex = 0;
    let bestScore = -1;

    routes.forEach((route, index) => {
      let score = route.score;

      if (sensorSeverity >= 3) {
        if (route.id === 'R-03') score -= 100;
        if (route.id === 'R-02') score -= 15;
      }

      if (sensorSeverity >= 2) {
        if (route.id === 'R-03') score -= 50;
      }

      if (route.status === 'IMPASSABLE') {
        score = -999;
      }

      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    });

    return bestIndex;
  };

  const handleRecalculate = () => {
    if (calculating) return;

    setCalculating(true);
    setRecommendation('AI engine analysing flood telemetry...');

    setTimeout(() => {
      const bestRoute = calculateBestRoute();

      setActiveRouteIndex(bestRoute);

      const selectedRoute = routes[bestRoute];

      if (selectedRoute.id === 'R-01') {
        setRecommendation(
          'AI Recommendation: Highland Expressway selected due to higher elevation and lower flood exposure.'
        );
      } else if (selectedRoute.id === 'R-02') {
        setRecommendation(
          'AI Recommendation: Metro Ring Elevated Bypass selected as the safer alternate corridor.'
        );
      } else {
        setRecommendation(
          'AI Recommendation: Route selected based on current telemetry.'
        );
      }

      setCalculating(false);
    }, 1000);
  };

  useEffect(() => {
    const bestRoute = calculateBestRoute();
    setActiveRouteIndex(bestRoute);
  }, [riskLevel, selectedSensor]);

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
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
              cursor: calculating ? 'wait' : 'pointer'
            }}
          >
            <Compass
              size={12}
              className={calculating ? 'animate-spin' : ''}
            />

            <span>
              {calculating ? 'Optimizing...' : 'Re-Route AI'}
            </span>
          </button>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            padding: '0.65rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.85rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <MapPin size={16} color="#10b981" />

            <div>
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#f8fafc'
                }}
              >
                Designated Safe Muster Haven: Highland Sports Complex
              </div>

              <div
                style={{
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)'
                }}
              >
                Grid: 28.635°N, 77.185°E • Elevation: 238m (Safe Zone)
              </div>
            </div>
          </div>

          <span
            className="badge badge-low"
            style={{ fontSize: '0.68rem' }}
          >
            2.6 km Away
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.55rem 0.7rem',
            marginBottom: '0.8rem',
            backgroundColor: 'rgba(2, 132, 199, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '6px',
            fontSize: '0.7rem',
            color: '#38bdf8'
          }}
        >
          {calculating ? (
            <Compass size={14} className="animate-spin" />
          ) : (
            <Shield size={14} />
          )}

          <span>
            {calculating
              ? 'Analysing water level, rainfall and route elevation...'
              : recommendation}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem'
          }}
        >
          {routes.map((route, idx) => {
            const isSelected = activeRouteIndex === idx;
            const isBlocked = route.status === 'IMPASSABLE';
            const isCongested = route.status === 'CONGESTED';

            const statusColor = isBlocked
              ? '#ef4444'
              : isCongested
                ? '#f59e0b'
                : '#10b981';

            return (
              <div
                key={route.id}
                onClick={() => {
                  if (!isBlocked) {
                    setActiveRouteIndex(idx);
                    setRecommendation(
                      `Manual selection: ${route.name}`
                    );
                  }
                }}
                style={{
                  backgroundColor: isSelected
                    ? 'rgba(30, 41, 59, 0.8)'
                    : 'rgba(15, 23, 42, 0.5)',
                  border: `1px solid ${
                    isSelected ? statusColor : '#1e293b'
                  }`,
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  cursor: isBlocked ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                  opacity: isBlocked ? 0.65 : 1
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.25rem'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem'
                    }}
                  >
                    <Navigation
                      size={13}
                      color={statusColor}
                    />

                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        color: '#f8fafc'
                      }}
                    >
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
                      borderRadius: '4px'
                    }}
                  >
                    {route.status}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.2rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <span>
                    Transit Time:{' '}
                    <strong style={{ color: '#cbd5e1' }}>
                      {route.clearanceTime}
                    </strong>
                  </span>

                  <span>•</span>

                  <span>{route.elevGain}</span>

                  <span>•</span>

                  <span style={{ color: statusColor }}>
                    {route.traffic}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-secondary)',
                    marginTop: '0.3rem',
                    fontStyle: 'italic'
                  }}
                >
                  {route.details}
                </div>

                {isSelected && !isBlocked && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      marginTop: '0.45rem',
                      color: '#10b981',
                      fontSize: '0.68rem',
                      fontWeight: 700
                    }}
                  >
                    <CheckCircle size={12} />
                    AI SELECTED SAFE ROUTE
                  </div>
                )}

                {isBlocked && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      marginTop: '0.45rem',
                      color: '#ef4444',
                      fontSize: '0.68rem',
                      fontWeight: 700
                    }}
                  >
                    <AlertTriangle size={12} />
                    AVOID — FLOOD HAZARD
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          marginTop: '0.85rem',
          paddingTop: '0.6rem',
          borderTop: '1px solid rgba(51, 65, 85, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.7rem',
          color: 'var(--text-muted)'
        }}
      >
        <span>A* Dynamic Elevation Pathfinding Engine</span>

        <span style={{ color: '#38bdf8' }}>
          Synchronized with Sector Drainage State
        </span>
      </div>
    </div>
  );
};