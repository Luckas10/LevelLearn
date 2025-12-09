# rewards.py
import math

def calc_flashcard_rewards(correct: int, total: int) -> tuple[int, int]:
    if total <= 0 or correct <= 0:
        return 0, 0

    acc = correct / total  # acurácia 0..1
    D = 1.0                # multiplicador de dificuldade, se quiser

    # XP “quase linear”
    xp = int(correct * 10 * (0.5 + 0.5 * acc) * D)

    # Ouro com curva log
    O_max = 150   # máximo de ouro na sessão
    C_ref = 50    # acertos onde quase encosta no limite

    gold_raw = O_max * (math.log(1 + correct) / math.log(1 + C_ref))
    gold_raw *= (0.5 + 0.5 * acc)        # penaliza quem erra muito

    gold = int(min(O_max, gold_raw))

    return xp, gold


def calc_pomodoro_rewards(focus: int, short_break: int, long_break: int) -> tuple[int, int]:
    F = max(focus, 0)
    B_s = max(short_break, 0)
    B_l = max(long_break, 0)
    B = B_s + B_l

    if F <= 0:
        return 0, 0

    total = F + B
    q = F / total                 # proporção de foco

    # fator de qualidade entre ~0.6 e ~1.4
    q_factor = 0.8 + (q - 0.5) * 1.2
    q_factor = max(0.6, min(1.4, q_factor))

    xp = int(F * 4 * q_factor)
    gold = xp // 5

    return xp, gold
