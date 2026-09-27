import os
import joblib
import pandas as pd
from typing import Dict, Any, Union, List

import sys
from pathlib import Path

# Ensure project root and ml directories are on sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
ML_DIR = Path(__file__).resolve().parent.parent
for p in (str(PROJECT_ROOT), str(ML_DIR)):
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from ml.src.config import MODEL_PATH, FEATURE_COLUMNS, RISK_LEVEL_LABELS
except ImportError:
    from config import MODEL_PATH, FEATURE_COLUMNS, RISK_LEVEL_LABELS


class FloodRiskPredictor:
    """
    Inference interface for scoring real-time flood risk from hydrological sensor observations.
    """

    def __init__(self, model_path: Union[str, os.PathLike] = MODEL_PATH):
        self.model_path = model_path
        self.model = None
        self._load_model()

    def _load_model(self):
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
        else:
            self.model = None

    @property
    def is_loaded(self) -> bool:
        return self.model is not None

    def predict_sample(self, features: Dict[str, float]) -> Dict[str, Any]:
        """
        Predict flood risk level for a single telemetry payload.
        """
        # Validate required features
        missing = [col for col in FEATURE_COLUMNS if col not in features]
        if missing:
            raise ValueError(f"Missing required telemetry features: {missing}")

        row = pd.DataFrame([{col: features[col] for col in FEATURE_COLUMNS}])

        if self.model is None:
            # Fallback heuristic rule-engine if ML model is not yet trained
            return self._heuristic_fallback(features)

        risk_level = int(self.model.predict(row)[0])
        probabilities = self.model.predict_proba(row)[0].tolist()

        return {
            "risk_level": risk_level,
            "risk_label": RISK_LEVEL_LABELS.get(risk_level, "Unknown"),
            "probabilities": {
                RISK_LEVEL_LABELS.get(idx, f"Class {idx}"): round(prob, 4)
                for idx, prob in enumerate(probabilities)
            },
            "model_version": "RandomForest-v1",
        }

    def _heuristic_fallback(self, features: Dict[str, float]) -> Dict[str, Any]:
        """
        Deterministic hydrological rule heuristic when model file is not present.
        """
        water_level = features.get("river_water_level_m", 0.0)
        rainfall_1h = features.get("rainfall_1h_mm", 0.0)
        drainage = features.get("drainage_capacity_pct", 0.0)

        if water_level >= 5.0 or (rainfall_1h > 30 and drainage > 85):
            level = 2
        elif water_level >= 3.5 or (rainfall_1h > 15 and drainage > 65):
            level = 1
        else:
            level = 0

        return {
            "risk_level": level,
            "risk_label": RISK_LEVEL_LABELS.get(level, "Unknown"),
            "probabilities": {
                "Normal": 0.0 if level != 0 else 1.0,
                "Warning": 0.0 if level != 1 else 1.0,
                "Critical": 0.0 if level != 2 else 1.0,
            },
            "model_version": "HeuristicFallback",
        }
