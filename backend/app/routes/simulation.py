from flask import Blueprint, jsonify, request
from app.services.weather_service import WeatherService

simulation_bp = Blueprint("simulation", __name__, url_prefix="/simulation")


@simulation_bp.route("/forecast", methods=["GET"])
def get_precipitation_forecast():
    """
    Projected precipitation timeseries for Recharts.
    """
    hours = request.args.get("hours", default=12, type=int)
    forecast = WeatherService.get_hourly_forecast(hours=min(hours, 48))
    return jsonify(forecast), 200


@simulation_bp.route("/scenario", methods=["POST"])
def run_storm_scenario():
    """
    Simulate impact of hypothetical storm surges on drainage systems.
    """
    data = request.get_json(silent=True) or {}
    storm_intensity_mm = data.get("storm_intensity_mm", 45.0)
    duration_hours = data.get("duration_hours", 3)

    runoff_estimate_m3 = storm_intensity_mm * duration_hours * 12500.0
    critical_overspill = storm_intensity_mm > 40.0

    return jsonify({
        "scenario": {
            "storm_intensity_mm": storm_intensity_mm,
            "duration_hours": duration_hours,
        },
        "estimated_total_runoff_m3": round(runoff_estimate_m3, 2),
        "critical_overspill_risk": critical_overspill,
        "recommendation": "Activate retention basins" if critical_overspill else "Standard drainage monitoring",
    }), 200
