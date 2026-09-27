import os
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

import sys
from pathlib import Path

# Ensure project root and ml directories are on sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
ML_DIR = Path(__file__).resolve().parent.parent
for p in (str(PROJECT_ROOT), str(ML_DIR)):
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from ml.src.config import (
        MODEL_PATH,
        MODEL_DIR,
        SAMPLE_DATA_PATH,
        FEATURE_COLUMNS,
        TARGET_COLUMN,
        RF_PARAMS,
        TEST_SIZE,
        RANDOM_STATE,
    )
    from ml.src.features import prepare_datasets
except ImportError:
    from config import (
        MODEL_PATH,
        MODEL_DIR,
        SAMPLE_DATA_PATH,
        FEATURE_COLUMNS,
        TARGET_COLUMN,
        RF_PARAMS,
        TEST_SIZE,
        RANDOM_STATE,
    )
    from features import prepare_datasets


def train_model(data_path=SAMPLE_DATA_PATH, model_output_path=MODEL_PATH):
    """
    Train a Random Forest classifier on hydrological telemetry data.
    """
    print(f"Loading training data from: {data_path}", flush=True)
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Training data not found at {data_path}")

    df = pd.read_csv(data_path)
    X, y = prepare_datasets(df)

    if y is None:
        raise ValueError(f"Target column '{TARGET_COLUMN}' missing from training data.")

    print(f"Training dataset size: {len(X)} samples, {len(FEATURE_COLUMNS)} features.", flush=True)

    # Train / test split (stratify if enough samples per class)
    min_class_count = int(y.value_counts().min())
    stratify = y if min_class_count >= 2 else None
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=stratify
    )

    print("Fitting Random Forest Classifier...", flush=True)
    model = RandomForestClassifier(**RF_PARAMS)
    model.fit(X_train, y_train)

    # Evaluation on test set
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Test Accuracy: {accuracy:.4f}", flush=True)
    print("\nClassification Report:", flush=True)
    print(classification_report(y_test, y_pred, zero_division=0), flush=True)

    # Feature Importance
    importances = pd.Series(model.feature_importances_, index=FEATURE_COLUMNS)
    print("\nFeature Importances:", flush=True)
    print(importances.sort_values(ascending=False), flush=True)

    # Export serialized model artifact
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, model_output_path)
    print(f"\nModel saved successfully to: {model_output_path}", flush=True)

    return model


if __name__ == "__main__":
    train_model()
