import os
from flask_admin import Admin
from flask_admin.theme import Bootstrap4Theme 
from .models import db, User, Exhibits, Departments
from flask_admin.contrib.sqla import ModelView

# Personalized admin view for the User model to enhance security and usability
class UserView(ModelView):
    column_list = ('id', 'name', 'username', 'email', 'is_active') 
    column_exclude_list = ['password', ] 
    column_searchable_list = ['email', 'username', 'name']
    column_filters = ['is_active']

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    
    # Configuramos el tema moderno (Bootstrap 4) con el color Cerulean
    # Esto reemplaza al antiguo template_mode='bootstrap3'
    my_theme = Bootstrap4Theme(swatch='cerulean')
    
    # initialize the admin interface with our custom theme
    admin = Admin(app, name='Artseekers Admin Panel', theme=my_theme)

    # add views for User, Departments, and Exhibits models to the admin interface
    admin.add_view(UserView(User, db.session))
    admin.add_view(ModelView(Departments, db.session))
    admin.add_view(ModelView(Exhibits, db.session))