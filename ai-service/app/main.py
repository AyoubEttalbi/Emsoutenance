from flask import Flask
from flask_cors import CORS
from app.routes.analyze import analyze_bp
from app.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(analyze_bp, url_prefix='/api')
    
    @app.route('/health')
    def health():
        return {"status": "up"}, 200
        
    return app
