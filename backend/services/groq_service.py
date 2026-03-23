import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Initialize Groq client
# This expects GROQ_API_KEY to be present in the .env file
try:
    groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    GROQ_MODEL = os.getenv("GROQ_MODEL", "llama3-70b-8192")
except Exception as e:
    print(f"Warning: Groq API client initialization failed. Please check your GROQ_API_KEY in .env")
    print(f"Details: {e}")
    groq_client = None
    GROQ_MODEL = "llama3-70b-8192"

def generate_fast_response(prompt: str, system_message: str = "You are an intelligent matching assistant for NGOs.") -> str:
    """
    Generate a lightning-fast response using Groq AI (Llama 3 / Mixtral).
    This function is best used for fast classifications, JSON formatting, or chat interactions.
    """
    if not groq_client:
        return "Error: Groq API Key missing. Please check .env file."
        
    try:
        completion = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2, # Low temperature for more deterministic/factual output
            max_tokens=1024,
            top_p=1,
            stream=False,
        )
        return completion.choices[0].message.content
        
    except Exception as e:
        print(f"Groq API Error: {e}")
        return f"Error analyzing data with Groq: {str(e)}"
