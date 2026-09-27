import os
import joblib
import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

import sys
from pathlib import Path

# Ensure project root and ml directories are on sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
ML_DIR = Path(__file__).resolve().parent.parent
for p in (str(PROJECT_ROOT), str(ML_DIR)):
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from ml.src.config import MODEL_PATH, SAMPLE_DATA_PATH, RISK_LEVEL_LABELS
    from ml.src.features import prepare_datasets
except ImportError:
    from config import MODEL_PATH, SAMPLE_DATA_PATH, RISK_LEVEL_LABELS
    from features import prepare_datasets


def evaluate_model(model_path=MODEL_PATH, test_data_path=SAMPLE_DATA_PATH):
    """
    Run evaluation suite on an exported model using test or validation data.
    """
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model artifact not found at {model_path}. Train the model first.")

    print(f"Loading model from: {model_path}")
    model = joblib.load(model_path)

    print(f"Loading evaluation data from: {test_data_path}")
    df = pd.read_csv(test_data_path)
    X, y_true = prepare_datasets(df)

    y_pred = model.predict(X)
    probs = model.predict_proba(X)

    print("\n--- Model Evaluation Results ---")
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_true, y_pred))

    print("\nClassification Report:")
    target_names = [RISK_LEVEL_LABELS.get(i, f"Class {i}") for i in sorted(list(set(y_true)))]
    print(classification_report(y_true, y_pred, target_names=target_names, zero_division=0))

    return {
        "confusion_matrix": confusion_matrix(y_true, y_pred).tolist(),
        "predictions": y_pred.tolist(),
        "probabilities": probs.tolist(),
    }


if __name__ == "__main__":
    evaluate_model()
