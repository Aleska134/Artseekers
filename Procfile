release: PYTHONPATH=src FLASK_APP=src/app.py flask db upgrade
web: gunicorn wsgi:application
