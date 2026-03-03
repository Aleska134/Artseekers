"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from api.models import db, User, Exhibits, Departments
from api.utils import APIException, generate_sitemap
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__)
app.url_map.strict_slashes = False

# Allow CORS for all domains on all routes
CORS(app)

# Configuration
ENV = os.getenv("FLASK_DEBUG")
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')

# 1. Database Configuration
db_url = os.getenv("DATABASE_URL")

if db_url:
    # Fix for Render/Heroku/Neon which sometimes uses 'postgres://'
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    # Fallback only if DATABASE_URL is missing
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
print(f"--- DATABASE CONNECTED TO: {app.config['SQLALCHEMY_DATABASE_URI']} ---")

# 2. JWT Configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key-for-testing")
jwt = JWTManager(app)

# 3. DB Initialization
db.init_app(app)
MIGRATE = Migrate(app, db, compare_type=True)

# 4. Import routes after initializing DB to avoid circular imports
from api.routes import api
app.register_blueprint(api, url_prefix='/api')

setup_admin(app)
setup_commands(app)

# Error handling
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Static file serving
@app.route('/')
def sitemap():
    if ENV == "1": # In development (Codespaces) show the sitemap
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

@app.route('/<path:path>', methods=['GET'])
def any_other_view(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    return send_from_directory(static_file_dir, path)

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)