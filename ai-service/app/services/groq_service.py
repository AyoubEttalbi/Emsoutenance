from groq import Groq
import os
import json

class GroqService:
    def __init__(self, api_key):
        print(f"DEBUG: Initializing GroqService")
        self.client = Groq(api_key=api_key)
        
        # Load prompt template
        prompt_path = os.path.join(os.path.dirname(__file__), '..', 'prompts', 'feedback.txt')
        with open(prompt_path, 'r', encoding='utf-8') as f:
            self.template = f.read()
        
        print(f"DEBUG: Loaded Prompt Template")
    
    def generate_feedback(self, text):
        print(f"DEBUG: Generating feedback for text of length {len(text)}")
        
        # Truncate text if too long
        max_length = 6000
        if len(text) > max_length:
            text = text[:max_length] + "..."
        
        prompt = self.template.format(text=text)
        
        try:
            completion = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,  # Lower for more consistent JSON
                max_tokens=2048,
                top_p=1,
                stream=False
            )
            
            response = completion.choices[0].message.content
            print(f"DEBUG: Generated {len(response)} characters of feedback")
            
            # Try to parse JSON response
            try:
                # Find JSON in response (in case there's extra text)
                start = response.find('{')
                end = response.rfind('}') + 1
                if start != -1 and end > start:
                    json_str = response[start:end]
                    parsed = json.loads(json_str)
                    return json.dumps(parsed, ensure_ascii=False)
                else:
                    return response
            except json.JSONDecodeError:
                print("DEBUG: Could not parse JSON, returning raw response")
                return response
            
        except Exception as e:
            print(f"ERROR: Groq API failed: {e}")
            return json.dumps({
                "error": str(e),
                "note_globale": 0,
                "niveau": "E",
                "resume_executif": "Erreur lors de l'analyse du rapport.",
                "points_forts": [],
                "points_ameliorer": [],
                "sections_analysis": {},
                "conseils_prioritaires": ["Veuillez réessayer plus tard."]
            }, ensure_ascii=False)
