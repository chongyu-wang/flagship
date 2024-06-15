from flask import Flask
import sqlite3

def create_app():
    app = Flask(__name__)
    app.secret_key = "secret"
    
    def initialize_database():
        with sqlite3.connect('clone.ly.db') as conn:
            cursor = conn.cursor()
            cursor.execute('''CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)''')
            conn.commit()
    
    initialize_database()

    with app.app_context():
        from .routes import main
        app.register_blueprint(main)

    return app


