from app.services.retriever import retrieve

query = "What is software engineering?"

results = retrieve(query)

print("\nTop Results:\n")

for i, chunk in enumerate(results, start=1):
    print(f"\nResult {i}")
    print("-" * 40)
    print(chunk)