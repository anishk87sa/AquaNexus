import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchSensors = async () => {
  const response = await api.get('/telemetry/sensors');
  return response.data;
};

export const fetchSensorDetail = async (sensorId) => {
  const response = await api.get(`/telemetry/sensors/${sensorId}`);
  return response.data;
};

export const predictFloodRisk = async (telemetryPayload) => {
  const response = await api.post('/risk/predict', telemetryPayload);
  return response.data;
};

export const fetchRainfallForecast = async (hours = 12) => {
  const response = await api.get(`/simulation/forecast?hours=${hours}`);
  return response.data;
};

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
