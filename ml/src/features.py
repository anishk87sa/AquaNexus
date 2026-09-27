import pandas as pd
import numpy as np
try:
    from ml.src.config import FEATURE_COLUMNS, TARGET_COLUMN
except ImportError:
    from config import FEATURE_COLUMNS, TARGET_COLUMN


def clean_hydrology_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Sanitize and drop NaN / corrupted sensor telemetry.
    """
    df = df.copy()
    df = df.dropna(subset=FEATURE_COLUMNS)
    for col in FEATURE_COLUMNS:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    df = df.dropna(subset=FEATURE_COLUMNS)
    return df


def engineer_flood_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Derive domain-specific hydrological indicators:
    - rainfall_acceleration: ratio or surge of 1h to 6h rainfall
    - runoff_potential: combination of soil moisture and rainfall
    """
    df = df.copy()
    
    # Rainfall surge ratio (avoid div by zero)
    df["rainfall_surge_ratio"] = df["rainfall_1h_mm"] / (df["rainfall_6h_mm"] / 6.0 + 1e-4)
    
    # Saturated runoff vulnerability index
    df["runoff_vulnerability"] = (df["soil_moisture_pct"] / 100.0) * df["rainfall_1h_mm"]
    
    return df


def prepare_datasets(df: pd.DataFrame):
    """
    Extract feature matrix X and ground truth vector y.
    """
    clean_df = clean_hydrology_data(df)
    X = clean_df[FEATURE_COLUMNS]
    y = clean_df[TARGET_COLUMN].astype(int) if TARGET_COLUMN in clean_df.columns else None
    return X, y
