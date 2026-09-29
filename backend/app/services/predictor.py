import logging
import os
import joblib
import pandas as pd
from typing import Dict, Any

logger = logging.getLogger(__name__)

FEATURE_ORDER = [
    "rainfall_1h_mm",
    "rainfall_6h_mm",
    "river_water_level_m",
    "drainage_capacity_pct",
    "soil_moisture_pct",
    "elevation_m",
]

RISK_LABELS = {0: "Normal", 1: "Warning", 2: "Critical"}


class MLPredictorService:
    """
    Manages Scikit-Learn Random Forest model lifecycle and predictions in Flask.
    """

    def __init__(self, model_path=None):
        self.model_path = model_path
        self.model = None
        self.reload()

    def reload(self):
        if self.model_path and os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
                logger.info(f"Loaded Random Forest model from {self.model_path}")
            except Exception as e:
                logger.error(f"Failed to load model from {self.model_path}: {e}")
                self.model = None
        else:
            logger.warning(f"Model path {self.model_path} does not exist. Using heuristic rules.")
            self.model = None

    @property
    def is_loaded(self) -> bool:
        return self.model is not None

    def predict(self, telemetry: Dict[str, float]) -> Dict[str, Any]:
        """
        Run inference against the loaded RF model or fallback heuristic.
        """
        if self.model is not None:
            try:
                row = pd.DataFrame([{col: telemetry[col] for col in FEATURE_ORDER}])
                pred = int(self.model.predict(row)[0])
                probs = self.model.predict_proba(row)[0]
                return {
                    "risk_level": pred,
                    "risk_label": RISK_LABELS.get(pred, "Unknown"),
                    "probabilities": {
                        RISK_LABELS[i]: round(float(probs[i]), 4)
                        for i in range(len(probs))
                    },
                    "engine": "Scikit-Learn Random Forest",
                    "model_version": "1.0.0",
                }
            except Exception as e:
                logger.error(f"Error during ML inference: {e}")

        # Heuristic fallback if model is missing or fails
        return self._heuristic(telemetry)

    def _heuristic(self, telemetry: Dict[str, float]) -> Dict[str, Any]:
        water_level = telemetry.get("river_water_level_m", 0.0)
        rainfall_1h = telemetry.get("rainfall_1h_mm", 0.0)
        drainage = telemetry.get("drainage_capacity_pct", 0.0)

        if water_level >= 5.0 or (rainfall_1h > 30 and drainage > 85):
            level = 2
        elif water_level >= 3.5 or (rainfall_1h > 15 and drainage > 65):
            level = 1
        else:
            level = 0

        return {
            "risk_level": level,
            "risk_label": RISK_LABELS[level],
            "probabilities": {
                "Normal": 1.0 if level == 0 else 0.0,
                "Warning": 1.0 if level == 1 else 0.0,
                "Critical": 1.0 if level == 2 else 0.0,
            },
            "engine": "Heuristic Rule Fallback",
            "model_version": "1.0.0-heuristic",
        }
