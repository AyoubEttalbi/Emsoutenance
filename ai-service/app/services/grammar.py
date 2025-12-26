import language_tool_python

class GrammarService:
    def __init__(self, lang='en-US'):
        print(f"DEBUG: Initializing GrammarService with lang='{lang}'")
        self.tool = language_tool_python.LanguageTool(lang)
        
        # Disable spelling-related rules to avoid false positives on proper nouns
        # Focus on grammar, punctuation, and style instead
        self.disabled_categories = [
            'TYPOS',  # Typos/spelling
            'SPELLING',  # Spelling errors
            'CASING',  # Capitalization issues
        ]

    def check_grammar(self, text):
        print(f"DEBUG: Grammar checking text (First 100 chars): {text[:100]}...")
        all_matches = self.tool.check(text)
        
        # Filter out spelling/typo errors - keep only grammar and style issues
        matches = [
            m for m in all_matches 
            if m.category not in self.disabled_categories 
            and 'spell' not in m.rule_id.lower()
            and 'typo' not in m.rule_id.lower()
        ]
        
        print(f"DEBUG: Found {len(all_matches)} total issues, {len(matches)} after filtering")
        
        # Return specific messages for grammar issues
        samples = []
        for match in matches[:10]:
            # Format: "Error message - Context"
            samples.append(f"{match.message}")
        
        return len(matches), samples
