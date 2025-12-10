# routers/flashcards.py
from fastapi import APIRouter, Depends
from sqlmodel import Session, SQLModel
from models import User, FlashcardSession
from database import get_session
from .auth import get_current_user
from rewards import (
    calc_flashcard_rewards,
    level_from_xp,           # 👈 importa o cálculo de level
)
from streaks import update_daily_streak
from daily_missions_service import add_daily_progress

router = APIRouter(prefix="/flashcards", tags=["Flashcards"])


class FlashcardSessionIn(SQLModel):
    deck_id: int
    correct: int
    total: int
    elapsed_minutes: int  # ⬅️ novo


@router.post("/session-result")
def finish_session(
    data: FlashcardSessionIn,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    # 1) salva a sessão
    study = FlashcardSession(
        user_id=current_user.id,
        deck_id=data.deck_id,
        correct=data.correct,
        total=data.total,
        elapsed_minutes=data.elapsed_minutes,
    )
    session.add(study)

    # 2) calcula recompensa
    xp_gain, coins_gain = calc_flashcard_rewards(data.correct, data.total)

    # ===== ATUALIZA RECOMPENSAS DO USUÁRIO =====
    current_user.xp += xp_gain
    current_user.coins += coins_gain

    # 🔥 recalcula o level com base no XP TOTAL
    current_user.level = level_from_xp(current_user.xp)

    # 3) soma tempo de estudo da sessão
    current_user.study_time_minutes += max(0, data.elapsed_minutes)

    # 4) se ganhou XP, atualiza streak diária
    if xp_gain > 0:
        update_daily_streak(current_user)

    # 5) Missões diárias
    add_daily_progress(session, current_user.id, "flashcards_answered", data.total)

    # usar o tempo real da sessão (em minutos)
    real_minutes = max(data.elapsed_minutes, 1)
    add_daily_progress(session, current_user.id, "study_minutes", real_minutes)

    # 🚀 progresso de "Responder decks X vezes" (1 sessão concluída)
    add_daily_progress(session, current_user.id, "deck_sessions", 1)

    session.add(current_user)
    session.commit()
    session.refresh(current_user)

    return {
        "xp_gain": xp_gain,
        "coins_gain": coins_gain,
        "xp_total": current_user.xp,
        "coins_total": current_user.coins,
        "level": current_user.level,
        "study_time": current_user.study_time_minutes,
        "streak": current_user.combo,
        "best_streak": current_user.best_streak,
    }
