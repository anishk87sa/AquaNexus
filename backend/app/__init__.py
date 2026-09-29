from flask import Flask, jsonify
from flask_cors import CORS
from app.config import config_by_name
from app.services.predictor import MLPredictorService
from app.routes.health import health_bp
from app.routes.flood_risk import flood_risk_bp
from app.routes.telemetry import telemetry_bp
from app.routes.simulation import simulation_bp


def create_app(config_name: str = "development") -> Flask:
    """
    Application factory for Urban Flood Intelligence Flask Backend.
    """
    app = Flask(__name__)
    app.config.from_object(config_by_name.get(config_name, config_by_name["development"]))

    # Setup CORS for frontend communication
    CORS(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})

    # Initialize ML Predictor Service
    app.predictor = MLPredictorService(model_path=app.config.get("ML_MODEL_PATH"))

    # Register API Blueprints
    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(flood_risk_bp, url_prefix="/api/risk")
    app.register_blueprint(telemetry_bp, url_prefix="/api/telemetry")
    app.register_blueprint(simulation_bp, url_prefix="/api/simulation")

    @app.errorhandler(404)
    def handle_not_found(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def handle_server_error(e):
        return jsonify({"error": "Internal server error"}), 500

    return app
