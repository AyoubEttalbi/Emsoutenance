from transformers import T5ForConditionalGeneration, T5Tokenizer
import torch
import os

class FlanT5Service:
    def __init__(self, model_name="google/flan-t5-xl"):
        print(f"DEBUG: Initializing FlanT5Service with model: {model_name}")
        self.tokenizer = T5Tokenizer.from_pretrained(model_name)
        self.model = T5ForConditionalGeneration.from_pretrained(model_name)
        
        # Load prompt template fresh every time
        prompt_path = os.path.join(os.path.dirname(__file__), '..', 'prompts', 'feedback.txt')
        with open(prompt_path, 'r', encoding='utf-8') as f:
            self.template = f.read()
        
        print(f"DEBUG: Loaded Prompt Template (First 100 chars): {self.template[:100]}")

    def generate_feedback(self, text):
        print(f"DEBUG: Generating feedback for text of length {len(text)}")
        prompt = self.template.format(text=text)
        print(f"DEBUG: Prompt preview: {prompt[:200]}...")
        
        inputs = self.tokenizer(prompt, return_tensors="pt", truncation=True, max_length=1024)
        
        with torch.no_grad():
            outputs = self.model.generate(
                **inputs, 
                max_new_tokens=1024,
                num_beams=4,
                early_stopping=True
            )
            
        return self.tokenizer.decode(outputs[0], skip_special_tokens=True)
