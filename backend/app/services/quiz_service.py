import json
import re

from app.services.retriever import retrieve
from app.services.llm import ask_llm


def generate_quiz(
    user_email: str,
    difficulty: str,
    count: int
):

    docs = retrieve(
        query="Generate quiz",
        user_email=user_email,
        k=15
    )

    context = "\n\n".join(
        [doc["text"] for doc in docs]
    )

    prompt = f"""
You are an expert teacher.

Using ONLY the study material below, generate {count} multiple-choice questions.

Difficulty: {difficulty}

Return ONLY valid JSON.

Format:

[
  {{
    "question":"...",
    "options":[
      "...",
      "...",
      "...",
      "..."
    ],
    "answer":"...",
    "explanation":"..."
  }}
]

Study Material:

{context}
"""

    response = ask_llm(prompt)

    response = re.sub(
        r"```json|```",
        "",
        response
    ).strip()

    return json.loads(response)