import json
import os
from flask import Blueprint, jsonify, current_app

telemetry_bp = Blueprint("telemetry", __name__, url_prefix="/telemetry")


@telemetry_bp.route("/sensors", methods=["GET"])
def get_sensors():
    """
    Get current sensor stations with real-time water levels and GPS coordinates.
    """
    filepath = current_app.config.get("SAMPLE_SENSORS_PATH")
    if filepath and os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
            return jsonify(data), 200

    # Fallback default sensors if file is missing
    fallback_sensors = [
        {
            "id": "sensor-01",
            "name": "Central River Basin Gauge",
            "latitude": 28.6139,
            "longitude": 77.2090,
            "elevation_m": 215.4,
            "water_level_m": 4.12,
            "danger_threshold_m": 5.00,
            "rainfall_1h_mm": 18.5,
            "rainfall_6h_mm": 42.0,
            "drainage_capacity_pct": 74.2,
            "soil_moisture_pct": 82.0,
            "status": "warning"
        }
    ]
    return jsonify(fallback_sensors), 200


@telemetry_bp.route("/sensors/<sensor_id>", methods=["GET"])
def get_sensor_detail(sensor_id):
    """
    Get detailed telemetry and historical trend for a single sensor.
    """
    filepath = current_app.config.get("SAMPLE_SENSORS_PATH")
    if filepath and os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            sensors = json.load(f)
            for sensor in sensors:
                if sensor.get("id") == sensor_id:
                    return jsonify(sensor), 200

    return jsonify({"error": f"Sensor '{sensor_id}' not found"}), 404
