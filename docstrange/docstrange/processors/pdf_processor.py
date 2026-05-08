"""PDF file processor with OCR support for scanned PDFs."""

import os
import logging
import tempfile
from typing import Dict, Any, List, Tuple

from docstrange.processors.base import BaseProcessor
from .image_processor import ImageProcessor
from ..result import ConversionResult
from ..exceptions import ConversionError, FileNotFoundError
from ..config import InternalConfig
from ..pipeline.ocr_service import OCRServiceFactory, NeuralOCRService

# Configure logging
logger = logging.getLogger(__name__)


class PDFProcessor(BaseProcessor):
    """Processor for PDF files using fast text extraction + OCR fallback."""

    def __init__(
        self,
        preserve_layout: bool = True,
        include_images: bool = False,
        ocr_enabled: bool = True,
        use_markdownify: bool = None,
    ):
        super().__init__(preserve_layout, include_images, ocr_enabled, use_markdownify)

        # Shared OCR service
        shared_ocr_service = NeuralOCRService()

        self._image_processor = ImageProcessor(
            preserve_layout=preserve_layout,
            include_images=include_images,
            ocr_enabled=ocr_enabled,
            use_markdownify=use_markdownify,
            ocr_service=shared_ocr_service,
        )

    def can_process(self, file_path: str) -> bool:
        if not os.path.exists(file_path):
            return False

        _, ext = os.path.splitext(str(file_path).lower())
        return ext == ".pdf"

    def process(self, file_path: str) -> ConversionResult:
        """Process PDF using FAST text extraction first, then OCR fallback."""

        try:
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"PDF file not found: {file_path}")

            logger.info(f"Processing PDF file: {file_path}")

            # ==============================
            # 🚀 STEP 1: FAST TEXT EXTRACTION (pdfminer)
            # ==============================
            try:
                from pdfminer.high_level import extract_text

                text = extract_text(file_path)

                if text and text.strip():
                    logger.info("✅ Using FAST pdfminer extraction")

                    return ConversionResult(
                        content=text,
                        metadata={
                            "file_path": file_path,
                            "file_type": "pdf",
                            "method": "direct_text_pdfminer",
                        },
                    )

            except Exception as e:
                logger.warning(f"⚠️ pdfminer failed, falling back to OCR: {e}")

            # ==============================
            # 🐢 STEP 2: OCR FALLBACK
            # ==============================
            logger.info("⚠️ Using OCR fallback")
            return self._process_with_ocr(file_path)

        except Exception as e:
            logger.error(f"Failed to process PDF file {file_path}: {e}")
            raise ConversionError(f"PDF processing failed: {e}")

    def _process_with_ocr(self, file_path: str) -> ConversionResult:
        """Process PDF using OCR after converting pages to images."""
        try:
            from pdf2image import convert_from_path

            dpi = getattr(InternalConfig, "pdf_image_dpi", 200)  # reduced DPI for speed

            images = convert_from_path(file_path, dpi=dpi)
            page_count = len(images)

            all_content = []

            for page_num, image in enumerate(images):
                with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
                    image.save(tmp.name, "PNG")
                    temp_image_path = tmp.name

                try:
                    page_result = self._image_processor.process(temp_image_path)
                    page_content = page_result.content

                    if page_content.strip():
                        all_content.append(
                            f"## Page {page_num + 1}\n\n{page_content}"
                        )

                finally:
                    os.unlink(temp_image_path)

            content = (
                "\n\n".join(all_content)
                if all_content
                else "No content extracted from PDF"
            )

            return ConversionResult(
                content=content,
                metadata={
                    "file_path": file_path,
                    "file_type": "pdf",
                    "pages": page_count,
                    "method": "ocr",
                },
            )

        except ImportError:
            logger.error("pdf2image not installed")
            raise ConversionError("pdf2image is required for OCR processing")

        except Exception as e:
            logger.error(f"OCR processing failed: {e}")
            raise ConversionError(f"OCR-based PDF processing failed: {e}")