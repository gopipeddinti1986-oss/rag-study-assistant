from app.database.database import SessionLocal
from app.database.models import User

db = SessionLocal()

users = db.query(User).all()

for user in users:
    print("----------------")
    print("ID:", user.id)
    print("Name:", user.name)
    print("Email:", user.email)
    print("Password Hash:", user.hashed_password)

db.close()