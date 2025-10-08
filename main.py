from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import lifespan
from routers import auth, users, achievements, friends, shop, decks, cards

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

# Registra os routers
app.include_router(users.router)
app.include_router(achievements.router)
app.include_router(friends.router)
app.include_router(shop.router)
app.include_router(decks.router)
app.include_router(cards.router)
app.include_router(auth.router)