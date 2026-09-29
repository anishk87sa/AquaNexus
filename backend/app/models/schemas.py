from pydantic import BaseModel, Field
from typing import Optional, Dict


class TelemetryReading(BaseModel):
    rainfall_1h_mm: float = Field(..., ge=0.0, description="1-hour precipitation in mm")
    rainfall_6h_mm: float = Field(..., ge=0.0, description="6-hour cumulative precipitation in mm")
    river_water_level_m: float = Field(..., ge=0.0, description="River gauge level in meters")
    drainage_capacity_pct: float = Field(..., ge=0.0, le=100.0, description="Drainage capacity utilized %")
    soil_moisture_pct: float = Field(..., ge=0.0, le=100.0, description="Soil saturation percentage")
    elevation_m: float = Field(..., description="Elevation above sea level in meters")


class FloodPredictionRequest(BaseModel):
    sensor_id: Optional[str] = Field(None, description="Optional sensor ID")
    telemetry: TelemetryReading


class FloodPredictionResponse(BaseModel):
    risk_level: int = Field(..., ge=0, le=2, description="0: Normal, 1: Warning, 2: Critical")
    risk_label: str = Field(..., description="Normal, Warning, or Critical")
    probabilities: Dict[str, float] = Field(..., description="Risk class probabilities")
    engine: str = Field(default="Scikit-Learn Random Forest", description="Inference engine name")
    model_version: Optional[str] = Field(default="1.0.0", description="Model version identifier")
    sensor_id: Optional[str] = Field(default=None, description="Monitored sensor ID")


class SensorLocation(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    elevation_m: float
    water_level_m: float
    danger_threshold_m: float
    rainfall_1h_mm: float
    rainfall_6h_mm: float
    drainage_capacity_pct: float
    soil_moisture_pct: float
    status: str
