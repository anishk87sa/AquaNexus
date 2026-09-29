import { useState, useEffect, useCallback } from 'react';
import { checkHealth, fetchSensors, predictFloodRisk } from '../services/api';

const DEFAULT_SENSORS = [
  {
    id: "sensor-01",
    name: "Central River Basin Gauge",
    latitude: 28.6139,
    longitude: 77.2090,
    elevation_m: 215.4,
    water_level_m: 4.12,
    danger_threshold_m: 5.00,
    rainfall_1h_mm: 18.5,
    rainfall_6h_mm: 42.0,
    drainage_capacity_pct: 74.2,
    soil_moisture_pct: 82.0,
    status: "warning",
    zone: "Sector 1 - Central Catchment"
  },
  {
    id: "sensor-02",
    name: "North Metro Culvert Station",
    latitude: 28.6500,
    longitude: 77.2300,
    elevation_m: 208.1,
    water_level_m: 2.30,
    danger_threshold_m: 4.20,
    rainfall_1h_mm: 8.0,
    rainfall_6h_mm: 19.5,
    drainage_capacity_pct: 45.0,
    soil_moisture_pct: 65.5,
    status: "normal",
    zone: "Sector 2 - Northern Plains"
  },
  {
    id: "sensor-03",
    name: "South Valley Lowland Outflow",
    latitude: 28.5355,
    longitude: 77.2500,
    elevation_m: 192.0,
    water_level_m: 5.40,
    danger_threshold_m: 5.00,
    rainfall_1h_mm: 36.0,
    rainfall_6h_mm: 82.5,
    drainage_capacity_pct: 94.0,
    soil_moisture_pct: 95.0,
    status: "critical",
    zone: "Sector 3 - South Depression"
  },
  {
    id: "sensor-04",
    name: "Eastern Canal Spillway",
    latitude: 28.6280,
    longitude: 77.2800,
    elevation_m: 204.0,
    water_level_m: 3.10,
    danger_threshold_m: 4.80,
    rainfall_1h_mm: 12.0,
    rainfall_6h_mm: 25.0,
    drainage_capacity_pct: 58.0,
    soil_moisture_pct: 71.0,
    status: "normal",
    zone: "Sector 4 - Eastern Overflow"
  }
];

export const useFloodData = () => {
  const [sensors, setSensors] = useState(DEFAULT_SENSORS);
  const [selectedSensor, setSelectedSensor] = useState(DEFAULT_SENSORS[0]);
  const [systemHealth, setSystemHealth] = useState({
    status: 'checking',
    model_loaded: false,
    service: 'urban-flood-intelligence-backend'
  });
  const [prediction, setPrediction] = useState(null);
  const [predictionError, setPredictionError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Check backend health
  const syncHealth = useCallback(async () => {
    try {
      const data = await checkHealth();
      setSystemHealth(data);
    } catch {
      setSystemHealth({
        status: 'disconnected',
        model_loaded: false,
        service: 'offline'
      });
    }
  }, []);

  // Request prediction for selected sensor
  const triggerPrediction = useCallback(async (sensor) => {
    if (!sensor) return;
    try {
      const payload = {
        sensor_id: sensor.id,
        telemetry: {
          rainfall_1h_mm: Number(sensor.rainfall_1h_mm),
          rainfall_6h_mm: Number(sensor.rainfall_6h_mm),
          river_water_level_m: Number(sensor.water_level_m),
          drainage_capacity_pct: Number(sensor.drainage_capacity_pct),
          soil_moisture_pct: Number(sensor.soil_moisture_pct),
          elevation_m: Number(sensor.elevation_m),
        },
      };
      const result = await predictFloodRisk(payload);
      setPrediction(result);
      setPredictionError(null);
    } catch (e) {
      console.error('Failed to fetch prediction:', e);
      const errMsg = e.response?.data?.error || e.message || 'Prediction failed';
      setPredictionError(errMsg);
      // Fallback prediction calculation
      const isCritical = sensor.water_level_m >= sensor.danger_threshold_m || sensor.rainfall_1h_mm > 30;
      setPrediction({
        risk_level: isCritical ? 2 : sensor.rainfall_1h_mm > 15 ? 1 : 0,
        risk_label: isCritical ? 'Critical' : sensor.rainfall_1h_mm > 15 ? 'Warning' : 'Normal',
        probabilities: {
          Critical: isCritical ? 0.92 : 0.05,
          Warning: isCritical ? 0.06 : 0.35,
          Normal: isCritical ? 0.02 : 0.60
        },
        engine: 'Fallback Engine (Heuristic)'
      });
    }
  }, []);

  // Refresh telemetry & sensors
  const syncTelemetry = useCallback(async () => {
    setLoading(true);
    await syncHealth();
    try {
      const data = await fetchSensors();
      if (Array.isArray(data) && data.length > 0) {
        setSensors(data);
        const match = data.find(s => s.id === (selectedSensor?.id || data[0].id)) || data[0];
        setSelectedSensor(match);
        await triggerPrediction(match);
      } else {
        await triggerPrediction(selectedSensor);
      }
    } catch {
      // Use existing sensor data if network failed
      await triggerPrediction(selectedSensor);
    } finally {
      setLastUpdated(new Date());
      setLoading(false);
    }
  }, [selectedSensor, syncHealth, triggerPrediction]);

  // Initial load
  useEffect(() => {
    syncTelemetry();
    const interval = setInterval(syncTelemetry, 25000); // 25s auto-refresh
    return () => clearInterval(interval);
  }, []);

  // When selected sensor changes, re-fetch prediction
  const handleSelectSensor = (sensor) => {
    setSelectedSensor(sensor);
    triggerPrediction(sensor);
  };

  // Derive risk percentage & standardized level
  const criticalProb = prediction?.probabilities?.Critical ?? (selectedSensor?.status === 'critical' ? 0.94 : 0.15);
  const warningProb = prediction?.probabilities?.Warning ?? 0.2;
  const rawRiskPct = Math.round((criticalProb * 100) + (warningProb * 40));
  const riskPercentage = Math.min(Math.max(rawRiskPct, 5), 98);

  let riskLevel = 'LOW';
  if (riskPercentage >= 80 || prediction?.risk_level === 2) {
    riskLevel = 'CRITICAL';
  } else if (riskPercentage >= 60) {
    riskLevel = 'HIGH';
  } else if (riskPercentage >= 35 || prediction?.risk_level === 1) {
    riskLevel = 'WARNING';
  }

  // Generate hydrograph trend for charts
  const baseWater = selectedSensor?.water_level_m || 3.0;
  const baseRain = selectedSensor?.rainfall_1h_mm || 15.0;
  const trendHistory = [
    { time: '06:00', waterLevel: +(baseWater * 0.72).toFixed(2), rainfall: +(baseRain * 0.3).toFixed(1), riskPct: 22 },
    { time: '08:00', waterLevel: +(baseWater * 0.78).toFixed(2), rainfall: +(baseRain * 0.5).toFixed(1), riskPct: 35 },
    { time: '10:00', waterLevel: +(baseWater * 0.88).toFixed(2), rainfall: +(baseRain * 0.9).toFixed(1), riskPct: 54 },
    { time: '12:00', waterLevel: +(baseWater * 0.95).toFixed(2), rainfall: +(baseRain * 1.3).toFixed(1), riskPct: 71 },
    { time: '14:00', waterLevel: +(baseWater * 1.00).toFixed(2), rainfall: +(baseRain * 1.0).toFixed(1), riskPct: riskPercentage },
    { time: '16:00 (Proj)', waterLevel: +(baseWater * 1.08).toFixed(2), rainfall: +(baseRain * 1.4).toFixed(1), riskPct: Math.min(riskPercentage + 8, 99) },
    { time: '18:00 (Proj)', waterLevel: +(baseWater * 1.12).toFixed(2), rainfall: +(baseRain * 0.8).toFixed(1), riskPct: Math.min(riskPercentage + 4, 99) },
  ];

  return {
    sensors,
    selectedSensor,
    setSelectedSensor: handleSelectSensor,
    systemHealth,
    prediction,
    predictionError,
    riskPercentage,
    riskLevel,
    trendHistory,
    loading,
    lastUpdated,
    refresh: syncTelemetry,
  };
};
