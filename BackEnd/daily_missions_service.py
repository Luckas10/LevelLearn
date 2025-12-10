# daily_missions_service.py
from datetime import date
from typing import List, Optional
import hashlib

from sqlmodel import Session, select

from models import UserDailyMission, User
from daily_missions_config import DAILY_MISSIONS, DailyMissionDef


# ========= AGRUPAR DEFINIÇÕES POR TIPO (kind) =========

# ex:
# {
#   "pomodoro_minutes": [DailyMissionDef(...), DailyMissionDef(...)]
#   "flashcards_answered": [...],
#   ...
# }
MISSIONS_BY_KIND: dict[str, list[DailyMissionDef]] = {}
for m in DAILY_MISSIONS:
    MISSIONS_BY_KIND.setdefault(m.kind, []).append(m)

# ordem fixa dos tipos: 4 missões por dia, 1 de cada
KINDS_ORDER = [
    "pomodoro_minutes",
    "flashcards_answered",
    "study_minutes",
    "deck_sessions",
]


def _stable_choice(defs: list[DailyMissionDef], user_id: int, day: date, kind: str) -> DailyMissionDef:
    """
    Escolha determinística baseada em user + dia + tipo.
    Assim o usuário vê sempre as mesmas missões naquele dia,
    mesmo recarregando a página.
    """
    seed_str = f"{user_id}-{day.isoformat()}-{kind}"
    h = hashlib.sha256(seed_str.encode("utf-8")).hexdigest()
    idx = int(h, 16) % len(defs)
    return defs[idx]


# ========= FUNÇÕES PÚBLICAS USADAS PELO RESTO DO CÓDIGO =========


def ensure_daily_missions(session: Session, user_id: int) -> List[UserDailyMission]:
    """
    Garante que o usuário tenha as missões de HOJE criadas.
    Agora a regra é:
      - no máximo 4 missões
      - 1 missão por tipo (kind) definido em KINDS_ORDER

    Se já existirem missões hoje, apenas as retorna.
    """
    today = date.today()

    missions = session.exec(
        select(UserDailyMission).where(
            UserDailyMission.user_id == user_id,
            UserDailyMission.mission_date == today,
        )
    ).all()

    # se já existem missões de hoje, não recria – só retorna
    if missions:
        return missions

    instances: list[UserDailyMission] = []

    # criar 1 missão por tipo
    for kind in KINDS_ORDER:
        defs = MISSIONS_BY_KIND.get(kind, [])
        if not defs:
            # se por algum motivo não tiver definição desse tipo, pula
            continue

        chosen = _stable_choice(defs, user_id, today, kind)

        um = UserDailyMission(
            user_id=user_id,
            code=chosen.code,
            mission_date=today,
            target=chosen.target,
            progress=0,
            completed=False,
            claimed=False,
            # se seu modelo tiver esses campos, ótimo;
            # se não tiver, o construtor vai ignorar se não estiver no modelo.
            # title=chosen.title,
            # description=chosen.description,
            # xp_reward=chosen.xp_reward,
            # coins_reward=chosen.coins_reward,
            # kind=chosen.kind,
        )
        session.add(um)
        instances.append(um)

    session.commit()

    # recarrega pra ter id etc.
    for inst in instances:
        session.refresh(inst)

    return instances


def add_daily_progress(session: Session, user_id: int, kind: str, amount: int) -> None:
    """
    Incrementa o progresso das missões diárias de certo tipo (kind)
    em 'amount' unidades (minutos ou quantidade, dependendo).

    Exemplo:
        add_daily_progress(session, user_id, "flashcards_answered", 10)
    """
    if amount <= 0:
        return

    missions = ensure_daily_missions(session, user_id)

    for um in missions:
        # pega definição associada a esse code
        mdef = find_mission_def(um.code)
        if not mdef:
            continue

        # só atualiza missões do tipo certo
        if mdef.kind != kind:
            continue

        # não mexe em missão já concluída e resgatada
        if um.claimed:
            continue

        um.progress += amount
        if um.progress >= mdef.target:
            um.completed = True

    session.commit()


def get_missions_with_def(session: Session, user_id: int):
    """
    Retorna lista de dicionários juntando definição (XP, coins, texto)
    com o estado do usuário (progress, completed, claimed).
    Agora considera SOMENTE as missões criadas para hoje (no máximo 4).
    """
    missions = ensure_daily_missions(session, user_id)

    result = []
    for um in missions:
        mdef = find_mission_def(um.code)
        if not mdef:
            # se por algum motivo o code não estiver mais na config, pula
            continue

        result.append({
            "code": mdef.code,
            "title": mdef.title,
            "description": mdef.description,
            "target": mdef.target,
            "xp_reward": mdef.xp_reward,
            "coins_reward": mdef.coins_reward,
            "kind": mdef.kind,
            "progress": um.progress,
            "completed": um.completed,
            "claimed": um.claimed,
            "mission_date": str(um.mission_date),
        })

    return result


def find_mission_def(code: str) -> Optional[DailyMissionDef]:
    for mdef in DAILY_MISSIONS:
        if mdef.code == code:
            return mdef
    return None
