from app.services.llm import ask_llm

question = """
What is software engineering?
Answer in 3 sentences.
"""

answer = ask_llm(question)

print("\nAI Response:\n")
print(answer)