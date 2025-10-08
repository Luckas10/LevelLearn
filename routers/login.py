# routers/login.py
from fastapi import APIRouter, HTTPException, status, Depends
from sqlmodel import select
from typing import Optional
from datetime import datetime, timedelta, timezone

from werkzeug.security import check_password_hash
from jose import jwt, JWTError
from pydantic import BaseModel

from database import SessionDep
from models import User

router = APIRouter(prefix="/login", tags=["Login"])

# ==============================
# Configurações JWT
# ==============================
SECRET_KEY = "minha_chave_secreta_super_segura"  # troque para algo mais seguro em produção
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"sub": data.username,"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
        return int(user_id)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")

# ==============================
# Schemas
# ==============================
class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

# ==============================
# Endpoints
# ==============================
@router.post("", response_model=TokenResponse)
def login(session: SessionDep, payload: LoginRequest):
    user = session.exec(select(User).where(User.username == payload.username)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado.")

    if not check_password_hash(user.password_hash, payload.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Senha incorreta.")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token({"sub": str(user.id)}, expires_delta=access_token_expires)

    return {"access_token": token, "token_type": "bearer"}

@router.post("/logout")
def logout():
    # Como JWT é stateless, logout é feito apagando o token no cliente
    return {"message": "Logout realizado. Apague o token no cliente."}

# ==============================
# Dependência para proteger rotas
# ==============================
from fastapi import Header

def get_current_user(authorization: Optional[str] = Header(None)):
    if authorization is None or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token ausente ou inválido")
    token = authorization.split(" ")[1]
    user_id = verify_token(token)
    return user_id
