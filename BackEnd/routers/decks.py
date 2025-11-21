from fastapi import APIRouter, Depends
from sqlmodel import select
from typing import List
from models import Deck, User
from database import SessionDep

from routers.auth import get_current_user

router = APIRouter(prefix="/decks", tags=["Decks"])

@router.get("")
def listar_decks(session: SessionDep, current_user: User = Depends(get_current_user)) -> List[Deck]:
    return session.exec(select(Deck)).all()

@router.post("")
def cadastrar_deck(session: SessionDep, deck: Deck, current_user: User = Depends(get_current_user)) -> Deck:
    session.add(deck)
    session.commit()
    session.refresh(deck)
    return deck

@router.delete("/{id}")
def deletar_deck(session: SessionDep, id: int, current_user: User = Depends(get_current_user)) -> str:
    deck = session.exec(select(Deck).where(Deck.id == id)).one()
    session.delete(deck)
    session.commit()
    return "Deck excluído com sucesso."
