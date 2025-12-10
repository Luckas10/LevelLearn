# routers/users.py
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlmodel import select
from pydantic import BaseModel
from typing import List
from passlib.context import CryptContext

from database import SessionDep
from models import User, ShopItem, UserShopItemLink
from routers.auth import get_current_user
from rewards import xp_threshold_for_level  # 👈 importa a função de XP


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
    xp_required: int                      # 👈 quanto falta pro próximo level
    study_time: float
    achievements: List[UserAchievementRead] = []

    current_avatar_id: int | None = None
    current_avatar_front_path: str | None = None
    current_avatar_battle_back_path: str | None = None

    class Config:
        from_attributes = True


router = APIRouter(prefix="/users", tags=["Usuários"])


def build_user_read(user: User) -> UserRead:
    """
    Monta o UserRead calculando quanto XP falta pro próximo level
    e incluindo dados do avatar atual (frente e batalha).
    """

    # ===== Cálculo de XP =====
    total_for_next = xp_threshold_for_level(user.level + 1)
    xp_required = max(0, total_for_next - user.xp)

    # ===== Avatar atual =====
    avatar = getattr(user, "current_avatar", None)

    # Defaults para o Gato padrão
    DEFAULT_FRONT = "/StoreItems/Gato.png"
    DEFAULT_BATTLE = "/Animals/Gato-tras-battle.svg"

    # Se o usuário tem um avatar selecionado e válido
    if avatar:
        current_avatar_id = avatar.id
        current_avatar_front_path = avatar.image_front_path
        current_avatar_battle_back_path = avatar.battle_back_path

    else:
        # Usa o Gato padrão
        current_avatar_id = None
        current_avatar_front_path = DEFAULT_FRONT
        current_avatar_battle_back_path = DEFAULT_BATTLE

    # ===== Retorno =====
    return UserRead(
        id=user.id,
        username=user.username,
        email=user.email,
        xp=user.xp,
        combo=user.combo,
        level=user.level,
        coins=user.coins,
        xp_required=xp_required,
        study_time=user.study_time_minutes,
        achievements=user.achievements,

        # Avatar
        current_avatar_id=current_avatar_id,
        current_avatar_front_path=current_avatar_front_path,
        current_avatar_battle_back_path=current_avatar_battle_back_path,
    )



@router.get("", response_model=List[UserRead])
def listar_users(
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    users = session.exec(select(User)).all()
    return [build_user_read(u) for u in users]


@router.post("", status_code=status.HTTP_201_CREATED)
def cadastrar_user(session: SessionDep, data: UserCreate) -> User:
    exists = session.exec(select(User).where(User.username == data.username)).first()
    if exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username já existe."
        )

    exists_email = session.exec(select(User).where(User.email == data.email)).first()
    if exists_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado."
        )

    hashed = bcrypt_context.hash(data.password)

    new_user = User(
        username=data.username,
        email=data.email,
        password_hash=hashed
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    # 👇 Tenta achar o avatar Gato (pelo nome ou outro critério)
    gato_item = session.exec(
        select(ShopItem).where(ShopItem.name.ilike("%Gato%"))
    ).first()

    if gato_item:
        # associa Gato ao usuário
        link = UserShopItemLink(
            user_id=new_user.id,
            shop_item_id=gato_item.id
        )
        session.add(link)

        # define o Gato como avatar atual
        new_user.current_avatar_id = gato_item.id
        session.add(new_user)
        session.commit()
        session.refresh(new_user)

    return new_user


@router.put("/{id}")
def atualizar_user(
    session: SessionDep,
    id: int,
    username: str,
    current_user: User = Depends(get_current_user),
) -> User:
    user = session.exec(select(User).where(User.id == id)).one()
    user.username = username
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.delete("/{id}")
def deletar_user(
    session: SessionDep,
    id: int,
    current_user: User = Depends(get_current_user),
) -> str:
    user = session.exec(select(User).where(User.id == id)).one()
    session.delete(user)
    session.commit()
    return "Usuário excluído com sucesso."


@router.get("/search", response_model=List[UserRead])
def buscar_usuarios(
    session: SessionDep,
    username: str = "",
    current_user: User = Depends(get_current_user),
):
    query = select(User).where(User.id != current_user.id)

    if username:
        query = query.where(User.username.ilike(f"%{username}%"))

    users = session.exec(query).all()
    return [build_user_read(u) for u in users]


@router.get("/me", response_model=UserRead)
def get_me(current_user: User = Depends(get_current_user)):
    # agora devolve o modelo com xp_required calculado
    return build_user_read(current_user)


@router.get("/{id}", response_model=UserRead)
def buscar_user_por_id(
    session: SessionDep,
    id: int,
    current_user: User = Depends(get_current_user),
):
    user = session.exec(select(User).where(User.id == id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    return build_user_read(user)

@router.post("/me/avatar/{item_id}", response_model=UserRead)
def set_current_avatar(
    item_id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    """
    Define qual ShopItem será o avatar atual do usuário.
    Só permite itens que o usuário possui.
    """
    session.refresh(current_user)

    # verifica se o usuário possui o item
    owns = any(item.id == item_id for item in (current_user.shop_items or []))
    if not owns:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Você não possui esse avatar."
        )

    current_user.current_avatar_id = item_id
    session.add(current_user)
    session.commit()
    session.refresh(current_user)

    return build_user_read(current_user)
