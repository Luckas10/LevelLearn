from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship


# Usuário

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True, nullable=False)
    email: str = Field(unique=True, nullable=False)
    password_hash: str

    level: int = Field(default=1)
    xp: int = Field(default=0)

    # Relacionamentos
    achievements: List["Achievement"] = Relationship(back_populates="user")
    friends: List["Friendship"] = Relationship(back_populates="user")
    decks: List["Deck"] = Relationship(back_populates="owner")
    coins: int = Field(default=0)  


# Conquistas

class Achievement(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str
    user_id: int = Field(foreign_key="user.id")
    user: Optional[User] = Relationship(back_populates="achievements")


# Amizades

class Friendship(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    friend_id: int = Field(foreign_key="user.id")

    user: Optional[User] = Relationship(back_populates="friends")


# Loja / Cosméticos

class ShopItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    price: int
    description: str
    owner_id: Optional[int] = Field(default=None, foreign_key="user.id")


# Flashcards (Decks e Cartas)

class Deck(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    owner_id: int = Field(foreign_key="user.id")

    owner: Optional[User] = Relationship(back_populates="decks")
    cards: List["Card"] = Relationship(back_populates="deck")


class Card(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    question: str
    answer: str
    is_custom: bool = Field(default=False)

    deck_id: int = Field(foreign_key="deck.id")
    deck: Optional[Deck] = Relationship(back_populates="cards")