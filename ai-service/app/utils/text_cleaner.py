import re

def clean_text(text):
    if not text:
        return ""
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def truncate_text(text, limit=2000):
    return text[:limit]
