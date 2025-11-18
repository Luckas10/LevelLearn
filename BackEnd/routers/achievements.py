from fastapi import APIRouter
from sqlmodel import select
from typing import List
from models import Achievement
from database import SessionDep

from routers.auth import get_current_user

router = APIRouter(prefix="/achievements", tags=["Conquistas"])

@router.get("")
def listar_achievements(session: SessionDep) -> List[Achievement]:
    return session.exec(select(Achievement)).all()

@router.post("")
def cadastrar_achievement(session: SessionDep, achievement: Achievement) -> Achievement:
    session.add(achievement)
    session.commit()
    session.refresh(achievement)
    return achievement

@router.delete("/{id}")
def deletar_achievement(session: SessionDep, id: int) -> str:
    ach = session.exec(select(Achievement).where(Achievement.id == id)).one()
    session.delete(ach)
    session.commit()
    return "Conquista excluída com sucesso."
