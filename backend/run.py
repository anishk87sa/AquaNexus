import os
os.environ["FLASK_ENV"] = "development"

from app import create_app

env = "development"
app = create_app(env)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    host = os.getenv("HOST", "0.0.0.0")
    debug = env == "development"
    print(f"Starting Urban Flood Intelligence API on http://{host}:{port} [{env}]")
    app.run(host=host, port=port, debug=debug)
