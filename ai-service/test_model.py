import os
os.environ['HF_HOME'] = r'D:\work2\EmsiProject\Emsoutenance\ai-service\.cache'

from transformers import T5ForConditionalGeneration, T5Tokenizer
import torch

print("Loading flan-t5-xl model...")
tokenizer = T5Tokenizer.from_pretrained("google/flan-t5-xl")
model = T5ForConditionalGeneration.from_pretrained("google/flan-t5-xl")

# Test with a sample French internship report text
sample_text = """
Introduction
Ce rapport présente mon stage de 2 mois effectué au sein de l'entreprise TechCorp.

Présentation de l'entreprise
TechCorp est une société spécialisée dans le développement web fondée en 2010.

Missions réalisées
Durant mon stage, j'ai participé au développement d'une application web en utilisant React et Node.js.
"""

prompt = f"""Vous êtes un expert en évaluation de rapports de stage. Analysez ce rapport et donnez:
1. Les points forts du rapport
2. Les points faibles à améliorer
3. Les sections manquantes (Introduction, Présentation entreprise, Missions, Outils, Difficultés, Conclusion)
4. Des suggestions concrètes d'amélioration

Rapport:
{sample_text}

Analyse détaillée:"""

print("\n" + "="*80)
print("PROMPT SENT TO MODEL:")
print("="*80)
print(prompt[:300] + "...")

print("\n" + "="*80)
print("GENERATING RESPONSE...")
print("="*80)

inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=1024)

with torch.no_grad():
    outputs = model.generate(
        **inputs, 
        max_new_tokens=1024,
        num_beams=4,
        early_stopping=True,
        temperature=0.7
    )

response = tokenizer.decode(outputs[0], skip_special_tokens=True)

print("\n" + "="*80)
print("MODEL OUTPUT:")
print("="*80)
print(response)
print("="*80)

print("\n" + "="*80)
print("ANALYSIS:")
print("="*80)
if len(response) < 50:
    print("❌ FAILED: Output too short, model is just echoing structure")
elif "1." not in response or "2." not in response:
    print("❌ FAILED: Model not generating structured content")
elif response.count(".") < 5:
    print("❌ FAILED: Output lacks substance")
else:
    print("✓ SUCCESS: Model generated meaningful content")
