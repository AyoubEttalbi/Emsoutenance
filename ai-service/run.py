from app.main import create_app
from app.config import Config

app = create_app()

if __name__ == '__main__':
    print(f"DEBUG: Starting Flask with LANGUAGE={Config.LANGUAGE}")
    app.run(
        host='0.0.0.0', 
        port=Config.PORT, 
        debug=Config.DEBUG,
        use_reloader=False
    )
