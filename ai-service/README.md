# AI Analysis Service

This is a Flask-based service that provides AI analysis for internship reports.

## Features
- PDF and DOCX text extraction
- Grammar and style checking using LanguageTool
- Detailed feedback generation using Groq API (Llama 3.3 70B)
- Professional grading and section analysis

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. Run the service:
   ```bash
   python run.py
   ```

## API Endpoints

### POST /api/analyze
Analyzes a report (PDF or DOCX).
- **Body**: `file` (Multipart file)
- **Response**: JSON with grammar issues, AI feedback, and grading.
