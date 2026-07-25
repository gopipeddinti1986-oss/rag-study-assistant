import fitz
import pytesseract

from pdf2image import convert_from_path

# Tell pytesseract where Tesseract is installed
pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

# Poppler bin folder
POPPLER_PATH = r"C:\poppler\poppler-26.02.0\Library\bin"


def extract_text(pdf_path: str) -> str:
    """
    Extract text from a PDF.

    If the PDF already contains selectable text,
    return that text.

    Otherwise run OCR using Tesseract.
    """

    try:
        doc = fitz.open(pdf_path)

        text = ""

        for page in doc:
            text += page.get_text()

        doc.close()

        # Normal PDF
        if text.strip():
            print("✅ Normal PDF detected")
            return text

        print("🔍 Scanned PDF detected. Running OCR...")

        images = convert_from_path(
            pdf_path,
            poppler_path=POPPLER_PATH
        )

        ocr_text = ""

        for index, image in enumerate(images, start=1):
            print(f"📄 OCR Processing Page {index}")

            try:
                page_text = pytesseract.image_to_string(
                    image,
                    lang="eng"
                )

                ocr_text += page_text + "\n"

            except Exception as e:
                print(f"❌ OCR Error on page {index}: {e}")

        print("✅ OCR Completed Successfully")

        return ocr_text

    except Exception as e:
        print(f"❌ OCR Service Error: {e}")
        return ""