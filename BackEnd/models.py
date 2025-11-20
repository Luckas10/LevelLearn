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
    coins: int = Field(default=0)
    combo: int = Field(default=0)

    # Relacionamentos
    achievements: List["Achievement"] = Relationship(back_populates="user")
    friends: List["Friendship"] = Relationship(back_populates="user", sa_relationship_kwargs={"foreign_keys": "[Friendship.user_id]"})
    decks: List["Deck"] = Relationship(back_populates="owner")

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

    # Relacionamentos
    user: Optional[User] = Relationship(back_populates="friends", sa_relationship_kwargs={"foreign_keys": "[Friendship.user_id]"})
    friend: Optional[User] = Relationship(sa_relationship_kwargs={"foreign_keys": "[Friendship.friend_id]"})


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
    description: str
    cover_name: str
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