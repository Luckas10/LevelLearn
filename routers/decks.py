from fastapi import APIRouter
from sqlmodel import select
from typing import List
from models import Deck
from database import SessionDep

from routers.auth import get_current_user

router = APIRouter(prefix="/decks", tags=["Decks"])

@router.get("")
def listar_decks(session: SessionDep) -> List[Deck]:
    return session.exec(select(Deck)).all()

@router.post("")
def cadastrar_deck(session: SessionDep, deck: Deck) -> Deck:
    session.add(deck)
    session.commit()
    session.refresh(deck)
    return deck

@router.delete("/{id}")
def deletar_deck(session: SessionDep, id: int) -> str:
    deck = session.exec(select(Deck).where(Deck.id == id)).one()
    session.delete(deck)
    session.commit()
    return "Deck excluído com sucesso."
