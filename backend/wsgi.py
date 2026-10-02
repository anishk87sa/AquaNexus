import os
from app import create_app

# Use the same logic as run.py – honour FLASK_ENV, default to production.
env = os.getenv("FLASK_ENV", "production")
app = create_app(env)

