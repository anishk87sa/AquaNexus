import React from 'react';
import { Header } from './components/common/Header';
import { MainRiskCard } from './components/dashboard/MainRiskCard';
import { WeatherCard } from './components/dashboard/WeatherCard';
import { WaterLevelCard } from './components/dashboard/WaterLevelCard';
import { InfrastructureCard } from './components/dashboard/InfrastructureCard';
import { FloodMap } from './components/map/FloodMap';
import { RiskTrendChart } from './components/charts/RiskTrendChart';
import { AlertPanel } from './components/dashboard/AlertPanel';
import { EmergencyRoutePanel } from './components/dashboard/EmergencyRoutePanel';
import { useFloodData } from './hooks/useFloodData';

export function App() {
  const {
    sensors,
    selectedSensor,
    setSelectedSensor,
    systemHealth,
    prediction,
    riskPercentage,
    riskLevel,
    trendHistory,
    loading,
    lastUpdated,
    refresh,
  } = useFloodData();

  return (
    <div className="dashboard-layout">
      {/* 1. Top Navbar */}
      <Header
        systemHealth={systemHealth}
        lastUpdated={lastUpdated}
        onRefresh={refresh}
        loading={loading}
      />

      <main className="dashboard-container">
        {/* Top 4 KPI Metrics: Main Risk, Weather, Water Level, Infrastructure */}
        <section className="metrics-grid">
          {/* 2. Main Risk Card */}
          <MainRiskCard
            riskPercentage={riskPercentage}
            riskLevel={riskLevel}
            prediction={prediction}
            selectedSensor={selectedSensor}
          />

          {/* 3. Weather Card */}
          <WeatherCard sensor={selectedSensor} />

          {/* 4. Water Level Card */}
          <WaterLevelCard sensor={selectedSensor} />

          {/* 5. Infrastructure Card */}
          <InfrastructureCard sensor={selectedSensor} />
        </section>

        {/* Mid Section: Interactive Map + Hydrograph Chart */}
        <section className="main-grid">
          {/* 6. Interactive Leaflet + OpenStreetMap Map */}
          <FloodMap
            sensors={sensors}
            selectedSensor={selectedSensor}
            onSelectSensor={setSelectedSensor}
          />

          {/* 7. Risk Trend Chart using Recharts */}
          <RiskTrendChart trendData={trendHistory} />
        </section>

        {/* Bottom Section: Alerts & Emergency Route Optimization */}
        <section className="operational-grid">
          {/* 8. Alert Panel */}
          <AlertPanel
            riskLevel={riskLevel}
            selectedSensor={selectedSensor}
          />

          {/* 9. Emergency Route Panel */}
          <EmergencyRoutePanel
            riskLevel={riskLevel}
            selectedSensor={selectedSensor}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
