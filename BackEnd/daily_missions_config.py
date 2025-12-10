# daily_missions_config.py
from dataclasses import dataclass

@dataclass(frozen=True)
class DailyMissionDef:
    code: str
    title: str
    description: str
    target: int
    xp_reward: int
    coins_reward: int
    kind: str   # controla de onde vem o progresso


DAILY_MISSIONS: list[DailyMissionDef] = [
    # ========= POMODORO =========
    DailyMissionDef(
        code="POMO_25",
        title="Estudar 25 min (Pomodoro)",
        description="Complete pelo menos 25 minutos de foco em Pomodoro hoje.",
        target=25,               # minutos de foco
        xp_reward=60,
        coins_reward=25,
        kind="pomodoro_minutes",
    ),
    DailyMissionDef(
        code="POMO_50",
        title="Maratona de 50 min (Pomodoro)",
        description="Acumule 50 minutos de foco em Pomodoro em um dia.",
        target=50,
        xp_reward=120,
        coins_reward=45,
        kind="pomodoro_minutes",
    ),

    # ========= FLASHCARDS (quantidade) =========
    DailyMissionDef(
        code="FLASH_10",
        title="Responder 10 flashcards",
        description="Responda pelo menos 10 flashcards hoje.",
        target=10,               # quantidade de cards respondidos
        xp_reward=40,
        coins_reward=20,
        kind="flashcards_answered",
    ),
    DailyMissionDef(
        code="FLASH_30",
        title="Responder 30 flashcards",
        description="Mostre que está focado: responda 30 flashcards hoje.",
        target=30,
        xp_reward=90,
        coins_reward=40,
        kind="flashcards_answered",
    ),

    # ========= TEMPO TOTAL DE ESTUDO =========
    DailyMissionDef(
        code="STUDY_60",
        title="Estudar 60 min no total",
        description="Some 60 minutos de estudo (Pomodoro + flashcards).",
        target=60,               # minutos de estudo total
        xp_reward=80,
        coins_reward=35,
        kind="study_minutes",
    ),
    DailyMissionDef(
        code="STUDY_90",
        title="Sessão intensa de 90 min",
        description="Acumule 90 minutos de estudo no dia.",
        target=90,
        xp_reward=140,
        coins_reward=60,
        kind="study_minutes",
    ),

    # ========= SESSÕES DE DECKS =========
    DailyMissionDef(
        code="DECK_3",
        title="Responder decks 3 vezes",
        description="Complete sessões de flashcards em 3 momentos diferentes hoje.",
        target=3,                # número de sessões de flashcards
        xp_reward=70,
        coins_reward=30,
        kind="deck_sessions",    # novo tipo
    ),
    DailyMissionDef(
        code="DECK_5",
        title="Responder decks 5 vezes",
        description="Faça 5 sessões de flashcards em qualquer deck hoje.",
        target=5,
        xp_reward=130,
        coins_reward=55,
        kind="deck_sessions",
    ),
]
