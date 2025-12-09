# events.py
from datetime import datetime, timedelta
from sqlalchemy import event
from sqlmodel import Session, select

from models import (
    Deck,
    PomodoroSession,
    FlashcardSession,
    User,
    Friendship,
    Card,
)
from achievements_service import grant_achievement
from rewards import calc_flashcard_rewards, calc_pomodoro_rewards


# =========================
# Helpers de data
# =========================

def get_today_range(ref: datetime | None = None):
    """Retorna o início e fim (exclusivo) do dia de ref em UTC."""
    now = ref or datetime.utcnow()
    start = datetime(year=now.year, month=now.month, day=now.day)
    end = start + timedelta(days=1)
    return start, end


def get_week_start_end(ref: datetime | None = None):
    """Semana começando na segunda-feira."""
    now = ref or datetime.utcnow()
    start = datetime(year=now.year, month=now.month, day=now.day)
    # weekday(): 0 = segunda, 6 = domingo
    start = start - timedelta(days=start.weekday())
    end = start + timedelta(days=7)
    return start, end


# =========================
# 1) Conquista: "Primeiro Deck"
# =========================

@event.listens_for(Deck, "after_insert")
def achievement_first_deck(mapper, connection, target: Deck):
    with Session(bind=connection) as session:
        # Missão: "Primeiro Deck"
        grant_achievement(
            session,
            user_id=target.owner_id,
            achievement_name="Primeiro Deck"
        )
        session.commit()


# =========================
# 2) Conquista: "Primeiro Pomodoro"
# =========================

@event.listens_for(PomodoroSession, "after_insert")
def achievement_first_pomodoro(mapper, connection, target: PomodoroSession):
    with Session(bind=connection) as session:
        # Missão: "Primeiro Pomodoro"
        grant_achievement(
            session,
            user_id=target.user_id,
            achievement_name="Primeiro Pomodoro"
        )
        session.commit()


# =====================================================
# 3) Missões ligadas a sessões de FLASHCARDS
#    (Aquecimento Rápido, Sem Errar, Maratona, etc.)
# =====================================================

@event.listens_for(FlashcardSession, "after_insert")
def flashcard_missions(mapper, connection, target: FlashcardSession):
    with Session(bind=connection) as session:
        user_id = target.user_id

        # 1) Aquecimento Rápido – >= 10 flashcards na sessão
        if target.total >= 10:
            grant_achievement(
                session,
                user_id=user_id,
                achievement_name="Aquecimento Rápido"
            )

        # 2) Sem Errar! – sessão com >= 8 flashcards e 100% de acerto
        if target.total >= 8 and target.correct == target.total:
            grant_achievement(
                session,
                user_id=user_id,
                achievement_name="Sem Errar!"
            )

        # 3) Maratona de Estudo – 50 flashcards no total no dia
        start, end = get_today_range(target.created_at)
        totals_today = session.exec(
            select(FlashcardSession.total).where(
                FlashcardSession.user_id == user_id,
                FlashcardSession.created_at >= start,
                FlashcardSession.created_at < end,
            )
        ).all()
        if sum(totals_today or []) >= 50:
            grant_achievement(
                session,
                user_id=user_id,
                achievement_name="Maratona de Estudo"
            )

        # 4) Velocista da Memória – sessão de 20 flashcards
        # (sem tempo real ainda, aproximando pela quantidade)
        if target.total >= 20:
            grant_achievement(
                session,
                user_id=user_id,
                achievement_name="Velocista da Memória"
            )

        # 5) Revisão Obrigatória – revisar deck não estudado há 7+ dias
        last_old = session.exec(
            select(FlashcardSession)
            .where(
                FlashcardSession.user_id == user_id,
                FlashcardSession.deck_id == target.deck_id,
                FlashcardSession.id != target.id,
                FlashcardSession.created_at < target.created_at,
            )
            .order_by(FlashcardSession.created_at.desc())
        ).first()

        if last_old:
            diff_days = (target.created_at - last_old.created_at).days
            if diff_days >= 7:
                grant_achievement(
                    session,
                    user_id=user_id,
                    achievement_name="Revisão Obrigatória"
                )

        # 14) Interdisciplinar – estudar 3 coleções diferentes no mesmo dia
        deck_ids_today = session.exec(
            select(FlashcardSession.deck_id).where(
                FlashcardSession.user_id == user_id,
                FlashcardSession.created_at >= start,
                FlashcardSession.created_at < end,
            )
        ).all()
        if len(set(deck_ids_today or [])) >= 3:
            grant_achievement(
                session,
                user_id=user_id,
                achievement_name="Interdisciplinar"
            )

        # 15) Revisão Salva-Vidas – acertar ≥ 15 flashcards em uma coleção já estudada antes
        if target.correct >= 15 and last_old:
            grant_achievement(
                session,
                user_id=user_id,
                achievement_name="Revisão Salva-Vidas"
            )

        # 11) Dia Produtivo – ganhar pelo menos 200 XP no dia
        # Recalcula o XP do dia pelas sessões (flashcard + pomodoro)
        flash_sessions_today = session.exec(
            select(FlashcardSession).where(
                FlashcardSession.user_id == user_id,
                FlashcardSession.created_at >= start,
                FlashcardSession.created_at < end,
            )
        ).all() or []

        pom_sessions_today = session.exec(
            select(PomodoroSession).where(
                PomodoroSession.user_id == user_id,
                PomodoroSession.created_at >= start,
                PomodoroSession.created_at < end,
            )
        ).all() or []

        xp_from_flash = sum(
            calc_flashcard_rewards(s.correct, s.total)[0] for s in flash_sessions_today
        )
        xp_from_pomodoro = sum(
            calc_pomodoro_rewards(
                s.focus_minutes,
                s.short_break_minutes,
                s.long_break_minutes,
            )[0]
            for s in pom_sessions_today
        )
        xp_today = xp_from_flash + xp_from_pomodoro

        if xp_today >= 200:
            grant_achievement(
                session,
                user_id=user_id,
                achievement_name="Dia Produtivo"
            )

        # 12) Especialista da Semana – estudar em 5 dias diferentes da semana
        week_start, week_end = get_week_start_end(target.created_at)

        flash_week = session.exec(
            select(FlashcardSession.created_at).where(
                FlashcardSession.user_id == user_id,
                FlashcardSession.created_at >= week_start,
                FlashcardSession.created_at < week_end,
            )
        ).all() or []

        pom_week = session.exec(
            select(PomodoroSession.created_at).where(
                PomodoroSession.user_id == user_id,
                PomodoroSession.created_at >= week_start,
                PomodoroSession.created_at < week_end,
            )
        ).all() or []

        dates = {dt.date() for dt in flash_week + pom_week}
        if len(dates) >= 5:
            grant_achievement(
                session,
                user_id=user_id,
                achievement_name="Especialista da Semana"
            )

        session.commit()


# =====================================================
# 4) Missões ligadas a sessões de POMODORO
#    (Primeiro Ciclo, Foco Inquebrável, etc.)
# =====================================================

@event.listens_for(PomodoroSession, "after_insert")
def pomodoro_missions(mapper, connection, target: PomodoroSession):
    with Session(bind=connection) as session:
        user_id = target.user_id

        F = max(target.focus_minutes, 0)
        B_s = max(target.short_break_minutes, 0)
        B_l = max(target.long_break_minutes, 0)
        B = B_s + B_l

        # Reutilizar faixa do dia
        start, end = get_today_range(target.created_at)

        # 6) Primeiro Ciclo do Dia – F >= 25
        if F >= 25:
            grant_achievement(
                session,
                user_id=user_id,
                achievement_name="Primeiro Ciclo do Dia"
            )

        # 7) Foco Inquebrável – F >= 50
        if F >= 50:
            grant_achievement(
                session,
                user_id=user_id,
                achievement_name="Foco Inquebrável"
            )

        # 8) Tríplice Pomodoro – 3 sessões no mesmo dia
        pomodoros_today = session.exec(
            select(PomodoroSession.id).where(
                PomodoroSession.user_id == user_id,
                PomodoroSession.created_at >= start,
                PomodoroSession.created_at < end,
            )
        ).all()
        if len(pomodoros_today or []) >= 3:
            grant_achievement(
                session,
                user_id=user_id,
                achievement_name="Tríplice Pomodoro"
            )

        # 9) Descanso Controlado – foco/(foco+pausas) >= 70%
        total_time = F + B
        if total_time > 0:
            q = F / total_time
            if q >= 0.70:
                grant_achievement(
                    session,
                    user_id=user_id,
                    achievement_name="Descanso Controlado"
                )

        # 10) Sessão de Resistência – 120 min de foco no dia
        focus_today = session.exec(
            select(PomodoroSession.focus_minutes).where(
                PomodoroSession.user_id == user_id,
                PomodoroSession.created_at >= start,
                PomodoroSession.created_at < end,
            )
        ).all()
        if sum(focus_today or []) >= 120:
            grant_achievement(
                session,
                user_id=user_id,
                achievement_name="Sessão de Resistência"
            )

        # 11) Dia Produtivo – mesma lógica de cima (XP >= 200)
        flash_sessions_today = session.exec(
            select(FlashcardSession).where(
                FlashcardSession.user_id == user_id,
                FlashcardSession.created_at >= start,
                FlashcardSession.created_at < end,
            )
        ).all() or []

        pom_sessions_today = session.exec(
            select(PomodoroSession).where(
                PomodoroSession.user_id == user_id,
                PomodoroSession.created_at >= start,
                PomodoroSession.created_at < end,
            )
        ).all() or []

        xp_from_flash = sum(
            calc_flashcard_rewards(s.correct, s.total)[0] for s in flash_sessions_today
        )
        xp_from_pomodoro = sum(
            calc_pomodoro_rewards(
                s.focus_minutes,
                s.short_break_minutes,
                s.long_break_minutes,
            )[0]
            for s in pom_sessions_today
        )
        xp_today = xp_from_flash + xp_from_pomodoro

        if xp_today >= 200:
            grant_achievement(
                session,
                user_id=user_id,
                achievement_name="Dia Produtivo"
            )

        # 12) Especialista da Semana – mesma lógica do outro listener
        week_start, week_end = get_week_start_end(target.created_at)

        flash_week = session.exec(
            select(FlashcardSession.created_at).where(
                FlashcardSession.user_id == user_id,
                FlashcardSession.created_at >= week_start,
                FlashcardSession.created_at < week_end,
            )
        ).all() or []

        pom_week = session.exec(
            select(PomodoroSession.created_at).where(
                PomodoroSession.user_id == user_id,
                PomodoroSession.created_at >= week_start,
                PomodoroSession.created_at < week_end,
            )
        ).all() or []

        dates = {dt.date() for dt in flash_week + pom_week}
        if len(dates) >= 5:
            grant_achievement(
                session,
                user_id=user_id,
                achievement_name="Especialista da Semana"
            )

        session.commit()


# =====================================================
# 5) Missões de CRIAÇÃO/EDIÇÃO DE CARDS
#    (Toque do Mestre – 5 cards custom)
# =====================================================

@event.listens_for(Card, "after_insert")
def card_missions(mapper, connection, target: Card):
    if not target.is_custom:
        return

    with Session(bind=connection) as session:
        # Descobrir o dono via deck
        deck = session.get(Deck, target.deck_id)
        if not deck:
            return

        user_id = deck.owner_id

        # 13) Toque do Mestre – ter pelo menos 5 cards personalizados no total
        from .models import Card as CardModel, Deck as DeckModel  # evitar confusão

        custom_count = session.exec(
            select(CardModel)
            .join(DeckModel, DeckModel.id == CardModel.deck_id)
            .where(
                DeckModel.owner_id == user_id,
                CardModel.is_custom == True,  # noqa: E712
            )
        ).all()

        if len(custom_count or []) >= 5:
            grant_achievement(
                session,
                user_id=user_id,
                achievement_name="Toque do Mestre"
            )

        session.commit()


# =====================================================
# 6) Missões SOCIAIS (amizade)
#    (Novo Companheiro)
# =====================================================

@event.listens_for(Friendship, "after_insert")
def social_missions(mapper, connection, target: Friendship):
    with Session(bind=connection) as session:
        # 16) Novo Companheiro – enviar ou receber 1 pedido de amizade
        grant_achievement(
            session,
            user_id=target.user_id,
            achievement_name="Novo Companheiro"
        )
        grant_achievement(
            session,
            user_id=target.friend_id,
            achievement_name="Novo Companheiro"
        )

        session.commit()


# =====================================================
# 7) Missões de PROGRESSO / ECONOMIA (coins, nível)
#    - Cofre Preenchido (300 moedas no dia)
#    - Subindo de Nível (2 níveis no dia – aqui simplificado)
# =====================================================

@event.listens_for(User, "after_update")
def progress_missions(mapper, connection, target: User):
    with Session(bind=connection) as session:
        user_id = target.id

        # 18) Cofre Preenchido – 300 moedas no dia
        # Aqui usamos o mesmo cálculo baseado nas sessões
        now = datetime.utcnow()
        start, end = get_today_range(now)

        flash_sessions_today = session.exec(
            select(FlashcardSession).where(
                FlashcardSession.user_id == user_id,
                FlashcardSession.created_at >= start,
                FlashcardSession.created_at < end,
            )
        ).all() or []

        pom_sessions_today = session.exec(
            select(PomodoroSession).where(
                PomodoroSession.user_id == user_id,
                PomodoroSession.created_at >= start,
                PomodoroSession.created_at < end,
            )
        ).all() or []

        coins_from_flash = sum(
            calc_flashcard_rewards(s.correct, s.total)[1] for s in flash_sessions_today
        )
        coins_from_pomodoro = sum(
            calc_pomodoro_rewards(
                s.focus_minutes,
                s.short_break_minutes,
                s.long_break_minutes,
            )[1]
            for s in pom_sessions_today
        )
        coins_today = coins_from_flash + coins_from_pomodoro

        if coins_today >= 300:
            grant_achievement(
                session,
                user_id=user_id,
                achievement_name="Cofre Preenchido"
            )

        # 19) Subindo de Nível – aqui fica simplificado:
        # se nível atual for >= 2 e o usuário já tiver pelo menos 1 sessão hoje,
        # consideramos que ele subiu o suficiente no dia.
        # (Para algo exato, precisaria registrar histórico de nível.)
        if target.level >= 2:
            any_session_today = session.exec(
                select(FlashcardSession.id).where(
                    FlashcardSession.user_id == user_id,
                    FlashcardSession.created_at >= start,
                    FlashcardSession.created_at < end,
                )
            ).first() or session.exec(
                select(PomodoroSession.id).where(
                    PomodoroSession.user_id == user_id,
                    PomodoroSession.created_at >= start,
                    PomodoroSession.created_at < end,
                )
            ).first()

            if any_session_today:
                grant_achievement(
                    session,
                    user_id=user_id,
                    achievement_name="Subindo de Nível"
                )

        session.commit()


# =====================================================
# 8) Conquista: XP >= 1000 ("Novato Lendário")
# =====================================================

@event.listens_for(User, "after_update")
def achievement_xp_1000(mapper, connection, target: User):
    if target.xp < 1000:
        return

    with Session(bind=connection) as session:
        grant_achievement(
            session,
            user_id=target.id,
            achievement_name="Novato Lendário"
        )
        session.commit()
