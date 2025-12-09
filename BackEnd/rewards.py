# rewards.py
import math

# ==========================
# RECOMPENSAS (XP / OURO)
# ==========================

def calc_flashcard_rewards(correct: int, total: int) -> tuple[int, int]:
    if total <= 0 or correct <= 0:
        return 0, 0

    acc = correct / total  # acurácia 0..1
    D = 1.0                # multiplicador de dificuldade, se quiser

    # XP “quase linear”
    xp = int(correct * 10 * (0.5 + 0.5 * acc) * D)

    # Ouro com curva log
    O_max = 70   # máximo de ouro na sessão
    C_ref = 50   # acertos onde quase encosta no limite

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


# ==========================
# SISTEMA DE LEVEL
# ==========================

# XP base para cada "degrau" de level.
# Quanto maior, mais lento; quanto menor, mais rápido.
BASE_XP_PER_LEVEL = 60


def xp_threshold_for_level(level: int) -> int:
    """
    Retorna o XP total necessário para CHEGAR em um certo level.

    Fórmula: XP(L) = BASE * L * (L - 1) / 2
    """
    if level <= 1:
        return 0
    return int(BASE_XP_PER_LEVEL * level * (level - 1) / 2)


def level_from_xp(total_xp: int) -> int:
    """
    Converte o XP TOTAL acumulado do usuário em level.

    Usa a fórmula inversa aproximada da equação quadrática
    e depois ajusta para garantir que não passe do ponto.
    """
    if total_xp <= 0:
        return 1

    B = BASE_XP_PER_LEVEL

    # aproximação pela fórmula do segundo grau:
    # XP ≈ B * L*(L-1)/2  =>  L^2 - L - 2*XP/B = 0
    disc = 1 + 8 * (total_xp / B)
    approx = int((1 + math.sqrt(disc)) // 2)
    if approx < 1:
        approx = 1

    # ajusta pra baixo se tiver passado
    while approx > 1 and xp_threshold_for_level(approx) > total_xp:
        approx -= 1

    # ajusta pra cima se ainda couber mais um level
    while xp_threshold_for_level(approx + 1) <= total_xp:
        approx += 1

    return approx
