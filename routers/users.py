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

router = APIRouter(prefix="/users", tags=["Usuários"])

@router.get("")
def listar_users(session: SessionDep, current_user: User = Depends(get_current_user)) -> List[User]:
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
