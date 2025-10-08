from fastapi import APIRouter
from sqlmodel import select
from typing import List
from models import ShopItem
from database import SessionDep

router = APIRouter(prefix="/shop", tags=["Loja"])

@router.get("")
def listar_itens(session: SessionDep) -> List[ShopItem]:
    return session.exec(select(ShopItem)).all()

@router.post("")
def cadastrar_item(session: SessionDep, item: ShopItem) -> ShopItem:
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

@router.delete("/{id}")
def deletar_item(session: SessionDep, id: int) -> str:
    item = session.exec(select(ShopItem).where(ShopItem.id == id)).one()
    session.delete(item)
    session.commit()
    return "Item excluído com sucesso."
