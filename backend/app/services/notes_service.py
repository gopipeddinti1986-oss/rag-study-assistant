import time

from app.services.vector_store import get_all_chunks
from app.services.llm import ask_llm


def generate_notes(user_email):

    chunks = get_all_chunks(user_email)

    if not chunks:
        return "No document uploaded."

    notes = []

    batch_size = 5

    for i in range(0, len(chunks), batch_size):

        batch = chunks[i:i + batch_size]

        context = "\n\n".join(batch)

        prompt = f"""
You are an expert study assistant.

Read the document below and create clean study notes.

Rules:
- Use only the given document.
- Use headings.
- Use bullet points.
- Keep explanations simple.
- Highlight important terms.
- Do not invent information.
- Return notes in Markdown format.

DOCUMENT:

{context}
"""

        try:
            response = ask_llm(prompt)

            notes.append(response)

            # Avoid Groq rate limit
            time.sleep(2)

        except Exception as e:
            print(e)

    return "\n\n".join(notes)