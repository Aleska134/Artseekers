import os
from app import app
from api.models import db, User, Exhibits, Departments

with app.app_context():
    # 1. Imprimir la ruta donde Flask cree que está la base de datos
    print(f"Flask is looking at: {app.config['SQLALCHEMY_DATABASE_URI']}")
    
    # 2. Crear las tablas físicamente
    print("Creating tables...")
    db.create_all()
    
    # 3. Verificar si la tabla existe
    from sqlalchemy import inspect
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()
    print(f"Tables found in DB: {tables}")
    
    if 'user' in tables:
        print("SUCCESS: 'user' table is now ready!")
    else:
        print("ERROR: 'user' table still missing.")