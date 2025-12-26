from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

class Config:
    # Groq API Configuration
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    
    # General settings
    MAX_TOKENS = 1024
    LANGUAGE = 'fr-FR'
    DEBUG = True
    PORT = 5000
