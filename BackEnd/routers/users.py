# routers/users.py
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlmodel import select
from pydantic import BaseModel
from typing import List
from passlib.context import CryptContext
from database import SessionDep
from models import User

from routers.auth import get_current_user

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    
class UserAchievementRead(BaseModel):
    id: int
    name: str
    description: str
    image_path: str

    class Config:
        from_attributes = True

class UserRead(BaseModel):
    id: int
    username: str
    email: str
    xp: int
    combo: int
    level: int
    coins: int
    achievements: List[UserAchievementRead] = []

    class Config:
        from_attributes = True

router = APIRouter(prefix="/users", tags=["Usuários"])

@router.get("", response_model=List[UserRead])
def listar_users(session: SessionDep, current_user: User = Depends(get_current_user)):
    return session.exec(select(User)).all()

@router.post("", status_code=status.HTTP_201_CREATED)
def cadastrar_user(session: SessionDep, data: UserCreate) -> User:
    exists = session.exec(select(User).where(User.username == data.username)).first()
    if exists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username já existe.")
    exists_email = session.exec(select(User).where(User.email == data.email)).first()
    if exists_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email já cadastrado.")

    hashed = bcrypt_context.hash(data.password)

    new_user = User(
        username=data.username,
        email=data.email,
        password_hash=hashed
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user

@router.put("/{id}")
def atualizar_user(session: SessionDep, id: int, username: str, current_user: User = Depends(get_current_user)) -> User:
    user = session.exec(select(User).where(User.id == id)).one()
    user.username = username
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@router.delete("/{id}")
def deletar_user(session: SessionDep, id: int, current_user: User = Depends(get_current_user)) -> str:
    user = session.exec(select(User).where(User.id == id)).one()
    session.delete(user)
    session.commit()
    return "Usuário excluído com sucesso."

@router.get("/search", response_model=List[UserRead])
def buscar_usuarios(
    session: SessionDep,
    username: str = "",
    current_user: User = Depends(get_current_user)
):
    query = select(User)
    query = query.where(User.id != current_user.id)
    # filtro textual
    if username:
        query = query.where(User.username.ilike(f"%{username}%"))

    users = session.exec(query).all()
    return users

@router.get("/me", response_model=UserRead)
def get_me(current_user: User = Depends(get_current_user)):
    # current_user é um User completo (id, username, email, xp, combo, level, coins, password_hash...)
    # o FastAPI vai convertê-lo para UserRead automaticamente (sem password_hash)
    return current_user

@router.get("/{id}", response_model=UserRead)
def buscar_user_por_id(
    id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    user = session.exec(select(User).where(User.id == id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    return user
