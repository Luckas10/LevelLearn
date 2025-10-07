from typing import List, Annotated
from sqlmodel import SQLModel, Session, create_engine, select
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from models import User, Achievement, Friendship, ShopItem, Deck, Card
from contextlib import asynccontextmanager

# ==============================
# Configuração do banco
# ==============================


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
async def lifespan(app: FastAPI):
    get_create_db()
    yield


# ==============================
# Configuração da documentação
# ==============================

tags_metadata = [
    {"name": "Usuários", "description": "Gerenciamento de contas, níveis, XP e moedas."},
    {"name": "Conquistas", "description": "CRUD de conquistas vinculadas aos usuários."},
    {"name": "Amizades", "description": "Gerenciamento de amigos entre usuários."},
    {"name": "Loja", "description": "Itens disponíveis para compra e associação ao usuário."},
    {"name": "Decks", "description": "Gerenciamento de baralhos (decks) dos usuários."},
    {"name": "Cartas", "description": "CRUD de cartas pertencentes aos decks."},
]

app = FastAPI(
    lifespan=lifespan,
    title="Flashcards API",
    description="API de gerenciamento de usuários, conquistas, amizades, loja e flashcards.",
    version="1.0.0",
    openapi_tags=tags_metadata
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# Usuários
# ==============================

@app.get("/users", tags=["Usuários"])
def listar_users(session: SessionDep) -> List[User]:
    return session.exec(select(User)).all()

@app.post("/users", tags=["Usuários"])
def cadastrar_user(session: SessionDep, user: User) -> User:
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@app.put("/users/{id}", tags=["Usuários"])
def atualizar_user(session: SessionDep, id: int, username: str) -> User:
    user = session.exec(select(User).where(User.id == id)).one()
    user.username = username
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@app.delete("/users/{id}", tags=["Usuários"])
def deletar_user(session: SessionDep, id: int) -> str:
    user = session.exec(select(User).where(User.id == id)).one()
    session.delete(user)
    session.commit()
    return "Usuário excluído com sucesso."


# ==============================
# Conquistas
# ==============================

@app.get("/achievements", tags=["Conquistas"])
def listar_achievements(session: SessionDep) -> List[Achievement]:
    return session.exec(select(Achievement)).all()

@app.post("/achievements", tags=["Conquistas"])
def cadastrar_achievement(session: SessionDep, achievement: Achievement) -> Achievement:
    session.add(achievement)
    session.commit()
    session.refresh(achievement)
    return achievement

@app.delete("/achievements/{id}", tags=["Conquistas"])
def deletar_achievement(session: SessionDep, id: int) -> str:
    ach = session.exec(select(Achievement).where(Achievement.id == id)).one()
    session.delete(ach)
    session.commit()
    return "Conquista excluída com sucesso."


# ==============================
# Amizades
# ==============================

@app.get("/friends", tags=["Amizades"])
def listar_amizades(session: SessionDep) -> List[Friendship]:
    return session.exec(select(Friendship)).all()

@app.post("/friends", tags=["Amizades"])
def adicionar_amizade(session: SessionDep, friendship: Friendship) -> Friendship:
    session.add(friendship)
    session.commit()
    session.refresh(friendship)
    return friendship

@app.delete("/friends/{id}", tags=["Amizades"])
def remover_amizade(session: SessionDep, id: int) -> str:
    friendship = session.exec(select(Friendship).where(Friendship.id == id)).one()
    session.delete(friendship)
    session.commit()
    return "Amizade removida com sucesso."


# ==============================
# Itens da Loja
# ==============================

@app.get("/shop", tags=["Loja"])
def listar_itens(session: SessionDep) -> List[ShopItem]:
    return session.exec(select(ShopItem)).all()

@app.post("/shop", tags=["Loja"])
def cadastrar_item(session: SessionDep, item: ShopItem) -> ShopItem:
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

@app.delete("/shop/{id}", tags=["Loja"])
def deletar_item(session: SessionDep, id: int) -> str:
    item = session.exec(select(ShopItem).where(ShopItem.id == id)).one()
    session.delete(item)
    session.commit()
    return "Item excluído com sucesso."


# ==============================
# Decks
# ==============================

@app.get("/decks", tags=["Decks"])
def listar_decks(session: SessionDep) -> List[Deck]:
    return session.exec(select(Deck)).all()

@app.post("/decks", tags=["Decks"])
def cadastrar_deck(session: SessionDep, deck: Deck) -> Deck:
    session.add(deck)
    session.commit()
    session.refresh(deck)
    return deck

@app.delete("/decks/{id}", tags=["Decks"])
def deletar_deck(session: SessionDep, id: int) -> str:
    deck = session.exec(select(Deck).where(Deck.id == id)).one()
    session.delete(deck)
    session.commit()
    return "Deck excluído com sucesso."


# ==============================
# Cartas
# ==============================

@app.get("/cards", tags=["Cartas"])
def listar_cards(session: SessionDep) -> List[Card]:
    return session.exec(select(Card)).all()

@app.post("/cards", tags=["Cartas"])
def cadastrar_card(session: SessionDep, card: Card) -> Card:
    session.add(card)
    session.commit()
    session.refresh(card)
    return card

@app.delete("/cards/{id}", tags=["Cartas"])
def deletar_card(session: SessionDep, id: int) -> str:
    card = session.exec(select(Card).where(Card.id == id)).one()
    session.delete(card)
    session.commit()
    return "Carta excluída com sucesso."
