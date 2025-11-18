from fastapi import APIRouter
from sqlmodel import select
from typing import List
from models import Card
from database import SessionDep

from routers.auth import get_current_user

router = APIRouter(prefix="/cards", tags=["Cartas"])

@router.get("")
def listar_cards(session: SessionDep) -> List[Card]:
    return session.exec(select(Card)).all()

@router.post("")
def cadastrar_card(session: SessionDep, card: Card) -> Card:
    session.add(card)
    session.commit()
    session.refresh(card)
    return card

@router.delete("/{id}")
def deletar_card(session: SessionDep, id: int) -> str:
    card = session.exec(select(Card).where(Card.id == id)).one()
    session.delete(card)
    session.commit()
    return "Carta excluída com sucesso."
