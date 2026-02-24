import os
from app import app
from api.models import db
from sqlalchemy import inspect

with app.app_context():
    uri = app.config['SQLALCHEMY_DATABASE_URI']
    print(f"\n1. DATABASE URI in Flask: {uri}")
    
    # try to connect and inspect the database
    try:
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        print(f"2. Tables found in this file: {tables}")
        
        if 'exhibits' in tables:
            from api.models import Exhibits
            count = db.session.query(Exhibits).count()
            print(f"3. Rows in 'exhibits' table: {count}")
        else:
            print("3. CRITICAL: 'exhibits' table is MISSING in this file.")
            
    except Exception as e:
        print(f"Error connecting: {e}")

print(f"\n4. Checking physical file on disk...")
# Extract the path from the URI and check if the file exists (for SQLite)
path = uri.replace("sqlite:///", "").replace("sqlite://", "")
if os.path.exists(path):
    print(f"   File exists at: {path}")
    print(f"   File size: {os.path.getsize(path)} bytes")
else:
    print(f"   CRITICAL: File NOT FOUND at {path}")