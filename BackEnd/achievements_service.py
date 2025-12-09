# achievements_service.py
from sqlmodel import Session, select
from models import Achievement, UserAchievementLink

def grant_achievement(session: Session, user_id: int, achievement_name: str):
    """
    Garante que o usuário tenha a conquista de nome `achievement_name`.
    Se já tiver, não faz nada.
    """
    ach = session.exec(
        select(Achievement).where(Achievement.name == achievement_name)
    ).first()
    if not ach:
        return  # ou raise, se quiser ser mais rígido

    # Já tem essa conquista?
    link = session.exec(
        select(UserAchievementLink)
        .where(
            UserAchievementLink.user_id == user_id,
            UserAchievementLink.achievement_id == ach.id,
        )
    ).first()

    if link:
        return

    session.add(UserAchievementLink(user_id=user_id, achievement_id=ach.id))
