from app import app
from api.models import db, User, Exhibits, Departments

with app.app_context():
    print("Verifying database models...")
    
    # create_all only creates tables that DO NOT exist yet.
    # It will NOT delete or overwrite your current Exhibits or Departments data.
    db.create_all()
    
    print("Process finished! If the 'user' table was missing, it has now been created.")