import datetime
from typing import List, Dict, Any


class WeatherService:
    """
    Simulates or integrates external meteorological forecasts and rainfall timeseries.
    """

    @staticmethod
    def get_hourly_forecast(hours: int = 12) -> List[Dict[str, Any]]:
        """
        Generate projected precipitation trends for charts.
        """
        now = datetime.datetime.now(datetime.timezone.utc)
        forecast = []
        base_rainfall = [2.0, 4.5, 9.0, 16.5, 28.0, 35.0, 22.0, 14.0, 8.0, 4.0, 1.5, 0.5]

        for i in range(hours):
            t = now + datetime.timedelta(hours=i)
            rainfall = base_rainfall[i % len(base_rainfall)]
            forecast.append({
                "time": t.strftime("%H:00"),
                "timestamp": t.isoformat(),
                "expected_rainfall_mm": rainfall,
                "confidence_pct": max(50, 95 - (i * 3)),
            })
        return forecast
