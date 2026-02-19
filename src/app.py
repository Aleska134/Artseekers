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

# 1. Configuración de Base de Datos
db_url = os.getenv("DATABASE_URL")

# Detectamos si estamos en Codespaces (desarrollo) o en la nube (producción)
if db_url and "postgresql" in db_url:
    # Si la URL es de Postgres, estamos en producción (Render/Heroku)
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    # Estamos en LOCAL (Codespaces) -> Forzamos la ruta absoluta de 4 barras
    # Esto ignora el sqlite:/// del .env y usa la ruta que creamos
    current_dir = os.path.dirname(os.path.realpath(__file__))
    db_path = os.path.join(current_dir, "instance", "test.db")
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:////{db_path}"
    print(f"--- BACKEND FORCED TO: {app.config['SQLALCHEMY_DATABASE_URI']} ---")

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False



# 2. VINCULACIÓN INMEDIATA (Esto arregla el error)
db.init_app(app)
MIGRATE = Migrate(app, db, compare_type=True)

# 3. Resto de configuraciones
app.config["JWT_SECRET_KEY"] = "super-secret"
jwt = JWTManager(app)

# 4. Importar rutas DESPUÉS de haber vinculado la DB
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