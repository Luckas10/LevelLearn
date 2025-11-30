from fastapi import APIRouter, Depends
from sqlmodel import select
from typing import List
from models import Card, User
from database import SessionDep

from routers.auth import get_current_user

router = APIRouter(prefix="/cards", tags=["Cartas"])

@router.get("")
def listar_cards(session: SessionDep, current_user: User = Depends(get_current_user)) -> List[Card]:
    return session.exec(select(Card)).all()

@router.post("")
def cadastrar_card(session: SessionDep, card: Card, current_user: User = Depends(get_current_user)) -> Card:
    session.add(card)
    session.commit()
    session.refresh(card)
    return card

@router.delete("/{id}")
def deletar_card(session: SessionDep, id: int, current_user: User = Depends(get_current_user)) -> str:
    card = session.exec(select(Card).where(Card.id == id)).one()
    session.delete(card)
    session.commit()
    return "Carta excluída com sucesso."

@router.get("/{deck_id}")
def listar_cards(deck_id: int, session: SessionDep, current_user: User = Depends(get_current_user)):
    return session.exec(select(Card).where(Card.deck_id == deck_id)).all()