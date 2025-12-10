# routers/daily_missions.py
from datetime import date
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session

from database import get_session
from models import User
from routers.auth import get_current_user
from daily_missions_service import (
    get_missions_with_def,
    find_mission_def,
    ensure_daily_missions,
)
from rewards import level_from_xp  # 👈 usar o cálculo de level


router = APIRouter(prefix="/daily-missions", tags=["Missões diárias"])


class DailyMissionOut(BaseModel):
    code: str
    title: str
    description: str
    target: int
    xp_reward: int
    coins_reward: int
    kind: str

    progress: int
    completed: bool
    claimed: bool
    mission_date: str


@router.get("", response_model=List[DailyMissionOut])
def listar_missoes(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Retorna as missões de HOJE do usuário, com progresso e recompensas.
    A própria get_missions_with_def garante criar as missões de hoje,
    se ainda não existirem.
    """
    data = get_missions_with_def(session, current_user.id)
    return data


@router.get("/today", response_model=List[DailyMissionOut])
def listar_missoes_hoje(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Mesma coisa que o GET /daily-missions.
    Endpoint separado só pra ficar semântico no front.
    """
    data = get_missions_with_def(session, current_user.id)
    return data


@router.post("/{code}/claim", response_model=DailyMissionOut)
def resgatar_missao(
    code: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Marca uma missão como 'claimed' e dá XP + coins pro usuário.
    """
    mdef = find_mission_def(code)
    if not mdef:
        raise HTTPException(status_code=404, detail="Missão não encontrada.")

    # garante que existem as missões de HOJE (usa só session + user_id)
    missions = ensure_daily_missions(session, current_user.id)

    # procura a missão de hoje com esse code
    mission = next((m for m in missions if m.code == code), None)
    if not mission:
        raise HTTPException(
            status_code=404,
            detail="Missão de hoje não encontrada."
        )

    if not mission.completed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missão ainda não foi concluída."
        )

    if mission.claimed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recompensa desta missão já foi resgatada."
        )

    # --- aplica recompensa ---
    current_user.xp += mdef.xp_reward
    current_user.coins += mdef.coins_reward

    # 🔥 recalcula o nível com base no XP total
    current_user.level = level_from_xp(current_user.xp)

    mission.claimed = True

    session.add(current_user)
    session.add(mission)
    session.commit()
    session.refresh(mission)
    session.refresh(current_user)

    return {
        "code": mdef.code,
        "title": mdef.title,
        "description": mdef.description,
        "target": mdef.target,
        "xp_reward": mdef.xp_reward,
        "coins_reward": mdef.coins_reward,
        "kind": mdef.kind,
        "progress": mission.progress,
        "completed": mission.completed,
        "claimed": mission.claimed,
        "mission_date": str(mission.mission_date),
    }
