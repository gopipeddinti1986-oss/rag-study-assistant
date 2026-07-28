import json
import re
from app.services.vector_store import get_all_chunks
from app.services.llm import ask_llm


def generate_mindmap(user_email: str, topic: str = None) -> dict:
    """
    Generate a hierarchical mind map structure from uploaded documents.
    """
    chunks = get_all_chunks(user_email)

    if not chunks:
        return {
            "title": topic or "Study Mind Map",
            "children": [
                {
                    "title": "No Documents Found",
                    "details": "Upload a PDF, DOCX, or TXT file to generate a full concept mind map."
                }
            ]
        }

    # Take first few chunks or search for specific topic
    context = "\n\n".join(chunks[:8])

    prompt = f"""
You are a study assistant and visual learning expert.

Generate a detailed, hierarchical mind map JSON structure for the study material below.
{f"Focus on the topic: {topic}" if topic else "Cover the main chapters and concepts."}

Return ONLY valid JSON matching this exact format:
{{
  "title": "Central Subject",
  "children": [
    {{
      "title": "Main Chapter / Category 1",
      "children": [
        {{
          "title": "Subtopic A",
          "details": "Brief 1-line definition or note",
          "children": []
        }},
        {{
          "title": "Subtopic B",
          "details": "Brief 1-line definition or note",
          "children": []
        }}
      ]
    }},
    {{
      "title": "Main Chapter / Category 2",
      "children": [
        {{
          "title": "Subtopic C",
          "details": "Brief key detail",
          "children": []
        }}
      ]
    }}
  ]
}}

STUDY MATERIAL:
{context}
"""

    try:
        response = ask_llm(prompt)
        start = response.find("{")
        end = response.rfind("}") + 1
        if start != -1 and end != 0:
            return json.loads(response[start:end])
    except Exception as e:
        print("Mindmap LLM generation error:", e)

    # Fallback default mindmap
    return {
        "title": topic or "Document Summary",
        "children": [
            {
                "title": "Core Concepts",
                "children": [
                    {"title": "Key Definitions", "details": "Extracted from uploaded materials"},
                    {"title": "Main Procedures", "details": "Foundational study guide principles"}
                ]
            },
            {
                "title": "Applications & Examples",
                "children": [
                    {"title": "Practical Use Cases", "details": "Real world applications"}
                ]
            }
        ]
    }
