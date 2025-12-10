from sqlmodel import select, Session
from database import engine
from models import ShopItem

def seed_shop_items():
    items = [
        {
            "name": "Cobra — Guardiã da Biblioteca",
            "description": "Avatar temático da Cobra estudiosa. Aumenta seu estilo em 100%.",
            "price": 250,
            "image_front_path": "/StoreItems/Cobra.png",
            "image_back_path": "/Animals/Cobra-tras.svg",
            "battle_back_path": "/Animals/Cobra-tras-battle.svg",
            "visible_in_store": True,
        },
        {
            "name": "Dragão — Mestre dos Estudos",
            "description": "Imponente, motiva focos épicos de estudo. Ideal para maratonas.",
            "price": 450,
            "image_front_path": "/StoreItems/Dragao.png",
            "image_back_path": "/Animals/Dragao-tras.svg",
            "battle_back_path": "/Animals/Dragao-tras-battle.svg",
            "visible_in_store": True,
        },
        {
            "name": "Fênix — Renascimento do Conhecimento",
            "description": "Para quem sempre volta mais forte após cada prova.",
            "price": 380,
            "image_front_path": "/StoreItems/Fenix.png",
            "image_back_path": "/Animals/Fenix-tras.svg",
            "battle_back_path": "/Animals/Fenix-tras-battle.svg",
            "visible_in_store": True,
        },
        {
            "name": "Gato — Curioso por Natureza",
            "description": "Fofo e focado. Perfeito pra sessões de leitura.",
            "price": 0,
            "image_front_path": "/StoreItems/Gato.png",
            "image_back_path": "/Animals/Gato-tras.svg",
            "battle_back_path": "/Animals/Gato-tras-battle.svg",
            "visible_in_store": False,  # padrão, não aparece na loja
        },
        {
            "name": "Ouriço — Blindado contra Procrastinação",
            "description": "Espeta a preguiça e te mantém no trilho.",
            "price": 190,
            "image_front_path": "/StoreItems/Ourico.png",
            "image_back_path": "/Animals/Ourico-tras.svg",
            "battle_back_path": "/Animals/Ourico-tras-battle.svg",
            "visible_in_store": True,
        },
        {
            "name": "Raposa — Estratégia e Astúcia",
            "description": "Escolhas inteligentes em cada estudo.",
            "price": 220,
            "image_front_path": "/StoreItems/Raposa.png",
            "image_back_path": "/Animals/Raposa-tras.svg",
            "battle_back_path": "/Animals/Raposa-tras-battle.svg",
            "visible_in_store": True,
        },
    ]

    with Session(engine) as session:
        count = 0
        for data in items:
            existing = session.exec(
                select(ShopItem).where(ShopItem.name == data["name"])
            ).first()
            if existing:
                continue

            item = ShopItem(**data)
            session.add(item)
            count += 1

        session.commit()
        print(f"✅ {count} itens da loja seedados!")

if __name__ == "__main__":
    seed_shop_items()