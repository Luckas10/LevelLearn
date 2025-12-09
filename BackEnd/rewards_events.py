# rewards_events.py
from sqlalchemy import event
from sqlmodel import Session

from models import (
    User,
    FlashcardSession,
    PomodoroSession,
    UserAchievementLink,
)
from rewards import (
    calc_flashcard_rewards,
    calc_pomodoro_rewards,
    level_from_xp,
)


# =========================================
# Bônus fixo ao ganhar qualquer conquista
# =========================================

ACHIEVEMENT_XP_BONUS = 100
ACHIEVEMENT_COINS_BONUS = 50


def apply_level_up(user: User) -> None:
    """
    Recalcula o level com base no XP TOTAL atual do usuário.
    Se o XP for suficiente para vários níveis, ele sobe tudo de uma vez.
    """
    new_level = level_from_xp(user.xp)
    if new_level > user.level:
        user.level = new_level


# =========================================
# 1) Recompensa por sessão de FLASHCARDS
# =========================================

@event.listens_for(FlashcardSession, "after_insert")
def reward_flashcards(mapper, connection, target: FlashcardSession):
    """
    Quando o usuário completa uma sessão de flashcards,
    calcula XP + Ouro e atualiza o usuário.
    Também ajusta o level com base no XP total.
    """
    with Session(bind=connection) as session:
        user = session.get(User, target.user_id)
        if not user:
            return

        xp_gain, coins_gain = calc_flashcard_rewards(
            correct=target.correct,
            total=target.total,
        )

        if xp_gain == 0 and coins_gain == 0:
            return

        user.xp += xp_gain
        user.coins += coins_gain

        # recalcula nível com novo XP total
        apply_level_up(user)

        session.add(user)
        session.commit()


# =========================================
# 2) Recompensa por sessão de POMODORO
# =========================================

@event.listens_for(PomodoroSession, "after_insert")
def reward_pomodoro(mapper, connection, target: PomodoroSession):
    with Session(bind=connection) as session:
        user = session.get(User, target.user_id)
        if not user:
            return

        xp_gain, coins_gain = calc_pomodoro_rewards(
            focus=target.focus_minutes,
            short_break=target.short_break_minutes,
            long_break=target.long_break_minutes,
        )

        if xp_gain == 0 and coins_gain == 0:
            return

        user.xp += xp_gain
        user.coins += coins_gain

        # ⬅️ soma tempo de estudo (só o foco, sem pausas)
        user.study_time_minutes += max(0, target.focus_minutes)

        apply_level_up(user)

        session.add(user)
        session.commit()


# =========================================
# 3) Bônus por ganhar CONQUISTA
# =========================================

@event.listens_for(UserAchievementLink, "after_insert")
def reward_achievement_bonus(mapper, connection, target: UserAchievementLink):
    """
    Quando o usuário ganha uma conquista,
    ele recebe um bônus de XP + Ouro e o level é recalculado.
    """
    with Session(bind=connection) as session:
        user = session.get(User, target.user_id)
        if not user:
            return

        user.xp += ACHIEVEMENT_XP_BONUS
        user.coins += ACHIEVEMENT_COINS_BONUS

        apply_level_up(user)

        session.add(user)
        session.commit()
