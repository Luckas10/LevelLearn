# events.py
from datetime import datetime, timedelta
from sqlalchemy import event
from sqlmodel import Session, select

from models import (
    Deck,
    PomodoroSession,
    FlashcardSession,
    Friendship,
)
from achievements_service import grant_achievement


# =========================
# Helpers de data
# =========================

def get_today_range(ref: datetime | None = None):
    """Retorna o início e fim (exclusivo) do dia de ref em UTC."""
    now = ref or datetime.utcnow()
    start = datetime(year=now.year, month=now.month, day=now.day)
    end = start + timedelta(days=1)
    return start, end


# =========================
# 1) Conquista: "Primeiro Deck"
# =========================

@event.listens_for(Deck, "after_insert")
def achievement_first_deck(mapper, connection, target: Deck):
    with Session(bind=connection) as session:
        grant_achievement(
            session,
            user_id=target.owner_id,
            achievement_name="Primeiro Deck",
        )
        session.commit()


# =========================
# 2) Conquista: "Primeiro Pomodoro"
# =========================

@event.listens_for(PomodoroSession, "after_insert")
def achievement_first_pomodoro(mapper, connection, target: PomodoroSession):
    with Session(bind=connection) as session:
        grant_achievement(
            session,
            user_id=target.user_id,
            achievement_name="Primeiro Pomodoro",
        )
        session.commit()


# =====================================================
# 3) Missões ligadas a sessões de FLASHCARDS
#    (Sem Errar!, Maratona de Estudo)
# =====================================================

@event.listens_for(FlashcardSession, "after_insert")
def flashcard_missions(mapper, connection, target: FlashcardSession):
    with Session(bind=connection) as session:
        user_id = target.user_id

        # "Sem Errar!" – sessão com >= 8 flashcards e 100% de acerto
        if target.total >= 8 and target.correct == target.total:
            grant_achievement(
                session,
                user_id=user_id,
                achievement_name="Sem Errar!",
            )

        # "Maratona de Estudo" – 50 flashcards no total no dia
        start, end = get_today_range(target.created_at)
        totals_today = session.exec(
            select(FlashcardSession.total).where(
                FlashcardSession.user_id == user_id,
                FlashcardSession.created_at >= start,
                FlashcardSession.created_at < end,
            )
        ).all()
        if sum(totals_today or []) >= 50:
            grant_achievement(
                session,
                user_id=user_id,
                achievement_name="Maratona de Estudo",
            )

        session.commit()


# =====================================================
# 4) Missões ligadas a sessões de POMODORO
#    (Foco Inquebrável)
# =====================================================

@event.listens_for(PomodoroSession, "after_insert")
def pomodoro_missions(mapper, connection, target: PomodoroSession):
    with Session(bind=connection) as session:
        user_id = target.user_id

        F = max(target.focus_minutes, 0)

        # "Foco Inquebrável" – F >= 50
        if F >= 50:
            grant_achievement(
                session,
                user_id=user_id,
                achievement_name="Foco Inquebrável",
            )

        session.commit()


# =====================================================
# 5) Missões SOCIAIS (amizade)
#    (Novo Companheiro)
# =====================================================

@event.listens_for(Friendship, "after_insert")
def social_missions(mapper, connection, target: Friendship):
    with Session(bind=connection) as session:
        # "Novo Companheiro" – enviar ou receber 1 pedido de amizade
        grant_achievement(
            session,
            user_id=target.user_id,
            achievement_name="Novo Companheiro",
        )
        grant_achievement(
            session,
            user_id=target.friend_id,
            achievement_name="Novo Companheiro",
        )

        session.commit()
