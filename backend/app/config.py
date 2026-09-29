import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent


class Config:
    """Base application configuration."""
    ENV = os.getenv("FLASK_ENV", "production")
    DEBUG = os.getenv("FLASK_DEBUG", "0") == "1"
    PORT = int(os.getenv("PORT", 5000))
    HOST = os.getenv("HOST", "0.0.0.0")

    # CORS configuration
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
    ]

    # File paths
    # Resolve paths relative to the project root (urban-flood-intelligence)
    PROJECT_ROOT = BASE_DIR.parent
    ML_MODEL_PATH = Path(os.getenv("ML_MODEL_PATH", PROJECT_ROOT / "ml" / "models" / "flood_rf_model.joblib")).resolve()
    SAMPLE_SENSORS_PATH = Path(os.getenv("DATA_SAMPLE_PATH", PROJECT_ROOT / "data" / "sample" / "sensors_sample.json")).resolve()


class DevelopmentConfig(Config):
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


config_by_name = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
}
