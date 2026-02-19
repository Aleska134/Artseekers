import os
from flask_admin import Admin
from flask_admin.theme import Bootstrap4Theme 
from .models import db, User, Exhibits, Departments
from flask_admin.contrib.sqla import ModelView

# Personalizamos la vista del usuario para mayor seguridad (Portafolio CS)
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
    
    # Inicializamos el Admin con tu nuevo nombre de proyecto
    admin = Admin(app, name='Artseekers Admin Panel', theme=my_theme)

    # Añadimos las vistas de tus modelos a la base de datos
    admin.add_view(UserView(User, db.session))
    admin.add_view(ModelView(Departments, db.session))
    admin.add_view(ModelView(Exhibits, db.session))