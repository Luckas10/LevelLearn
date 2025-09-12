# main.py
from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine

# importe das suas classes de model (arquivo models.py)
from models import User, Achievement, Friendship, ShopItem, Deck, Card  # noqa: F401

DATABASE_URL = "sqlite:///./levellearn.db"
engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})

app = FastAPI(title="LevelLearn API")

def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
async def root():
    return {"message": "LevelLearn API iniciada com sucesso!"}
