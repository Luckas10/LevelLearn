# shop.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from typing import List
from pydantic import BaseModel

from models import ShopItem, User
from database import SessionDep
from routers.auth import get_current_user

router = APIRouter(prefix="/shop", tags=["Loja"])


# ===== Schemas Pydantic =====

class ShopItemCreate(BaseModel):
    name: str
    description: str
    price: int
    image_path: str


class ShopItemRead(BaseModel):
    id: int
    name: str
    description: str
    price: int
    image_path: str

    class Config:
        from_attributes = True


# ===== Rotas de administração da loja (listar / criar / deletar) =====

@router.get("", response_model=List[ShopItemRead])
def listar_itens(
    session: SessionDep,
    current_user: User = Depends(get_current_user)
) -> List[ShopItem]:
    # lista todos os itens disponíveis na loja
    return session.exec(select(ShopItem)).all()


@router.post("", response_model=ShopItemRead, status_code=status.HTTP_201_CREATED)
def cadastrar_item(
    data: ShopItemCreate,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
) -> ShopItem:
    item = ShopItem(
        name=data.name,
        description=data.description,
        price=data.price,
        image_path=data.image_path,
    )
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


@router.delete("/{id}")
def deletar_item(
    id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
) -> str:
    item = session.get(ShopItem, id)
    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado.")
    session.delete(item)
    session.commit()
    return "Item excluído com sucesso."


# ===== Rotas de compra / inventário =====

@router.post("/buy/{item_id}", response_model=List[ShopItemRead])
def comprar_item(
    item_id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    item = session.get(ShopItem, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado.")

    # evitar compra duplicada (igual unlock de conquista)
    session.refresh(current_user)
    if item in current_user.shop_items:
        # já tem o item - só retorna o inventário
        return current_user.shop_items

    # checar moedas
    if current_user.coins < item.price:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Moedas insuficientes para comprar este item."
        )

    # debita moedas e adiciona o item ao usuário
    current_user.coins -= item.price
    current_user.shop_items.append(item)

    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user.shop_items


@router.get("/me", response_model=List[ShopItemRead])
def meus_itens(
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    session.refresh(current_user)
    return current_user.shop_items or []
