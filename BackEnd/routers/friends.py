from fastapi import APIRouter, Depends
from sqlmodel import select
from typing import List
from models import Friendship, User
from database import SessionDep

from routers.auth import get_current_user

router = APIRouter(prefix="/friends", tags=["Amizades"])

@router.get("")
def listar_amizades(session: SessionDep, current_user: User = Depends(get_current_user)) -> List[Friendship]:
    return session.exec(select(Friendship)).all()

@router.post("")
def adicionar_amizade(session: SessionDep, friendship: Friendship, current_user: User = Depends(get_current_user)) -> Friendship:
    session.add(friendship)
    session.commit()
    session.refresh(friendship)
    return friendship

@router.delete("/{id}")
def remover_amizade(session: SessionDep, id: int, current_user: User = Depends(get_current_user)) -> str:
    friendship = session.exec(select(Friendship).where(Friendship.id == id)).one()
    session.delete(friendship)
    session.commit()
    return "Amizade removida com sucesso."
