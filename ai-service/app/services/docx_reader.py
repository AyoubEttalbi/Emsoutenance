from docx import Document

class DocxReaderService:
    def extract_text(self, docx_file):
        try:
            document = Document(docx_file)
            text = ""
            for paragraph in document.paragraphs:
                if paragraph.text:
                    text += paragraph.text + "\n"
            return text
        except Exception as e:
            print(f"Error reading DOCX: {e}")
            return ""
