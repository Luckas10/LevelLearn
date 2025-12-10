from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, date

# Usuários e Conquistas

class UserAchievementLink(SQLModel, table=True):
    __tablename__ = "user_achievement_link"

    user_id: int = Field(foreign_key="user.id", primary_key=True)
    achievement_id: int = Field(foreign_key="achievement.id", primary_key=True)

# Loja
class UserShopItemLink(SQLModel, table=True):
    __tablename__ = "user_shop_item_link"

    user_id: int = Field(foreign_key="user.id", primary_key=True)
    shop_item_id: int = Field(foreign_key="shopitem.id", primary_key=True)

# Usuário

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True, nullable=False)
    email: str = Field(unique=True, nullable=False)
    password_hash: str

    level: int = Field(default=1)
    xp: int = Field(default=0)
    coins: int = Field(default=0)
    # 🔥 sequência diária atual (em dias)
    combo: int = Field(default=0)

    # 🏆 maior sequência diária que o usuário já teve
    best_streak: int = Field(default=0)

    # 📅 última data em que a sequência foi contada
    last_streak_date: Optional[date] = Field(default=None)

    study_time_minutes: int = Field(default=0)

    # Relacionamentos
    achievements: List["Achievement"] = Relationship(
        back_populates="users",
        link_model=UserAchievementLink
    )
    
    shop_items: List["ShopItem"] = Relationship(
        back_populates="users",
        link_model=UserShopItemLink
    )

    sent_requests: List["Friendship"] = Relationship(
        back_populates="requester",
        sa_relationship_kwargs={
            "foreign_keys": "[Friendship.user_id]"
        }
    )

    received_requests: List["Friendship"] = Relationship(
        back_populates="receiver",
        sa_relationship_kwargs={
            "foreign_keys": "[Friendship.friend_id]"
        }
    )

    decks: List["Deck"] = Relationship(back_populates="owner")


# Conquistas

class Achievement(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str
    image_path: str

    users: List[User] = Relationship(
        back_populates="achievements",
        link_model=UserAchievementLink
    )


# Amizades (CORRIGIDO)

class Friendship(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")      # quem enviou
    friend_id: int = Field(foreign_key="user.id")    # quem recebeu
    accepted: bool = Field(default=False)

    requester: Optional[User] = Relationship(
        back_populates="sent_requests",
        sa_relationship_kwargs={
            "foreign_keys": "[Friendship.user_id]"
        }
    )

    receiver: Optional[User] = Relationship(
        back_populates="received_requests",
        sa_relationship_kwargs={
            "foreign_keys": "[Friendship.friend_id]"
        }
    )


# Loja

class ShopItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    price: int
    description: str
    image_path: str   # 👈 caminho da imagem (ex.: "animals/Fenix.png")

    # quem comprou esse item
    users: List[User] = Relationship(
        back_populates="shop_items",
        link_model=UserShopItemLink
    )


# Decks

class Deck(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str
    cover_name: str

    # NOVOS CAMPOS
    subject: str = Field(default="")  # nome da matéria (ex.: "Física")
    monster_image_path: str = Field(default="")  # ex.: "/Monsters/fisica_monstro.svg"

    owner_id: int = Field(foreign_key="user.id")
    owner: Optional[User] = Relationship(back_populates="decks")
    cards: List["Card"] = Relationship(
        back_populates="deck",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )


class Card(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    question: str
    answer: str
    is_custom: bool = Field(default=False)

    deck_id: int = Field(foreign_key="deck.id")
    deck: Optional[Deck] = Relationship(back_populates="cards")

# Sessões

class FlashcardSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    deck_id: int = Field(foreign_key="deck.id")

    correct: int          # acertos
    total: int            # total respondidas
    elapsed_minutes: int = Field(default=0)  # ⬅️ tempo que levou na sessão
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PomodoroSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")

    focus_minutes: int        # F
    short_break_minutes: int  # B_s
    long_break_minutes: int   # B_l
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Missões diárias

class UserDailyMission(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    user_id: int = Field(foreign_key="user.id")
    code: str = Field(index=True)         # ex: "POMO_25", "FLASH_10"
    mission_date: date = Field(index=True)        # dia da missão (YYYY-MM-DD)

    progress: int = Field(default=0)      # progresso atual
    target: int = Field(default=0)        # meta da missão
    completed: bool = Field(default=False)
    claimed: bool = Field(default=False)  # se já pegou a recompensa