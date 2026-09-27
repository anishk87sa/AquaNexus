import os
from app import create_app

# WSGI production application instance
app = create_app(os.getenv("FLASK_ENV", "production"))
