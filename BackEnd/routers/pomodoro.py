# routers/pomodoro.py
from fastapi import APIRouter, Depends
from sqlmodel import Session, SQLModel
from models import User, PomodoroSession
from database import get_session
from .auth import get_current_user
from rewards import calc_pomodoro_rewards
from streaks import update_daily_streak

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
    pomodoro = PomodoroSession(
        user_id=current_user.id,
        focus_minutes=data.focus_minutes,
        short_break_minutes=data.short_break_minutes,
        long_break_minutes=data.long_break_minutes,
    )
    session.add(pomodoro)

    xp_gain, coins_gain = calc_pomodoro_rewards(
        focus=data.focus_minutes,
        short_break=data.short_break_minutes,
        long_break=data.long_break_minutes,
    )

    current_user.xp += xp_gain
    current_user.coins += coins_gain

    # tempo de estudo = foco
    current_user.study_time_minutes += max(0, data.focus_minutes)

    # streak diária
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
