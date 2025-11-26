from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from typing import List
from models import Friendship, User
from database import SessionDep
from routers.auth import get_current_user

router = APIRouter(prefix="/friends", tags=["Amizades"])

@router.post("/request/{friend_id}")
def send_friend_request(
    friend_id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    if friend_id == current_user.id:
        raise HTTPException(status_code=400, detail="Você não pode adicionar a si mesmo.")

    friend = session.exec(select(User).where(User.id == friend_id)).first()
    if not friend:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    existing = session.exec(
        select(Friendship).where(
            ((Friendship.user_id == current_user.id) & (Friendship.friend_id == friend_id)) |
            ((Friendship.user_id == friend_id) & (Friendship.friend_id == current_user.id))
        )
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Solicitação já existe ou já são amigos.")

    friendship = Friendship(
        user_id=current_user.id,
        friend_id=friend_id,
        accepted=False
    )

    session.add(friendship)
    session.commit()
    session.refresh(friendship)

    return {"status": "Solicitação enviada.", "data": friendship}

@router.post("/accept/{request_id}")
def accept_friend_request(
    request_id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    friendship = session.exec(
        select(Friendship).where(Friendship.id == request_id)
    ).first()

    if not friendship:
        raise HTTPException(status_code=404, detail="Solicitação não encontrada.")

    if friendship.friend_id != current_user.id:
        raise HTTPException(status_code=403, detail="Você não pode aceitar esta solicitação.")

    friendship.accepted = True
    session.add(friendship)
    session.commit()
    session.refresh(friendship)

    return {"status": "Amizade aceita.", "data": friendship}

@router.delete("/reject/{request_id}")
def reject_friend_request(
    request_id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    friendship = session.exec(
        select(Friendship).where(Friendship.id == request_id)
    ).first()

    if not friendship:
        raise HTTPException(status_code=404, detail="Solicitação não encontrada.")

    if friendship.friend_id != current_user.id:
        raise HTTPException(status_code=403, detail="Você não pode recusar esta solicitação.")

    session.delete(friendship)
    session.commit()

    return {"status": "Solicitação recusada."}

@router.get("/requests/received")
def list_received_requests(
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    requests = session.exec(
        select(Friendship)
        .where(Friendship.friend_id == current_user.id)
        .where(Friendship.accepted == False)
    ).all()

    result = []

    for r in requests:
        sender = r.requester

        result.append({
            "request_id": r.id,
            "id": sender.id,
            "username": sender.username,
            "email": sender.email,
            "level": sender.level,
            "xp": sender.xp,
            "coins": sender.coins,
            "combo": sender.combo,
            "achievements": sender.achievements
        })

    return result

@router.get("/requests/sent")
def list_sent_requests(
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    return session.exec(
        select(Friendship)
        .where(Friendship.user_id == current_user.id)
        .where(Friendship.accepted == False)
    ).all()

@router.get("/my_friends")
def my_friends(
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    friendships = session.exec(
        select(Friendship).where(
            (Friendship.accepted == True) & (
                (Friendship.user_id == current_user.id) |
                (Friendship.friend_id == current_user.id)
            )
        )
    ).all()

    friends_list = []

    for fr in friendships:
        if fr.user_id == current_user.id:
            friends_list.append(fr.receiver)
        else:
            friends_list.append(fr.requester)

    return friends_list

@router.delete("/remove/{friend_id}")
def remove_friend(
    friend_id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    friendship = session.exec(
        select(Friendship).where(
            (Friendship.accepted == True) & (
                ((Friendship.user_id == current_user.id) & (Friendship.friend_id == friend_id)) |
                ((Friendship.user_id == friend_id) & (Friendship.friend_id == current_user.id))
            )
        )
    ).first()

    if not friendship:
        raise HTTPException(status_code=404, detail="Vocês não são amigos.")

    session.delete(friendship)
    session.commit()

    return {"status": "Amizade removida."}

@router.get("/unavailable_ids")
def unavailable_friend_ids(
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    friendships = session.exec(
        select(Friendship).where(
            (Friendship.user_id == current_user.id) |
            (Friendship.friend_id == current_user.id)
        )
    ).all()

    blocked_ids = {current_user.id}

    for f in friendships:
        blocked_ids.add(f.user_id)
        blocked_ids.add(f.friend_id)

    return list(blocked_ids)
