import fitz
import pytesseract

from pdf2image import convert_from_path

# Tesseract installation
pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

POPPLER_PATH = r"C:\poppler\poppler-26.02.0\Library\bin"


def extract_text(pdf_path: str) -> str:
    """
    Extract text page by page.

    Uses normal extraction if possible.
    Falls back to OCR only for scanned pages.
    """

    doc = fitz.open(pdf_path)

    images = convert_from_path(
        pdf_path,
        poppler_path=POPPLER_PATH
    )

    final_text = ""

    for page_number in range(len(doc)):

        page = doc[page_number]

        page_text = page.get_text().strip()

        if page_text:

            print(f"✅ Page {page_number + 1}: Text extracted")

            final_text += page_text + "\n"

        else:

            print(f"🔍 Page {page_number + 1}: OCR")

            image = images[page_number]

            try:

                ocr_text = pytesseract.image_to_string(
                    image,
                    lang="eng"
                )

                final_text += ocr_text + "\n"

            except Exception as e:

                print(f"❌ OCR Error Page {page_number + 1}: {e}")

    doc.close()

    return final_text