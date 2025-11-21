from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from typing import List
from pydantic import BaseModel

from models import Achievement, User
from database import SessionDep
from routers.auth import get_current_user

router = APIRouter(prefix="/achievements", tags=["Conquistas"])

class AchievementCreate(BaseModel):
    name: str
    description: str
    image_path: str

class AchievementRead(BaseModel):
    id: int
    name: str
    description: str
    image_path: str

    class Config:
        from_attributes = True

@router.get("", response_model=List[AchievementRead])
def listar_achievements(session: SessionDep, current_user: User = Depends(get_current_user)):
    return session.exec(select(Achievement)).all()

@router.post("", response_model=AchievementRead, status_code=status.HTTP_201_CREATED)
def cadastrar_achievement(
    session: SessionDep,
    data: AchievementCreate,
    current_user: User = Depends(get_current_user)
) -> Achievement:
    achievement = Achievement(
        name=data.name,
        description=data.description,
        image_path=data.image_path
    )
    session.add(achievement)
    session.commit()
    session.refresh(achievement)
    return achievement

@router.delete("/{id}")
def deletar_achievement(session: SessionDep, id: int, current_user: User = Depends(get_current_user)) -> str:
    ach = session.get(Achievement, id)
    if not ach:
        raise HTTPException(status_code=404, detail="Conquista não encontrada.")
    session.delete(ach)
    session.commit()
    return "Conquista excluída com sucesso."

@router.post("/unlock/{achievement_id}", response_model=List[AchievementRead])
def desbloquear_conquista(
    achievement_id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    achievement = session.get(Achievement, achievement_id)
    if not achievement:
        raise HTTPException(status_code=404, detail="Conquista não encontrada.")

    # evitar duplicar
    if achievement in current_user.achievements:
        return current_user.achievements

    current_user.achievements.append(achievement)
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user.achievements

@router.get("/me", response_model=List[AchievementRead])
def minhas_conquistas(
    current_user: User = Depends(get_current_user)
):
    # current_user já vem carregado, mas se quiser garantir:
    return current_user.achievements

@router.get("/user/{user_id}", response_model=List[AchievementRead])
def conquistas_por_usuario(
    user_id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    return user.achievements
