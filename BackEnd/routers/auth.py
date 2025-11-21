from fastapi import APIRouter, HTTPException, status, Depends, Form
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer 
from sqlmodel import select
from typing import Annotated, Optional
from datetime import datetime, timedelta, timezone

from jose import jwt, JWTError
from passlib.context import CryptContext
from pydantic import BaseModel
from database import SessionDep
from models import User

router = APIRouter(prefix="/auth", tags=["Login"])

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth') 

# ==============================
# Configurações JWT
# ==============================
SECRET_KEY = "minha_chave_secreta_super_segura"  # troque para algo mais seguro em produção
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(username: str, user_id: int, expires_delta: Optional[timedelta] = None):
    encode = {'sub': username, 'id': user_id}
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    encode.update({"exp": expire})
    encoded_jwt = jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ==============================
# Schemas
# ==============================
class TokenResponse(BaseModel):
    access_token: str
    token_type: str

# ==============================
# Endpoints
# ==============================
from sqlmodel import or_

@router.post("", response_model=TokenResponse)
def login(
    session: SessionDep, 
    username: Annotated[str, Form()], 
    password: Annotated[str, Form()],
    grant_type: Annotated[str, Form()] = 'password' 
):
    login_value = username
    user = session.exec(
        select(User).where(
            or_(User.username == login_value, User.email == login_value)
        )).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Credenciais incorretas."
        )

    if not bcrypt_context.verify(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Credenciais incorretas."
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(user.username, user.id, expires_delta=access_token_expires)

    return {"access_token": token, "token_type": "bearer"}

# ==============================
# Dependência para proteger rotas
# ==============================
from fastapi import Header
 
def get_current_user(token: Annotated[str, Depends(oauth2_bearer)], session: SessionDep):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        user_id: int = payload.get("id")

        if user_id is None or username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido ou expirado.")
        user = session.exec(select(User).where(User.id == user_id)).first()
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuário não encontrado.")
        
        return user
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido ou expirado.")