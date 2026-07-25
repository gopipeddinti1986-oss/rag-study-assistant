from app.auth.jwt import (
    create_access_token,
    verify_access_token
)

token = create_access_token(
    {"sub": "gopi@gmail.com"}
)

print("Token:")
print(token)

print("\nDecoded Payload:")
print(verify_access_token(token))