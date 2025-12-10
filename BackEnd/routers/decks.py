from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import select
from typing import List

from models import Deck, User
from database import SessionDep
from .auth import get_current_user  # ⬅ importante

router = APIRouter(prefix="/decks", tags=["Decks"])


# Schema só para criação (sem id, sem owner_id)
from pydantic import BaseModel

class DeckCreate(BaseModel):
    name: str
    description: str
    cover_name: str
    subject: str
    monster_image_path: str


class DeckUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    cover_name: str | None = None
    subject: str | None = None
    monster_image_path: str | None = None


@router.get("")
def listar_decks(session: SessionDep) -> List[Deck]:
    return session.exec(select(Deck)).all()


@router.post("")
def cadastrar_deck(
    session: SessionDep,
    data: DeckCreate,
    current_user: User = Depends(get_current_user)
) -> Deck:
    deck = Deck(
        name=data.name,
        description=data.description,
        cover_name=data.cover_name,
        subject=data.subject,
        monster_image_path=data.monster_image_path,
        owner_id=current_user.id,
    )
    session.add(deck)
    session.commit()
    session.refresh(deck)
    return deck


@router.get("/{id}")
def obter_deck(session: SessionDep, id: int) -> Deck:
    deck = session.get(Deck, id)
    if not deck:
        raise HTTPException(status_code=404, detail="Deck não encontrado")
    return deck


@router.delete("/{id}")
def deletar_deck(session: SessionDep, id: int) -> str:
    deck = session.exec(select(Deck).where(Deck.id == id)).one()
    session.delete(deck)
    session.commit()
    return "Deck excluído com sucesso."


@router.put("/{id}")
def atualizar_deck(session: SessionDep, id: int, dados: DeckUpdate) -> Deck:
    deck = session.get(Deck, id)

    if not deck:
        raise HTTPException(404, "Deck não encontrado")

    update_data = dados.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(deck, key, value)

    session.add(deck)
    session.commit()
    session.refresh(deck)
    return deck

