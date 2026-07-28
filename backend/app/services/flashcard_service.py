import json
import time

from app.services.vector_store import get_all_chunks
from app.services.llm import ask_llm


def generate_batch(context, count):
    """
    Generate flashcards from a small batch of document text.
    """

    prompt = f"""
You are an expert study assistant.

Create {count} flashcards from the document below.

Rules:
1. Use ONLY the document.
2. Do NOT invent information.
3. Keep questions clear.
4. Keep answers short.
5. Return ONLY valid JSON.

Example:

[
  {{
    "question": "What is Deadlock?",
    "answer": "Processes wait indefinitely for resources."
  }},
  {{
    "question": "What is Paging?",
    "answer": "A memory management technique."
  }}
]

DOCUMENT:

{context}
"""

    response = ask_llm(prompt)

    try:
        start = response.find("[")
        end = response.rfind("]") + 1

        if start == -1 or end == 0:
            return []

        return json.loads(response[start:end])

    except Exception as e:
        print("JSON Parse Error:", e)
        return []


def generate_flashcards(question_count, user_email):
    """
    Generate flashcards from the uploaded PDF.
    """

    chunks = get_all_chunks(user_email)

    if not chunks:
        return []

    all_flashcards = []

    # Number of chunks sent to Groq in one request
    batch_size = 5

    # Flashcards generated per batch
    flashcards_per_batch = 5

    for i in range(0, len(chunks), batch_size):

        batch = chunks[i:i + batch_size]

        context = "\n\n".join(batch)

        try:
            flashcards = generate_batch(
                context,
                flashcards_per_batch
            )

            if flashcards:
                all_flashcards.extend(flashcards)

            # Avoid Groq TPM rate limit
            time.sleep(2)

        except Exception as e:
            print(f"Batch {i // batch_size + 1} failed:", e)

    # Remove duplicates
    unique_flashcards = []
    seen = set()

    for card in all_flashcards:

        key = (
            card.get("question", ""),
            card.get("answer", "")
        )

        if key not in seen:
            seen.add(key)
            unique_flashcards.append(card)

    return unique_flashcards[:question_count]