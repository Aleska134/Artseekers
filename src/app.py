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

if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    # 1. Ruta absoluta desde la raíz del sistema de archivos
    # Esto dará: /workspaces/Artseekers/src/instance/test.db
    current_dir = os.path.dirname(os.path.realpath(__file__))
    instance_dir = os.path.join(current_dir, "instance")
    os.makedirs(instance_dir, exist_ok=True)
    db_path = os.path.join(instance_dir, "test.db")

    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:////{db_path}"
    
    print(f"--- DATABASE PATH: {db_path} ---")

    # app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"

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