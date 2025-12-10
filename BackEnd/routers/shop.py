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
    image_front_path: str
    image_back_path: str
    battle_back_path: str
    visible_in_store: bool = True

class ShopItemRead(BaseModel):
    id: int
    name: str
    description: str
    price: int
    image_front_path: str
    image_back_path: str
    battle_back_path: str

    # se o usuário já possui o item (usado na loja)
    owned: bool = False

    class Config:
        from_attributes = True

# ===== Rotas de administração da loja (listar / criar / deletar) =====

@router.get("", response_model=List[ShopItemRead])
def listar_itens(
    session: SessionDep,
    current_user: User = Depends(get_current_user)
) -> List[ShopItemRead]:
    """
    Lista itens da loja que estão visíveis e marca quais o usuário já possui.
    """
    # itens visíveis na loja
    itens_loja = session.exec(
        select(ShopItem).where(ShopItem.visible_in_store == True)
    ).all()

    # ids dos itens que o usuário já tem
    session.refresh(current_user)
    owned_ids = {item.id for item in current_user.shop_items}

    result: List[ShopItemRead] = []
    for item in itens_loja:
        result.append(
            ShopItemRead(
                id=item.id,
                name=item.name,
                description=item.description,
                price=item.price,
                image_front_path=item.image_front_path,
                image_back_path=item.image_back_path,
                battle_back_path=item.battle_back_path,
                owned=item.id in owned_ids,
            )
        )

    return result

@router.post("", response_model=ShopItemRead, status_code=status.HTTP_201_CREATED)
def cadastrar_item(
    data: ShopItemCreate,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
) -> ShopItemRead:
    item = ShopItem(
        name=data.name,
        description=data.description,
        price=data.price,
        image_front_path=data.image_front_path,
        image_back_path=data.image_back_path,
        battle_back_path=data.battle_back_path,
        visible_in_store=data.visible_in_store,
    )
    session.add(item)
    session.commit()
    session.refresh(item)

    return ShopItemRead(
        id=item.id,
        name=item.name,
        description=item.description,
        price=item.price,
        image_front_path=item.image_front_path,
        image_back_path=item.image_back_path,
        battle_back_path=item.battle_back_path,
        owned=False,
    )


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

    session.refresh(current_user)

    # evitar compra duplicada
    if item in current_user.shop_items:
        # já tem o item - só retorna o inventário
        return [
            ShopItemRead(
                id=i.id,
                name=i.name,
                description=i.description,
                price=i.price,
                image_front_path=i.image_front_path,
                image_back_path=i.image_back_path,
                battle_back_path=i.battle_back_path,
                owned=True,
            )
            for i in current_user.shop_items
        ]

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

    return [
        ShopItemRead(
            id=i.id,
            name=i.name,
            description=i.description,
            price=i.price,
            image_front_path=i.image_front_path,
            image_back_path=i.image_back_path,
            battle_back_path=i.battle_back_path,
            owned=True,
        )
        for i in current_user.shop_items
    ]


@router.get("/me", response_model=List[ShopItemRead])
def meus_itens(
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    session.refresh(current_user)

    # 🔹 Garante que o usuário SEMPRE tenha o Gato no inventário
    gato = session.exec(
        select(ShopItem).where(ShopItem.image_front_path == "/StoreItems/Gato.png")
    ).first()

    if gato and gato not in current_user.shop_items:
        current_user.shop_items.append(gato)
        session.add(current_user)
        session.commit()
        session.refresh(current_user)

    # Agora monta o inventário completo (Gato + outros avatares)
    return [
        ShopItemRead(
            id=i.id,
            name=i.name,
            description=i.description,
            price=i.price,
            image_front_path=i.image_front_path,
            image_back_path=i.image_back_path,
            battle_back_path=i.battle_back_path,
            owned=True,  # inventário => sempre true
        )
        for i in (current_user.shop_items or [])
    ]
