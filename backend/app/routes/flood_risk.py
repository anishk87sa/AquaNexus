from flask import Blueprint, request, jsonify, current_app
from pydantic import ValidationError
from app.models.schemas import FloodPredictionRequest

flood_risk_bp = Blueprint("flood_risk", __name__, url_prefix="/risk")


@flood_risk_bp.route("/predict", methods=["POST"])
def predict_flood_risk():
    """
    Predict flood hazard probability and level from incoming hydrological payload.
    """
    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({"error": "Invalid or missing JSON payload"}), 400

    try:
        req = FloodPredictionRequest(**json_data)
    except ValidationError as err:
        return jsonify({"error": "Validation error", "details": err.errors()}), 422

    features = req.telemetry.model_dump()
    prediction = current_app.predictor.predict(features)
    prediction["sensor_id"] = req.sensor_id

    return jsonify(prediction), 200


@flood_risk_bp.route("/thresholds", methods=["GET"])
def get_risk_thresholds():
    """
    Return predefined hydrological warning thresholds.
    """
    return jsonify({
        "river_water_level_m": {"normal_max": 3.5, "warning_max": 5.0, "critical_min": 5.0},
        "rainfall_1h_mm": {"normal_max": 15.0, "warning_max": 30.0, "critical_min": 30.0},
        "drainage_capacity_pct": {"normal_max": 65.0, "warning_max": 85.0, "critical_min": 85.0},
    }), 200
