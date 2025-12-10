from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import select
from typing import List

from models import Deck, User
from database import SessionDep
from .auth import get_current_user  # ⬅ importante

from pydantic import BaseModel

router = APIRouter(prefix="/decks", tags=["Decks"])


# ===== Schemas =====

class DeckCreate(BaseModel):
    name: str
    description: str
    cover_name: str
    subject: str
    monster_image_path: str


class DeckUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    cover_name: str | None = None
    subject: str | None = None
    monster_image_path: str | None = None


# (opcional) se quiser tipar a saída:
class DeckRead(BaseModel):
    id: int
    name: str
    description: str
    cover_name: str
    subject: str
    monster_image_path: str
    owner_id: int

    class Config:
        from_attributes = True


# =========================
# LISTAR / CRUD
# =========================

@router.get("", response_model=List[DeckRead])
def listar_decks(session: SessionDep) -> List[Deck]:
    """
    Lista todos os decks existentes (independente de dono).
    """
    decks = session.exec(select(Deck)).all()
    return decks


@router.post("", response_model=DeckRead)
def cadastrar_deck(
    session: SessionDep,
    data: DeckCreate,
    current_user: User = Depends(get_current_user)
) -> Deck:
    deck = Deck(
        name=data.name,
        description=data.description,
        cover_name=data.cover_name,
        subject=data.subject,
        monster_image_path=data.monster_image_path,
        owner_id=current_user.id,
    )
    session.add(deck)
    session.commit()
    session.refresh(deck)
    return deck


@router.get("/{id}", response_model=DeckRead)
def obter_deck(session: SessionDep, id: int) -> Deck:
    deck = session.get(Deck, id)
    if not deck:
        raise HTTPException(status_code=404, detail="Deck não encontrado")
    return deck


@router.delete("/{id}")
def deletar_deck(session: SessionDep, id: int) -> str:
    deck = session.exec(select(Deck).where(Deck.id == id)).one()
    session.delete(deck)
    session.commit()
    return "Deck excluído com sucesso."


@router.put("/{id}", response_model=DeckRead)
def atualizar_deck(session: SessionDep, id: int, dados: DeckUpdate) -> Deck:
    deck = session.get(Deck, id)

    if not deck:
        raise HTTPException(404, "Deck não encontrado")

    update_data = dados.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(deck, key, value)

    session.add(deck)
    session.commit()
    session.refresh(deck)
    return deck


# =========================
# CONTAGEM DE DECKS
# =========================

@router.get("/count")
def contar_decks_totais(session: SessionDep):
    """
    Retorna a quantidade TOTAL de decks cadastrados no sistema.
    """
    decks = session.exec(select(Deck)).all()
    total = len(decks)
    return {"total": total}


@router.get("/owner/{user_id}/count")
def contar_decks_por_usuario(
    user_id: int,
    session: SessionDep,
):
    """
    Retorna quantos decks pertencem a um determinado usuário (owner_id).
    Ideal para usar em telas de perfil: "DECKS: XX".
    """
    decks = session.exec(
        select(Deck).where(Deck.owner_id == user_id)
    ).all()
    total = len(decks)
    return {"total": total}


@router.get("/me", response_model=List[DeckRead])
def listar_decks_do_usuario_atual(
    session: SessionDep,
    current_user: User = Depends(get_current_user),
) -> List[Deck]:
    """
    Lista todos os decks do usuário autenticado.
    """
    decks = session.exec(
        select(Deck).where(Deck.owner_id == current_user.id)
    ).all()
    return decks


@router.get("/me/count")
def contar_decks_do_usuario_atual(
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    """
    Retorna a quantidade de decks do usuário autenticado.
    """
    decks = session.exec(
        select(Deck).where(Deck.owner_id == current_user.id)
    ).all()
    total = len(decks)
    return {"total": total}
