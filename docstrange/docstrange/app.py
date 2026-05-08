from fastapi import FastAPI
from pydantic import BaseModel
import requests
import re
import json

# 👉 your new universal router
from docstrange.docstrange.processors.universal_processor import UniversalProcessor

app = FastAPI()


# --- Request schema ---
class FileRequest(BaseModel):
    file_path: str


# --- Helper: send text to Ollama ---
def extract_with_ollama(text: str):
    try:
        short_text = "\n".join(text.split("\n")[:40])  # limit size

        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3",
                "prompt": f"""
Extract structured data from the following text.

Return ONLY valid JSON:
{{
  "title": "",
  "part_number": "",
  "components": []
}}

TEXT:
{short_text}
""",
                "stream": False
            },
            timeout=180
        )

        result = response.json()
        output_text = result.get("response", "").strip()

        print("📥 Ollama Raw Output:", output_text)

        match = re.search(r"\{.*\}", output_text, re.DOTALL)

        if match:
            try:
                return json.loads(match.group())
            except:
                return {"raw": output_text}
        else:
            return {"raw": output_text}

    except Exception as e:
        return {"error": str(e)}


# --- MAIN API ---
@app.post("/process")
def process(input: FileRequest):
    try:
        processor = UniversalProcessor()

        # 🔥 This handles PDF + images automatically
        result = processor.process(input.file_path)

        extracted_text = result.content

        # 🔥 Send to Ollama (optional but recommended)
        structured_data = extract_with_ollama(extracted_text)

        return {
            "status": "success",
            "file": input.file_path,
            "metadata": result.metadata,
            "extracted_text": extracted_text[:1000],  # limit output
            "structured_data": structured_data
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }