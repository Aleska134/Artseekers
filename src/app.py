"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from api.models import db, User, Exhibits, Departments # Importamos todo junto
from api.utils import APIException, generate_sitemap
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager

app = Flask(__name__)
app.url_map.strict_slashes = False

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key-for-testing")  # Use env variable or default for testing
jwt = JWTManager(app)

# 1. Database Configuration
db_url = os.getenv("DATABASE_URL")

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key-for-testing")

# Detect if we're running in a production environment (like Render or Heroku) by checking if 
# DATABASE_URL is set and contains "postgresql". If so, we use that. Otherwise, we default to a local SQLite database for development.
if db_url and "postgresql" in db_url:
    # Si la URL es de Postgres, estamos en producción (Render/Heroku)
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    # In local (Codespaces) -> force the use of our SQLite path (ignoring .env if it exists)
    # Ignoring .env DATABASE_URL in development to ensure we use SQLite locally, which is simpler 
    # for testing and avoids Postgres setup issues.
    current_dir = os.path.dirname(os.path.realpath(__file__))
    db_path = os.path.join(current_dir, "instance", "test.db")
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:////{db_path}"
    print(f"--- BACKEND FORCED TO: {app.config['SQLALCHEMY_DATABASE_URI']} ---")

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 2. Inmediatee DB Initialization (before importing routes)
db.init_app(app)
MIGRATE = Migrate(app, db, compare_type=True)

# 3. Confiuration for JWT (JSON Web Tokens) for Authentication
# app.config["JWT_SECRET_KEY"] = "super-secret"
# jwt = JWTManager(app)

# 4. Import routes after initializing DB to avoid circular imports
from api.routes import api
app.register_blueprint(api, url_prefix='/api')

setup_admin(app)
setup_commands(app)

@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

@app.route('/')
def sitemap():
    return generate_sitemap(app)

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)