import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR.parent / "data"
MODEL_DIR = BASE_DIR / "models"
MODEL_PATH = MODEL_DIR / "flood_rf_model.joblib"
SAMPLE_DATA_PATH = DATA_DIR / "sample" / "flood_training_sample.csv"

# Model Features
FEATURE_COLUMNS = [
    "rainfall_1h_mm",
    "rainfall_6h_mm",
    "river_water_level_m",
    "drainage_capacity_pct",
    "soil_moisture_pct",
    "elevation_m",
]

TARGET_COLUMN = "flood_risk_level"

# Risk Class Labels
RISK_LEVEL_LABELS = {
    0: "Normal",
    1: "Warning",
    2: "Critical",
}

# Random Forest Hyperparameters
RF_PARAMS = {
    "n_estimators": 100,
    "max_depth": 8,
    "min_samples_split": 2,
    "min_samples_leaf": 1,
    "random_state": 42,
    "class_weight": "balanced",
}

# Train/Test Split
TEST_SIZE = 0.2
RANDOM_STATE = 42
