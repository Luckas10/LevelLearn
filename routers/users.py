# routers/users.py
from fastapi import APIRouter, HTTPException, status
from sqlmodel import select
from typing import List

from werkzeug.security import generate_password_hash
from database import SessionDep
from models import User
from schemas import UserCreate

router = APIRouter(prefix="/users", tags=["Usuários"])

@router.get("")
def listar_users(session: SessionDep) -> List[User]:
    return session.exec(select(User)).all()

@router.post("", status_code=status.HTTP_201_CREATED)
def cadastrar_user(session: SessionDep, data: UserCreate) -> User:
    # valida se já existe username ou email
    exists = session.exec(select(User).where(User.username == data.username)).first()
    if exists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username já existe.")
    exists_email = session.exec(select(User).where(User.email == data.email)).first()
    if exists_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email já cadastrado.")

    hashed = generate_password_hash(data.password)

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
def atualizar_user(session: SessionDep, id: int, username: str) -> User:
    user = session.exec(select(User).where(User.id == id)).one()
    user.username = username
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@router.delete("/{id}")
def deletar_user(session: SessionDep, id: int) -> str:
    user = session.exec(select(User).where(User.id == id)).one()
    session.delete(user)
    session.commit()
    return "Usuário excluído com sucesso."
