from fastapi import APIRouter, Depends
from sqlmodel import select
from typing import List
from models import Achievement, User
from database import SessionDep

from routers.auth import get_current_user

router = APIRouter(prefix="/achievements", tags=["Conquistas"])

@router.get("")
def listar_achievements(session: SessionDep, current_user: User = Depends(get_current_user)) -> List[Achievement]:
    return session.exec(select(Achievement)).all()

@router.post("")
def cadastrar_achievement(session: SessionDep, achievement: Achievement, current_user: User = Depends(get_current_user)) -> Achievement:
    session.add(achievement)
    session.commit()
    session.refresh(achievement)
    return achievement

@router.delete("/{id}")
def deletar_achievement(session: SessionDep, id: int, current_user: User = Depends(get_current_user)) -> str:
    ach = session.exec(select(Achievement).where(Achievement.id == id)).one()
    session.delete(ach)
    session.commit()
    return "Conquista excluída com sucesso."
