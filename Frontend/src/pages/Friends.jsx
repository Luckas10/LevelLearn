import { useEffect, useMemo, useState } from "react";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tabs from "../components/General/Tabs";
import Sidebar from "../components/General/Sidebar";
import Navbar from "../components/General/Navbar";
import "./Friends.css";

import api from "../services/api";

import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getReceivedRequests,
  getSentRequests,
  getMyFriends,
  removeFriend
} from "../services/friends";

export function Friends() {
  const [activeTab, setActiveTab] = useState("friends");
  const [query, setQuery] = useState("");

  const [friends, setFriends] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [users, setUsers] = useState([]);

  // -----------------------------
  // LOAD DATA
  // -----------------------------
  useEffect(() => {
    loadFriends();
    loadRequests();
  }, []);

  async function loadFriends() {
    const data = await getMyFriends();
    setFriends(data || []);
  }

  async function loadRequests() {
    const rec = await getReceivedRequests();
    const sent = await getSentRequests();
    setReceivedRequests(rec || []);
    setSentRequests(sent || []);
  }

  async function loadAllUsers() {
    try {
      // ESTE ENDPOINT JÁ REMOVE O USUÁRIO LOGADO
      const res = await api.get("/users/search");
      setUsers(res.data || []);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  }

  useEffect(() => {
    if (activeTab === "add") {
      loadAllUsers();
      loadRequests();
      loadFriends();
    }
  }, [activeTab]);

  // -----------------------------
  // ACTIONS
  // -----------------------------
  async function handleSendRequest(id) {
    await sendFriendRequest(id);
    await loadRequests();
  }

  async function handleAcceptRequest(requestId) {
    await acceptFriendRequest(requestId);
    await loadFriends();
    await loadRequests();
  }

  async function handleDeclineRequest(requestId) {
    await rejectFriendRequest(requestId);
    await loadRequests();
  }

  async function handleRemoveFriend(id) {
    await removeFriend(id);
    setFriends(prev => prev.filter(f => f.id !== id));
  }

  // -----------------------------
  // FILTERS
  // -----------------------------
  const filteredFriends = useMemo(() => {
    if (!query.trim()) return friends;
    const q = query.toLowerCase();
    return friends.filter(f => f.username.toLowerCase().includes(q));
  }, [friends, query]);

  const addableUsers = useMemo(() => {
    const notAllowedIds = new Set();

    friends.forEach(f => notAllowedIds.add(f.id));
    receivedRequests.forEach(r => notAllowedIds.add(r.id));
    sentRequests.forEach(s => notAllowedIds.add(s.friend_id));

    const filtered = users.filter(u => !notAllowedIds.has(u.id));

    if (!query.trim()) return filtered;
    const q = query.toLowerCase();
    return filtered.filter(u => u.username.toLowerCase().includes(q));
  }, [users, friends, receivedRequests, sentRequests, query]);

  const tabOptions = [
    { value: "friends", label: "MEUS AMIGOS" },
    { value: "requests", label: "SOLICITAÇÕES", pill: receivedRequests.length },
    { value: "add", label: "ADICIONAR AMIGOS" }
  ];

  function handleChangeTab(value) {
    setQuery("");
    setActiveTab(value);
  }

  return (
    <div className="friends-page">
      <Sidebar />
      <section className="friends">
        <Navbar />

        <Tabs
          options={tabOptions}
          selected={activeTab}
          onChange={handleChangeTab}
          rootClassName="friendsTabs"
          tabClassName="friendsTab"
          activeClassName="active"
          ariaLabel="Gerenciar amigos"
        />

        {/* Search */}
        <div className="friendsSearch">
          <FontAwesomeIcon size="lg" icon={fas.faSearch} className="searchIcon" />
          <input
            className="searchInput"
            placeholder={
              activeTab === "friends"
                ? "Buscar amigos..."
                : activeTab === "requests"
                ? "Filtrar solicitações..."
                : "Buscar usuários..."
            }
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        {/* Content */}
        <div className="friendsContent">
          {activeTab === "friends" && (
            <CardsGrid
              emptyText="Você ainda não tem amigos."
              data={filteredFriends}
              renderItem={f => (
                <FriendCard
                  key={f.id}
                  username={f.username}
                  level={f.level}
                  achievements={f.achievements}
                  onRemove={() => handleRemoveFriend(f.id)}
                />
              )}
            />
          )}

          {activeTab === "requests" && (
            <CardsGrid
              emptyText="Nenhuma solicitação."
              data={receivedRequests}
              renderItem={r => (
                <RequestCard
                  key={r.request_id}
                  username={r.username}
                  level={r.level}
                  achievements={r.achievements}
                  onAccept={() => handleAcceptRequest(r.request_id)}
                  onDecline={() => handleDeclineRequest(r.request_id)}
                />
              )}
            />
          )}

          {activeTab === "add" && (
            <CardsGrid
              emptyText="Nenhum usuário disponível."
              data={addableUsers}
              renderItem={u => (
                <AddCard
                  key={u.id}
                  username={u.username}
                  level={u.level}
                  achievements={u.achievements}
                  onAdd={() => handleSendRequest(u.id)}
                />
              )}
            />
          )}
        </div>
      </section>
    </div>
  );
}

function InitialsAvatar({ username }) {
  const initials = username
    ?.split(/[^a-zA-Z0-9]+/)
    ?.filter(Boolean)
    ?.slice(0, 2)
    ?.map(s => s[0]?.toUpperCase())
    ?.join("");

  return <div className="friends-avatar">{initials || "?"}</div>;
}

function FriendCard({ username, level, achievements, onRemove }) {
  return (
    <article className="friends-card">
      <div className="friends-cardHeader">
        <InitialsAvatar username={username} />
        <div className="friends-userInfo">
          <h3>{username}</h3>
          <p>LVL: {level} • Conquistas: {achievements}</p>
        </div>
      </div>

      <div className="friends-cardFooter">
        <button className="friends-btn friends-btn--danger" onClick={onRemove}>
          <FontAwesomeIcon icon={fas.faUserMinus} className="btnIcon" />
          Remover
        </button>
      </div>
    </article>
  );
}

function RequestCard({ username, level, achievements, onAccept, onDecline }) {
  return (
    <article className="friends-card">
      <div className="friends-cardHeader">
        <InitialsAvatar username={username} />
        <div className="friends-userInfo">
          <h3>{username}</h3>
          <p>LVL: {level} • Conquistas: {achievements}</p>
        </div>
      </div>

      <div className="friends-cardFooter">
        <button className="friends-btn friends-btn--success" onClick={onAccept}>
          <FontAwesomeIcon icon={fas.faCheck} className="btnIcon" />
          Aceitar
        </button>
        <button className="friends-btn friends-btn--danger" onClick={onDecline}>
          <FontAwesomeIcon icon={fas.faXmark} className="btnIcon" />
          Recusar
        </button>
      </div>
    </article>
  );
}

function AddCard({ username, level, achievements, onAdd }) {
  return (
    <article className="friends-card">
      <div className="friends-cardHeader">
        <InitialsAvatar username={username} />
        <div className="friends-userInfo">
          <h3>{username}</h3>
          <p>LVL: {level} • Conquistas: {achievements}</p>
        </div>
      </div>

      <div className="friends-cardFooter">
        <button className="friends-btn friends-btn--primary" onClick={onAdd}>
          <FontAwesomeIcon icon={fas.faUserPlus} className="btnIcon" />
          Enviar solicitação
        </button>
      </div>
    </article>
  );
}

function CardsGrid({ data, renderItem, emptyText }) {
  if (!data || !data.length) {
    return <p className="friends-emptyState">{emptyText}</p>;
  }
  return <div className="friends-grid">{data.map(renderItem)}</div>;
}
