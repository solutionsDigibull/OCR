import os
from docstrange.processors.pdf_processor import PDFProcessor
from docstrange.processors.image_processor import ImageProcessor


class UniversalProcessor:
    def __init__(self):
        self.pdf_processor = PDFProcessor()
        self.image_processor = ImageProcessor()

    def process(self, file_path: str):
        if not os.path.exists(file_path):
            raise ConversionError(f"File not found: {file_path}")

        ext = os.path.splitext(file_path)[1].lower()

        if ext == ".pdf":
            return self.pdf_processor.process(file_path)

        elif ext in [".png", ".jpg", ".jpeg", ".bmp", ".tiff", ".tif", ".webp"]:
            return self.image_processor.process(file_path)

        else:
            raise ConversionError(f"Unsupported file type: {ext}")