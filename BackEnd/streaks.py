# streaks.py
from datetime import date
from models import User


def update_daily_streak(user: User) -> None:
    """
    Atualiza a sequência diária (combo) ao estilo Duolingo:

    - Se nunca estudou: combo = 1, last_streak_date = hoje
    - Se já contou hoje: não mexe
    - Se estudou ontem: combo += 1
    - Se ficou 2+ dias sem estudar: combo volta pra 1

    Sempre atualiza também o best_streak.
    """
    today = date.today()

    # nunca teve streak antes
    if user.last_streak_date is None:
        user.combo = 1
        user.last_streak_date = today
        user.best_streak = max(user.best_streak, user.combo)
        return

    # já contou streak hoje -> não faz nada
    if user.last_streak_date == today:
        return

    delta_days = (today - user.last_streak_date).days

    if delta_days == 1:
        # estudou ontem -> continua a sequência
        user.combo += 1
    else:
        # ficou 2+ dias sem estudar -> recomeça em 1
        user.combo = 1

    user.last_streak_date = today

    if user.combo > user.best_streak:
        user.best_streak = user.combo
