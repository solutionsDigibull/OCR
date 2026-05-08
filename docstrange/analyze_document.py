import base64
import io
import json
import os
from datetime import datetime

import anthropic
import pandas as pd
import pytesseract
from pdf2image import convert_from_path

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
POPPLER_PATH = r"C:\poppler\Library\bin"
PDF_PATH = "Sample Drawing (1).pdf"
OUTPUT_DIR = "output"

# To process multiple files, set INPUT_DIR to the folder containing PDFs.
# If set, all PDFs in INPUT_DIR are processed and PDF_PATH is ignored.
INPUT_DIR = None

EXTRACT_PROMPT = """You are a document data extraction expert. Analyze this page from a technical drawing or document.

Extract ALL visible data and return ONLY a valid JSON object (no markdown, no explanation) with exactly these keys:

{
  "key_value_pairs": {
    "Field Name": "Value"
  },
  "tables": [
    {
      "title": "Table Title or description",
      "headers": ["Column1", "Column2"],
      "rows": [["val1", "val2"]]
    }
  ],
  "notes": ["note or annotation text"]
}

Rules:
- key_value_pairs: every label/value pair you see (title block, drawing info, revision, date, author, scale, etc.)
- tables: every grid or tabular structure (parts list, BOM, revision history, dimensions table, etc.)
- notes: every free-text note, warning, specification, or annotation
- Capture EVERYTHING visible — do not skip any data
- If a section is empty, use an empty dict/list
- Return ONLY the JSON, nothing else
"""


def image_to_base64(pil_image: object) -> str:
    MAX_BYTES = 4 * 1024 * 1024  # 4 MB safety margin
    for quality_scale in [1.0, 0.75, 0.5, 0.35]:
        img = pil_image
        if quality_scale < 1.0:
            w, h = pil_image.size
            img = pil_image.resize((int(w * quality_scale), int(h * quality_scale)))
        buf = io.BytesIO()
        img.save(buf, format="PNG", optimize=True)
        data = buf.getvalue()
        if len(data) <= MAX_BYTES:
            return base64.standard_b64encode(data).decode("utf-8")
    raise ValueError("Image too large to compress under 4MB even at 35% scale.")


def extract_page_data(client: anthropic.Anthropic, page_image: object, page_num: int) -> dict:
    print(f"  Analyzing page {page_num}...")
    b64 = image_to_base64(page_image)
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4096,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/png",
                            "data": b64,
                        },
                    },
                    {"type": "text", "text": EXTRACT_PROMPT},
                ],
            }
        ],
    )
    raw = message.content[0].text.strip()
    # Strip markdown code fences if present
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        print(f"  Warning: Could not parse JSON for page {page_num}, using raw text as note.")
        return {"key_value_pairs": {}, "tables": [], "notes": [raw]}


def merge_results(pages: list[dict]) -> dict:
    merged = {"key_value_pairs": {}, "tables": [], "notes": []}
    for i, page in enumerate(pages, 1):
        prefix = f"[Page {i}] " if len(pages) > 1 else ""
        for k, v in page.get("key_value_pairs", {}).items():
            key = f"{prefix}{k}" if len(pages) > 1 else k
            merged["key_value_pairs"][key] = v
        for table in page.get("tables", []):
            if len(pages) > 1:
                table = dict(table)
                table["title"] = f"[Page {i}] {table.get('title', 'Table')}"
            merged["tables"].append(table)
        for note in page.get("notes", []):
            merged["notes"].append(f"{prefix}{note}" if len(pages) > 1 else note)
    return merged


def write_markdown(data: dict, filepath: str, source_filename: str) -> None:
    today = datetime.now().strftime("%Y-%m-%d")
    lines = [
        f"# Extracted Data: {source_filename}",
        f"",
        f"**Source:** {source_filename}  ",
        f"**Extracted:** {today}",
        f"",
    ]

    if data["key_value_pairs"]:
        lines += ["## Document Fields", "", "| Field | Value |", "| --- | --- |"]
        for k, v in data["key_value_pairs"].items():
            k_safe = str(k).replace("|", "\\|")
            v_safe = str(v).replace("|", "\\|")
            lines.append(f"| {k_safe} | {v_safe} |")
        lines.append("")

    for table in data["tables"]:
        title = table.get("title", "Table")
        headers = table.get("headers", [])
        rows = table.get("rows", [])
        lines += [f"## {title}", ""]
        if headers:
            lines.append("| " + " | ".join(str(h) for h in headers) + " |")
            lines.append("| " + " | ".join("---" for _ in headers) + " |")
            for row in rows:
                safe_row = [str(c).replace("|", "\\|") for c in row]
                lines.append("| " + " | ".join(safe_row) + " |")
        lines.append("")

    if data["notes"]:
        lines += ["## Notes & Annotations", ""]
        for note in data["notes"]:
            lines.append(f"- {note}")
        lines.append("")

    with open(filepath, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


def write_csv(data: dict, filepath: str) -> None:
    records = []

    for k, v in data["key_value_pairs"].items():
        records.append({"Section": "Document Fields", "Field": k, "Value": str(v)})

    for table in data["tables"]:
        title = table.get("title", "Table")
        headers = table.get("headers", [])
        rows = table.get("rows", [])
        for row in rows:
            row_dict = {"Section": title, "Field": "", "Value": ""}
            for i, val in enumerate(row):
                col_name = headers[i] if i < len(headers) else f"Column {i+1}"
                row_dict[f"Col_{col_name}"] = str(val)
            records.append(row_dict)

    for note in data["notes"]:
        records.append({"Section": "Notes & Annotations", "Field": "Note", "Value": note})

    df = pd.DataFrame(records)
    df.to_csv(filepath, index=False, encoding="utf-8-sig")


def process_pdf(client: anthropic.Anthropic, pdf_path: str) -> None:
    if not os.path.exists(pdf_path):
        print(f"Error: '{pdf_path}' not found.")
        return

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print(f"\nConverting '{pdf_path}' to images...")
    pages = convert_from_path(pdf_path, dpi=300, poppler_path=POPPLER_PATH)
    print(f"  {len(pages)} page(s) found.")

    page_results = []
    for i, page_img in enumerate(pages, 1):
        result = extract_page_data(client, page_img, i)
        page_results.append(result)

    print("  Merging results...")
    data = merge_results(page_results)

    base_name = os.path.splitext(os.path.basename(pdf_path))[0]
    md_path = os.path.join(OUTPUT_DIR, f"{base_name}output.md")
    csv_path = os.path.join(OUTPUT_DIR, f"{base_name}output.csv")

    write_markdown(data, md_path, pdf_path)
    write_csv(data, csv_path)

    print(f"  Markdown : {os.path.abspath(md_path)}")
    print(f"  CSV      : {os.path.abspath(csv_path)}")
    print(f"  Fields: {len(data['key_value_pairs'])}  Tables: {len(data['tables'])}  Notes: {len(data['notes'])}")


def main():
    client = anthropic.Anthropic()

    if INPUT_DIR:
        pdf_files = sorted(
            os.path.join(INPUT_DIR, f)
            for f in os.listdir(INPUT_DIR)
            if f.lower().endswith(".pdf")
        )
        if not pdf_files:
            print(f"No PDF files found in '{INPUT_DIR}'.")
            return
        print(f"Found {len(pdf_files)} PDF(s) in '{INPUT_DIR}':")
        for p in pdf_files:
            print(f"  {os.path.basename(p)}")
        for pdf_path in pdf_files:
            process_pdf(client, pdf_path)
    else:
        process_pdf(client, PDF_PATH)

    print("\nAll done!")


if __name__ == "__main__":
    main()
