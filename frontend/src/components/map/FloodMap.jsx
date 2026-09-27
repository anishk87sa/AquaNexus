import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Circle, Popup, Tooltip } from 'react-leaflet';
import { MapLegend } from './MapLegend';
import { formatWaterLevel, formatRainfall } from '../../utils/formatters';
import { MapPin, Navigation, AlertTriangle, ShieldCheck } from 'lucide-react';

const MAP_CENTER = [28.6139, 77.2090];
const MAP_ZOOM = 11;

export const FloodMap = ({ sensors = [], selectedSensor, onSelectSensor }) => {
  const getRiskColor = (status) => {
    switch (status) {
      case 'critical':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'normal':
      default:
        return '#10b981';
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
      <div className="glass-card-header" style={{ marginBottom: '0.75rem' }}>
        <div className="card-title">
          <Navigation size={18} color="#38bdf8" />
          <span>Geospatial Flood Inundation & Risk Zones</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>OpenStreetMap Live Vector</span>
          <span style={{ color: '#38bdf8' }}>•</span>
          <span>{sensors.length} Monitored Catchments</span>
        </div>
      </div>

      <div className="map-container-box">
        <MapContainer
          center={MAP_CENTER}
          zoom={MAP_ZOOM}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          {/* OpenStreetMap Standard Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {sensors.map((sensor) => {
            const isSelected = selectedSensor && selectedSensor.id === sensor.id;
            const color = getRiskColor(sensor.status);
            const riskRadiusMeters = sensor.status === 'critical' ? 2400 : sensor.status === 'warning' ? 1700 : 1000;

            return (
              <React.Fragment key={sensor.id}>
                {/* Simulated Inundation Hazard Buffer Zone */}
                <Circle
                  center={[sensor.latitude, sensor.longitude]}
                  radius={riskRadiusMeters}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: isSelected ? 0.28 : 0.16,
                    color: color,
                    weight: isSelected ? 2 : 1,
                    dashArray: sensor.status === 'critical' ? '4, 4' : undefined,
                  }}
                />

                {/* Primary Station Pin Node */}
                <CircleMarker
                  center={[sensor.latitude, sensor.longitude]}
                  radius={isSelected ? 13 : 9}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: 0.95,
                    color: '#ffffff',
                    weight: isSelected ? 3 : 1.5,
                  }}
                  eventHandlers={{
                    click: () => onSelectSensor && onSelectSensor(sensor),
                  }}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                      {sensor.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: color, textTransform: 'uppercase' }}>
                      Status: {sensor.status}
                    </div>
                  </Tooltip>

                  <Popup>
                    <div style={{ color: '#0f172a', minWidth: '200px', padding: '0.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{sensor.name}</strong>
                      </div>
                      
                      <div style={{
                        display: 'inline-block',
                        backgroundColor: color,
                        color: '#ffffff',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        marginBottom: '0.5rem',
                      }}>
                        {sensor.status} RISK SECTOR
                      </div>

                      <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div><strong>Water Level:</strong> {formatWaterLevel(sensor.water_level_m)}</div>
                        <div><strong>Critical Threshold:</strong> {formatWaterLevel(sensor.danger_threshold_m)}</div>
                        <div><strong>Rainfall (1h):</strong> {formatRainfall(sensor.rainfall_1h_mm)}</div>
                        <div><strong>Drainage Usage:</strong> {sensor.drainage_capacity_pct}%</div>
                        <div><strong>Terrain Elevation:</strong> {sensor.elevation_m} m</div>
                      </div>

                      <button
                        onClick={() => onSelectSensor && onSelectSensor(sensor)}
                        style={{
                          marginTop: '0.65rem',
                          width: '100%',
                          backgroundColor: '#0284c7',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '0.35rem 0',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Inspect Zone Telemetry
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              </React.Fragment>
            );
          })}
        </MapContainer>

        <MapLegend />
      </div>

      <div style={{
        marginTop: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
      }}>
        <span>Click any station marker or zone to load live sensor telemetry & run ML prediction</span>
        <span style={{ color: '#38bdf8' }}>Active Focus: {selectedSensor?.name || 'All Stations'}</span>
      </div>
    </div>
  );
};
