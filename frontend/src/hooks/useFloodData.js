import { useToast } from './useToast';

import { checkHealth, fetchSensors, predictFloodRisk } from '../services/api';
import { FALLBACK_SENSORS } from '../data/fallbackSensors';

export const DEFAULT_SENSORS = FALLBACK_SENSORS;

  const { showToast } = useToast();
  const [sensors, setSensors] = useState(FALLBACK_SENSORS);
  const [selectedSensor, setSelectedSensor] = useState(FALLBACK_SENSORS[0]);
  const [isFallbackData, setIsFallbackData] = useState(true);
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
      showToast('Prediction updated', 'success');
    } catch (e) {
      console.error('Failed to fetch prediction:', e);
      const errMsg = e.response?.data?.error || e.message || 'Prediction failed';
      setPredictionError(errMsg);
      showToast(errMsg, 'error');
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
        engine: 'Fallback Engine (Heuristic)',
        model_version: '1.0.0-heuristic',
        sensor_id: sensor.id,
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
        // Deduplicate sensors by ID to guarantee unique React keys
        const uniqueSensors = Array.from(
          new Map(data.map((item, idx) => [item.id || `sensor-${idx}`, item])).values()
        );
        setSensors(uniqueSensors);
        setIsFallbackData(false);
        const match = uniqueSensors.find(s => s.id === (selectedSensor?.id || uniqueSensors[0].id)) || uniqueSensors[0];
        setSelectedSensor(match);
        await triggerPrediction(match);
      } else {
        // Fallback to offline demo data if API returns empty array
        setSensors(FALLBACK_SENSORS);
        setIsFallbackData(true);
        await triggerPrediction(selectedSensor || FALLBACK_SENSORS[0]);
      }
    } catch {
      // Use fallback sensor fixtures if network / API failed
      setIsFallbackData(true);
      await triggerPrediction(selectedSensor || FALLBACK_SENSORS[0]);
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
    isFallbackData,
    riskPercentage,
    riskLevel,
    trendHistory,
    loading,
    lastUpdated,
    Toast,
  };
};
