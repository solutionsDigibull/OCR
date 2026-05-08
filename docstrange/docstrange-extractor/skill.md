---
name: docstrange-extractor
description: Extract tables and structured text from uploaded documents using OCR API
---

# Docstrange Extractor Skill

## What this skill does
This skill sends uploaded documents (PDF, PNG, JPG, screenshots) to an OCR API and extracts:
- Tables (Part No, Name, Material, Qty)
- Structured text

## API Configuration
Endpoint: https://overthrow-disposal-hardy.ngrok-free.dev/process-upload
Method: POST
Content-Type: multipart/form-data
Field name: files

## Output format
Return JSON response from the API.
