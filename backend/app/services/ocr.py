import os
import fitz
import pytesseract

# Tesseract installation
pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

POPPLER_PATH = r"C:\poppler\poppler-26.02.0\Library\bin"


def extract_text(file_path: str) -> str:
    """
    Extract text page by page from PDF, DOCX, or TXT files.
    Uses normal text extraction first.
    Falls back to OCR only for scanned image PDF pages.
    """
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".txt":
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()
        except Exception as e:
            print(f"Error reading TXT file: {e}")
            return ""

    if ext == ".docx":
        try:
            import zipfile
            from xml.etree import ElementTree as ET
            
            with zipfile.ZipFile(file_path) as z:
                xml_content = z.read("word/document.xml")
                tree = ET.fromstring(xml_content)
                text_elements = tree.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t")
                return "\n".join([elem.text for elem in text_elements if elem.text])
        except Exception as e:
            print(f"Error reading DOCX file: {e}")
            return ""

    # PDF Processing
    try:
        doc = fitz.open(file_path)
    except Exception as e:
        print(f"Error opening PDF: {e}")
        return ""

    final_text = ""
    images = None

    for page_number in range(len(doc)):
        page = doc[page_number]
        page_text = page.get_text().strip()

        if page_text:
            print(f"✅ Page {page_number + 1}: Text extracted")
            final_text += page_text + "\n"
        else:
            print(f"🔍 Page {page_number + 1}: OCR Fallback")
            try:
                if images is None:
                    from pdf2image import convert_from_path
                    images = convert_from_path(file_path, poppler_path=POPPLER_PATH)
                
                if images and page_number < len(images):
                    image = images[page_number]
                    ocr_text = pytesseract.image_to_string(image, lang="eng")
                    final_text += ocr_text + "\n"
            except Exception as e:
                print(f"❌ OCR Error Page {page_number + 1}: {e}")

    doc.close()
    return final_text