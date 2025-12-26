from pypdf import PdfReader

class PDFReaderService:
    def extract_text(self, pdf_file):
        try:
            reader = PdfReader(pdf_file)
            text = ""
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
            return text
        except Exception as e:
            print(f"Error reading PDF: {e}")
            return ""
