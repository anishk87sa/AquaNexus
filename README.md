# Urban Flood Intelligence Platform

A modular full-stack decision-support system designed to monitor urban hydrology, forecast flash-flood risks using machine learning, and provide geospatial situational awareness for emergency management teams.

---

## Architecture Overview

```
urban-flood-intelligence/
├── backend/            # Python Flask REST API & service orchestration
├── frontend/           # React + Vite dashboard with Leaflet & Recharts
├── ml/                 # Scikit-learn Random Forest training & inference pipeline
└── data/               # Raw, processed, and synthetic hydrological telemetry
```

### Tech Stack
- **Frontend**: React 18 / 19, Vite, Leaflet, React-Leaflet, Recharts, Lucide React
- **Backend**: Python 3.11+, Flask, Flask-CORS, Pydantic, Gunicorn
- **Machine Learning**: Scikit-Learn (Random Forest), NumPy, Pandas, Joblib
- **Geospatial & Mapping**: Leaflet.js with OpenStreetMap CartoDB tiles
- **Data & Telemetry**: Time-series hydrological readings, precipitation forecasts, sensor telemetry

---

## Directory Organization

```
urban-flood-intelligence/
├── backend/
│   ├── app/
│   │   ├── __init__.py           # Flask app factory
│   │   ├── config.py             # Environment & service configurations
│   │   ├── routes/               # Modular Flask blueprints
│   │   │   ├── health.py         # System health & readiness probes
│   │   │   ├── flood_risk.py     # Flood risk assessment & ML prediction endpoints
│   │   │   └── telemetry.py      # Water level sensors & weather station feeds
│   │   ├── services/
│   │   │   ├── predictor.py      # ML model loader & inference engine wrapper
│   │   │   └── weather_service.py # Meteorological inputs & rainfall data adapter
│   │   ├── models/               # Domain data contracts & validation schemas
│   │   └── utils/                # Geo-calculation & coordinate helpers
│   ├── run.py                    # Local development server entry point
│   ├── wsgi.py                   # Production WSGI entry point
│   ├── requirements.txt          # Backend dependencies
│   └── .env.example              # Backend environment template
├── frontend/
│   ├── public/                   # Static assets & icons
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Navigation, header, metric cards
│   │   │   ├── map/              # Leaflet + OpenStreetMap geospatial flood map
│   │   │   ├── charts/           # Recharts hydrographs & rainfall trends
│   │   │   └── dashboard/        # Layout and risk indicator widgets
│   │   ├── services/             # Axios API client & error handling
│   │   ├── hooks/                # Custom React data-fetching hooks
│   │   ├── utils/                # Date/time & metric formatting utilities
│   │   ├── App.jsx               # Main application container
│   │   ├── main.jsx              # Vite entry script
│   │   └── index.css             # Base styles & layout resets
│   ├── package.json              # NPM dependencies & scripts
│   ├── vite.config.js            # Vite configuration with API proxying
│   └── .env.example              # Frontend environment template
├── ml/
│   ├── src/
│   │   ├── config.py             # Feature definitions & hyperparameter config
│   │   ├── features.py           # Preprocessing & lag feature extraction
│   │   ├── train.py              # Random Forest model training & persistence
│   │   ├── evaluate.py           # Precision, recall, ROC-AUC evaluation metrics
│   │   └── predict.py            # Standalone inference class
│   ├── models/                   # Serialized Random Forest model artifacts (.joblib)
│   ├── notebooks/                # Exploratory data analysis & feature research
│   └── requirements.txt          # ML-specific dependencies
├── data/
│   ├── raw/                      # Unprocessed sensory logs & gauge readings
│   ├── processed/                # Normalized tabular training datasets
│   └── sample/                   # Seed fixtures for local development
├── docker-compose.yml            # Multi-service local environment definition
├── .gitignore                    # Clean repo ignore rules
└── README.md                     # Root project documentation
```

---

## Quickstart (Development)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
python run.py
```
Backend runs at `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

### 3. Machine Learning Model Pipeline
```bash
cd ml
pip install -r requirements.txt
python src/train.py
```
This trains the Random Forest model on historical/sample data and exports the artifact to `ml/models/flood_rf_model.joblib`.
