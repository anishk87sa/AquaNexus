import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

export const RiskTrendChart = ({ trendData = [] }) => {
  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="glass-card-header">
        <div className="card-title">
          <TrendingUp size={18} color="#38bdf8" />
          <span>Hydrological Multi-Series Risk Projection</span>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          12-HOUR TIME-SERIES
        </span>
      </div>

      <div style={{ width: '100%', height: 380, marginTop: '0.5rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={trendData} margin={{ top: 15, right: 20, bottom: 10, left: -15 }}>
            <defs>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#24324f" vertical={false} />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
            
            {/* Left Y Axis for Water Level (m) */}
            <YAxis
              yAxisId="left"
              stroke="#38bdf8"
              tick={{ fontSize: 11 }}
              unit="m"
              domain={[0, 7]}
            />

            {/* Right Y Axis for Risk Probability (%) */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#ef4444"
              tick={{ fontSize: 11 }}
              unit="%"
              domain={[0, 100]}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '0.8rem',
                boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
              }}
            />

            <Legend
              wrapperStyle={{ fontSize: '0.75rem', paddingTop: '10px' }}
              iconType="circle"
            />

            {/* Critical Flood Danger Level Reference */}
            <ReferenceLine
              yAxisId="left"
              y={5.0}
              stroke="#ef4444"
              strokeDasharray="4 4"
              label={{ value: 'Danger Datum (5.0m)', fill: '#ef4444', fontSize: 10, position: 'top' }}
            />

            {/* Rainfall Bars */}
            <Bar
              yAxisId="left"
              dataKey="rainfall"
              name="Rainfall (mm)"
              fill="#0ea5e9"
              opacity={0.4}
              barSize={16}
              radius={[3, 3, 0, 0]}
            />

            {/* Water Level Hydrograph Area */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="waterLevel"
              name="Water Level (m)"
              stroke="#38bdf8"
              strokeWidth={2.5}
              fill="url(#waterGradient)"
            />

            {/* Risk Probability Projection Line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="riskPct"
              name="Flood Risk (%)"
              stroke="#f43f5e"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#f43f5e' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div style={{
        marginTop: '0.6rem',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.72rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid rgba(51, 65, 85, 0.4)',
        paddingTop: '0.5rem',
      }}>
        <span>Historical Gauge Baseline + 4h AI Surge Forecast</span>
        <span style={{ color: '#34d399' }}>Confidence Interval: 94.2%</span>
      </div>
    </div>
  );
};
