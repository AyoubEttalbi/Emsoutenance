from flask import Blueprint, request, jsonify
from app.services.groq_service import GroqService
from app.services.grammar import GrammarService
from app.utils.text_cleaner import clean_text, truncate_text
from app.config import Config

from app.services.pdf_reader import PDFReaderService
from app.services.docx_reader import DocxReaderService

analyze_bp = Blueprint('analyze', __name__)

# Initialize services
print(f"DEBUG: analyze.py initializing services...")
ai_service = GroqService(Config.GROQ_API_KEY)
grammar_service = GrammarService(Config.LANGUAGE)
print(f"DEBUG: Services initialized. Grammar Lang: {Config.LANGUAGE}")
pdf_service = PDFReaderService()
docx_service = DocxReaderService()

@analyze_bp.route('/analyze', methods=['POST'])
def analyze():
    # Support both JSON and multipart/form-data
    raw_text = None
    
    if request.is_json:
        data = request.get_json()
        raw_text = data.get('text')
    elif 'file' in request.files:
        uploaded_file = request.files['file']
        filename = uploaded_file.filename.lower()
        
        if filename.endswith('.docx'):
            raw_text = docx_service.extract_text(uploaded_file)
        else:
            # Default to PDF
            raw_text = pdf_service.extract_text(uploaded_file)
    
    if not raw_text:
        return jsonify({"error": "Missing text or file in request"}), 400

    cleaned_text = clean_text(raw_text)
    truncated_text = truncate_text(cleaned_text, limit=Config.MAX_TOKENS * 4) # Adjust based on model capability

    # Run Grammar Check
    issue_count, samples = grammar_service.check_grammar(truncated_text)

    # Run AI Feedback
    ai_feedback = ai_service.generate_feedback(truncated_text)

    return jsonify({
        "grammar_issues_count": issue_count,
        "grammar_samples": samples,
        "ai_feedback": ai_feedback
    }), 200
