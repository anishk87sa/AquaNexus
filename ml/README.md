# Machine Learning Module: Urban Flood Risk Prediction

This module implements a Scikit-Learn **Random Forest Classifier** to assess urban flash-flood hazards based on multi-variate hydrological telemetry (precipitation accumulation, river gauge levels, soil moisture saturation, and elevation).

## Directory Structure

```
ml/
├── models/               # Saved serialized model artifacts (.joblib)
├── notebooks/            # Jupyter notebooks for data analysis & experiments
├── src/
│   ├── __init__.py
│   ├── config.py         # Features, target definition & hyperparameters
│   ├── features.py       # Data cleaning, scaling, and feature engineering
│   ├── train.py          # Random Forest training and artifact export script
│   ├── evaluate.py       # Performance evaluation and metrics reporting
│   └── predict.py        # Reusable inference engine for real-time risk scoring
└── requirements.txt      # Machine learning dependencies
```

## Features Used

- `rainfall_1h_mm`: Immediate 1-hour cumulative precipitation (mm)
- `rainfall_6h_mm`: Medium-term 6-hour cumulative precipitation (mm)
- `river_water_level_m`: Sensor-measured river/channel water level (meters)
- `drainage_capacity_pct`: Capacity percentage utilized in drainage network
- `soil_moisture_pct`: Soil water content percentage
- `elevation_m`: Topographic elevation (meters)

## Model Output

- `flood_risk_level`:
  - `0`: Normal / Low Risk (Safe conditions)
  - `1`: Warning / Moderate Risk (Advisory, monitor gauges)
  - `2`: Critical / High Risk (Immediate flood hazard, activate mitigation)
- Class probabilities for risk confidence scoring.

## Quick Train Command

```bash
cd ml
pip install -r requirements.txt
python src/train.py
```
