# routers/flashcards.py
from fastapi import APIRouter, Depends
from sqlmodel import Session, SQLModel
from ..models import User, FlashcardSession
from ..database import get_session
from .auth import get_current_user
from ..rewards import calc_flashcard_rewards

router = APIRouter(prefix="/flashcards", tags=["flashcards"])

class FlashcardSessionIn(SQLModel):
    deck_id: int
    correct: int
    total: int


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
    )
    session.add(study)

    # 2) calcula recompensa
    xp_gain, coins_gain = calc_flashcard_rewards(data.correct, data.total)

    current_user.xp += xp_gain
    current_user.coins += coins_gain

    session.add(current_user)
    session.commit()
    session.refresh(current_user)

    return {
        "xp_gain": xp_gain,
        "coins_gain": coins_gain,
        "xp_total": current_user.xp,
        "coins_total": current_user.coins,
        "level": current_user.level,
    }
