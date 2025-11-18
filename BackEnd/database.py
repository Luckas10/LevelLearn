from sqlmodel import SQLModel, Session, create_engine
from contextlib import asynccontextmanager
from typing import Annotated
from fastapi import Depends

url = "sqlite:///banco.db"
args = {"check_same_thread": False}
engine = create_engine(url, connect_args=args)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

def get_create_db():
    SQLModel.metadata.create_all(engine)

@asynccontextmanager
async def lifespan(app):
    get_create_db()
    yield


