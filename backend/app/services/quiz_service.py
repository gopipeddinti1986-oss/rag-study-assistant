"""
Sprint 7 — Updated quiz_service.py
Added topic-based retrieval so quiz questions are about a specific topic.
Backward compatible: existing /quiz/ route still works unchanged.
"""

import json
import re

from app.services.retriever import retrieve
from app.services.llm import ask_llm


def generate_quiz(
    user_email: str,
    difficulty: str,
    count: int,
    topic: str = "Generate quiz questions",     # Sprint 7: optional topic
):
    docs = retrieve(
        query=topic,
        user_email=user_email,
        k=15,
    )

    context = "\n\n".join([doc["text"] for doc in docs])

    prompt = f"""
You are an expert teacher.

Using ONLY the study material below, generate {count} multiple-choice questions.

Difficulty: {difficulty}
{f"Topic focus: {topic}" if topic != "Generate quiz questions" else ""}

Return ONLY valid JSON. No explanation outside the JSON.

Format:

[
  {{
    "question":"...",
    "options":[
      "A. ...",
      "B. ...",
      "C. ...",
      "D. ..."
    ],
    "answer":"A. ...",
    "explanation":"..."
  }}
]

Study Material:

{context}
"""

    response = ask_llm(prompt)

    response = re.sub(r"```json|```", "", response).strip()

    return json.loads(response)
