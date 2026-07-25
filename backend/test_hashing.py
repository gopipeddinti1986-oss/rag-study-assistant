from app.auth.hashing import hash_password, verify_password

password = "Password123"

hashed = hash_password(password)

print("Original Password:", password)
print("Hashed Password:", hashed)

print("Correct Password:",
      verify_password(password, hashed))

print("Wrong Password:",
      verify_password("WrongPassword", hashed))
