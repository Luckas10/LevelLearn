# routers/pomodoro.py
from fastapi import APIRouter, Depends
from sqlmodel import Session, SQLModel
from models import User, PomodoroSession
from database import get_session
from .auth import get_current_user
from rewards import (
    calc_pomodoro_rewards,
    level_from_xp,              # 👈 importa o cálculo de level
)
from streaks import update_daily_streak
from daily_missions_service import add_daily_progress

router = APIRouter(prefix="/pomodoro", tags=["pomodoro"])


class PomodoroSessionIn(SQLModel):
    focus_minutes: int
    short_break_minutes: int
    long_break_minutes: int


@router.post("/session-result")
def finish_pomodoro(
    data: PomodoroSessionIn,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    # 1) salva a sessão de pomodoro
    pomodoro = PomodoroSession(
        user_id=current_user.id,
        focus_minutes=data.focus_minutes,
        short_break_minutes=data.short_break_minutes,
        long_break_minutes=data.long_break_minutes,
    )
    session.add(pomodoro)

    # 2) calcula recompensa
    xp_gain, coins_gain = calc_pomodoro_rewards(
        focus=data.focus_minutes,
        short_break=data.short_break_minutes,
        long_break=data.long_break_minutes,
    )

    # 3) aplica recompensas no usuário
    current_user.xp += xp_gain
    current_user.coins += coins_gain

    # 🔥 recalcula o level com base no XP TOTAL
    current_user.level = level_from_xp(current_user.xp)

    # tempo de estudo = minutos de foco
    focus_minutes = max(0, data.focus_minutes)
    current_user.study_time_minutes += focus_minutes

    # 4) missões diárias
    # missão específica de pomodoro
    add_daily_progress(session, current_user.id, "pomodoro_minutes", focus_minutes)
    # missão geral de minutos de estudo
    add_daily_progress(session, current_user.id, "study_minutes", focus_minutes)

    # 5) streak diária
    if xp_gain > 0:
        update_daily_streak(current_user)

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
