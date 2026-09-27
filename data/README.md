# Urban Flood Intelligence - Data Management

This directory manages hydrological datasets, weather sensor time series, terrain elevation descriptors, and municipal drainage metrics.

## Structure

```
data/
├── raw/                  # Original raw telemetric data (CSV, GeoJSON, NetCDF)
├── processed/            # Cleaned, aligned, and scaled tabular feature stores
└── sample/               # Lightweight mock fixtures for tests and local development
```

## Data Dictionary (Key Hydrological & Environmental Features)

| Feature Name | Type | Description | Unit |
| :--- | :--- | :--- | :--- |
| `sensor_id` | String | Unique identifier for hydrological sensor node | - |
| `timestamp` | Datetime | ISO 8601 reading timestamp | UTC |
| `rainfall_1h_mm` | Float | Cumulative precipitation over the past hour | mm |
| `rainfall_6h_mm` | Float | Cumulative precipitation over past 6 hours | mm |
| `river_water_level_m` | Float | Water elevation above riverbed datum | meters |
| `drainage_capacity_pct`| Float | Effective municipal stormwater capacity utilization | % (0-100) |
| `soil_moisture_pct` | Float | Volumetric soil water saturation index | % (0-100) |
| `elevation_m` | Float | Topographical height of monitored zone above sea level | meters |
| `flood_risk_level` | Int / String | Target classification: 0 (Normal), 1 (Advisory), 2 (Critical) | - |
