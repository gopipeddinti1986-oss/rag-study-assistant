from app.database.database import engine, Base

# Import all models
from app.database.models import User, ChatHistory

# Create all tables
Base.metadata.create_all(bind=engine)

print("✅ Database created successfully!")