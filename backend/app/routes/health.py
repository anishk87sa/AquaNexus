from flask import Blueprint, jsonify, current_app

health_bp = Blueprint("health", __name__)


@health_bp.route("/health", methods=["GET"])
def health_check():
    """
    Service health check endpoint.
    """
    model_loaded = current_app.predictor.model is not None if hasattr(current_app, "predictor") else False
    return jsonify({
        "status": "healthy",
        "service": "urban-flood-intelligence-backend",
        "model_loaded": model_loaded,
        "environment": current_app.config.get("ENV", "unknown")
    }), 200
