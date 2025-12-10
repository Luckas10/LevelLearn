# seed_achievements.py
from sqlmodel import select, Session
from database import engine
from models import Achievement


def seed_achievements():
    achievements = [
        {
            "name": "Primeiro Deck",
            "description": "Você criou seu primeiro deck de estudos.",
            "image_path": "/achievements/primeiro_deck.png",
        },
        {
            "name": "Primeiro Pomodoro",
            "description": "Você completou sua primeira sessão de pomodoro.",
            "image_path": "/achievements/primeiro_pomodoro.png",
        },
        {
            "name": "Sem Errar!",
            "description": "Você concluiu uma sessão com pelo menos 8 flashcards sem errar nenhum.",
            "image_path": "/achievements/sem_errar.png",
        },
        {
            "name": "Maratona de Estudo",
            "description": "Você estudou 50 ou mais flashcards em um único dia.",
            "image_path": "/achievements/maratona_de_estudo.png",
        },
        {
            "name": "Foco Inquebrável",
            "description": "Você manteve 50 minutos ou mais de foco em uma sessão de pomodoro.",
            "image_path": "/achievements/foco_inquebravel.png",
        },
        {
            "name": "Novo Companheiro",
            "description": "Você enviou ou recebeu seu primeiro pedido de amizade.",
            "image_path": "/achievements/novo_companheiro.png",
        },
    ]

    # abre sessão usando o mesmo engine do app
    with Session(engine) as session:
        for data in achievements:
            # não duplicar se já existir pelo mesmo nome
            existing = session.exec(
                select(Achievement).where(Achievement.name == data["name"])
            ).first()
            if existing:
                continue

            ach = Achievement(
                name=data["name"],
                description=data["description"],
                image_path=data["image_path"],
            )
            session.add(ach)

        session.commit()
        print("✅ 6 conquistas seedadas com sucesso!")


if __name__ == "__main__":
    seed_achievements()
