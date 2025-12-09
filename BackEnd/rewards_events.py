# rewards_events.py
from sqlalchemy import event
from sqlmodel import Session

from models import (
    User,
    FlashcardSession,
    PomodoroSession,
    UserAchievementLink
)
from rewards import calc_flashcard_rewards, calc_pomodoro_rewards


# ==========================================================
# Configurações de recompensa ao ganhar uma conquista
# (valores ajustáveis)
# ==========================================================

ACHIEVEMENT_XP_BONUS = 100
ACHIEVEMENT_COINS_BONUS = 50


# ==========================================================
# 1) Trigger: recompensa ao concluir uma sessão de FLASHCARDS
# ==========================================================

@event.listens_for(FlashcardSession, "after_insert")
def reward_flashcards(mapper, connection, target: FlashcardSession):
    """
    Quando o usuário completa uma sessão de flashcards,
    calcula XP + Ouro usando calc_flashcard_rewards,
    e adiciona ao User.
    """
    with Session(bind=connection) as session:
        user = session.get(User, target.user_id)
        if not user:
            return

        xp_gain, coins_gain = calc_flashcard_rewards(
            correct=target.correct,
            total=target.total
        )

        # nada a adicionar
        if xp_gain == 0 and coins_gain == 0:
            return

        user.xp += xp_gain
        user.coins += coins_gain

        session.add(user)
        session.commit()


# ==========================================================
# 2) Trigger: recompensa ao concluir uma sessão de POMODORO
# ==========================================================

@event.listens_for(PomodoroSession, "after_insert")
def reward_pomodoro(mapper, connection, target: PomodoroSession):
    """
    Quando o usuário conclui um ciclo Pomodoro,
    calcula XP + Ouro usando calc_pomodoro_rewards
    e adiciona ao User.
    """
    with Session(bind=connection) as session:
        user = session.get(User, target.user_id)
        if not user:
            return

        xp_gain, coins_gain = calc_pomodoro_rewards(
            focus=target.focus_minutes,
            short_break=target.short_break_minutes,
            long_break=target.long_break_minutes
        )

        if xp_gain == 0 and coins_gain == 0:
            return

        user.xp += xp_gain
        user.coins += coins_gain

        session.add(user)
        session.commit()


# ==========================================================
# 3) Trigger: bônus ao ganhar uma CONQUISTA
# ==========================================================

@event.listens_for(UserAchievementLink, "after_insert")
def reward_achievement_bonus(mapper, connection, target: UserAchievementLink):
    """
    Sempre que o usuário ganha uma conquista,
    ele recebe XP + Ouro adicionais.
    """
    with Session(bind=connection) as session:
        user = session.get(User, target.user_id)
        if not user:
            return

        user.xp += ACHIEVEMENT_XP_BONUS
        user.coins += ACHIEVEMENT_COINS_BONUS

        session.add(user)
        session.commit()
