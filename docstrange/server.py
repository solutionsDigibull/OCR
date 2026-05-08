from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from app import process_document

app = FastAPI()

# ✅ Single file request
class FileRequest(BaseModel):
    file_path: str

# ✅ Batch request
class BatchRequest(BaseModel):
    file_paths: List[str]


@app.get("/")
def home():
    return {"message": "OCR API running 🚀"}


# ✅ Single file endpoint
@app.post("/process")
def process(req: FileRequest):
    return process_document(req.file_path)


# ✅ Multiple file endpoint
@app.post("/process-batch")
def process_multiple_files(request: BatchRequest):
    results = []

    for file_path in request.file_paths:
        print("\n📄 Processing:", file_path)

        try:
            result = process_document(file_path)
            results.append({
                "file": file_path,
                "status": "success",
                "data": result
            })
        except Exception as e:
            results.append({
                "file": file_path,
                "status": "error",
                "message": str(e)
            })

    return {
        "total_files": len(request.file_paths),
        "results": results
    }