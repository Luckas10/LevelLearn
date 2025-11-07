import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./Friends.css";

const MOCK_FRIENDS = [
    { id: 1, username: "alice_dev", level: 21, achievements: 36 },
    { id: 2, username: "mat_pomodoro", level: 17, achievements: 22 },
    { id: 3, username: "renecode", level: 34, achievements: 58 },
    { id: 4, username: "nath_js", level: 12, achievements: 11 },
    { id: 5, username: "andre.sql", level: 27, achievements: 41 },
    { id: 6, username: "gabi.ui", level: 9, achievements: 6 },
];

const MOCK_REQUESTS = [
    { id: 101, username: "julio.full", level: 7, achievements: 5 },
    { id: 102, username: "mateus.table", level: 15, achievements: 18 },
];

const MOCK_USERS = [
    ...MOCK_FRIENDS,
    ...MOCK_REQUESTS,
    { id: 201, username: "pixel.cat", level: 5, achievements: 3 },
    { id: 202, username: "ifrn.caico", level: 40, achievements: 72 },
    { id: 203, username: "vue3.tails", level: 19, achievements: 24 },
];

export function Friends() {
    const [activeTab, setActiveTab] = useState("friends"); // 'friends' | 'requests' | 'add'
    const [query, setQuery] = useState("");
    const [friends, setFriends] = useState(MOCK_FRIENDS);
    const [requests, setRequests] = useState(MOCK_REQUESTS);

    const filteredFriends = useMemo(() => {
        if (!query.trim()) return friends;
        const q = query.toLowerCase();
        return friends.filter((f) => f.username.toLowerCase().includes(q));
    }, [friends, query]);

    const addableUsers = useMemo(() => {
        const notAlready =
            MOCK_USERS.filter(
                (u) => !friends.some((f) => f.id === u.id) && !requests.some((r) => r.id === u.id)
            );
        if (!query.trim()) return notAlready;
        const q = query.toLowerCase();
        return notAlready.filter((u) => u.username.toLowerCase().includes(q));
    }, [friends, requests, query]);

    function acceptRequest(id) {
        const req = requests.find((r) => r.id === id);
        if (!req) return;
        setRequests((prev) => prev.filter((r) => r.id !== id));
        setFriends((prev) => [...prev, req]);
    }

    function declineRequest(id) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
    }

    function sendRequest(id) {
        const user = MOCK_USERS.find((u) => u.id === id);
        if (!user) return;
        setRequests((prev) => [...prev, user]);
    }

    return (
        <div className="friends-page">
            <Sidebar />
            <section className="friends">
                <Navbar />

                {/* Tabs */}
                <div className="friendsTabs" role="tablist" aria-label="Gerenciar amigos">
                    <button
                        role="tab"
                        aria-selected={activeTab === "friends"}
                        className={`friendsTab ${activeTab === "friends" ? "active" : ""}`}
                        onClick={() => {
                            setQuery("");
                            setActiveTab("friends");
                        }}
                    >
                        Meus Amigos
                    </button>
                    <button
                        role="tab"
                        aria-selected={activeTab === "requests"}
                        className={`friendsTab ${activeTab === "requests" ? "active" : ""}`}
                        onClick={() => {
                            setQuery("");
                            setActiveTab("requests");
                        }}
                    >
                        Solicitações <span className="pill">{requests.length}</span>
                    </button>
                    <button
                        role="tab"
                        aria-selected={activeTab === "add"}
                        className={`friendsTab ${activeTab === "add" ? "active" : ""}`}
                        onClick={() => {
                            setQuery("");
                            setActiveTab("add");
                        }}
                    >
                        Adicionar Amigos
                    </button>
                </div>

                {/* Search */}
                <div className="friendsSearch">
                    <i className="fa-regular fa-search searchIcon" aria-hidden="true"></i>
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
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                {/* Content */}
                <div className="friendsContent">
                    {activeTab === "friends" && (
                        <CardsGrid
                            emptyText="Você ainda não tem amigos por aqui."
                            data={filteredFriends}
                            renderItem={(f) => (
                                <FriendCard key={f.id} username={f.username} level={f.level} achievements={f.achievements} />
                            )}
                        />
                    )}

                    {activeTab === "requests" && (
                        <CardsGrid
                            emptyText="Sem novas solicitações no momento."
                            data={requests.filter((r) =>
                                r.username.toLowerCase().includes(query.toLowerCase())
                            )}
                            renderItem={(r) => (
                                <RequestCard
                                    key={r.id}
                                    username={r.username}
                                    level={r.level}
                                    achievements={r.achievements}
                                    onAccept={() => acceptRequest(r.id)}
                                    onDecline={() => declineRequest(r.id)}
                                />
                            )}
                        />
                    )}

                    {activeTab === "add" && (
                        <CardsGrid
                            emptyText="Nenhum usuário encontrado."
                            data={addableUsers}
                            renderItem={(u) => (
                                <AddCard
                                    key={u.id}
                                    username={u.username}
                                    level={u.level}
                                    achievements={u.achievements}
                                    onAdd={() => sendRequest(u.id)}
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
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((s) => s[0]?.toUpperCase())
        .join("");
    return (
        <div className="avatar" aria-hidden="true">
            {initials || "LL"}
        </div>
    );
}

function FriendCard({ username, level, achievements }) {
    return (
        <article className="card" tabIndex={0}>
            <div className="cardHeader">
                <InitialsAvatar username={username} />
                <div className="userInfo">
                    <h3 className="userName">{username}</h3>
                    <p className="meta">LVL: {level} • Conquistas: {achievements}</p>
                </div>
            </div>

            <div className="cardFooter">
                <button className="btn ghost">
                    <i className="fa-regular fa-message"></i> Mensagem
                </button>
                <button className="btn ghost">
                    <i className="fa-regular fa-user-check"></i> Perfil
                </button>
            </div>
        </article>
    );
}

function RequestCard({ username, level, achievements, onAccept, onDecline }) {
    return (
        <article className="card" tabIndex={0}>
            <div className="cardHeader">
                <InitialsAvatar username={username} />
                <div className="userInfo">
                    <h3 className="userName">{username}</h3>
                    <p className="meta">LVL: {level} • Conquistas: {achievements}</p>
                </div>
            </div>

            <div className="cardFooter">
                <button className="btn success" onClick={onAccept}>
                    <i className="fa-regular fa-check"></i> Aceitar
                </button>
                <button className="btn danger" onClick={onDecline}>
                    <i className="fa-regular fa-xmark"></i> Recusar
                </button>
            </div>
        </article>
    );
}

function AddCard({ username, level, achievements, onAdd }) {
    return (
        <article className="card" tabIndex={0}>
            <div className="cardHeader">
                <InitialsAvatar username={username} />
                <div className="userInfo">
                    <h3 className="userName">{username}</h3>
                    <p className="meta">LVL: {level} • Conquistas: {achievements}</p>
                </div>
            </div>

            <div className="cardFooter">
                <button className="btn primary" onClick={onAdd}>
                    <i className="fa-regular fa-user-plus"></i> Enviar solicitação
                </button>
            </div>
        </article>
    );
}

function CardsGrid({ data, renderItem, emptyText }) {
    if (!data?.length) {
        return <p className="emptyState">{emptyText}</p>;
    }
    return <div className="grid">{data.map(renderItem)}</div>;
}
