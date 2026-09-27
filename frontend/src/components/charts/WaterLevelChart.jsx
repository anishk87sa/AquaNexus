import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

export const WaterLevelChart = ({ sensors = [] }) => {
  const chartData = sensors.map((s) => ({
    name: s.name.replace(/Gauge|Station|Spillway|Outflow/gi, '').trim(),
    waterLevel: s.water_level_m,
    threshold: s.danger_threshold_m,
    status: s.status,
  }));

  const getBarColor = (status) => {
    if (status === 'critical') return '#ef4444';
    if (status === 'warning') return '#f59e0b';
    return '#38bdf8';
  };

  return (
    <div className="card">
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
        Current Water Levels vs Danger Thresholds
      </h3>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} unit="m" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#f8fafc',
              }}
            />
            <ReferenceLine y={5.0} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Critical (5m)', fill: '#ef4444', fontSize: 10 }} />
            <Bar dataKey="waterLevel" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
