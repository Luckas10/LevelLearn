import { useMemo, useState } from "react";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tabs from "../components/Tabs"; // caminho conforme sua estrutura
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

    const tabOptions = [
        { value: "friends", label: "MEUS AMIGOS" },
        { value: "requests", label: "SOLICITAÇÕES", pill: requests.length },
        { value: "add", label: "ADICIONAR AMIGOS" },
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

                {/* Tabs */}
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
        <div className="friends-avatar" aria-hidden="true">
            {initials || "LL"}
        </div>
    );
}

function FriendCard({ username, level, achievements }) {
    return (
        <article className="friends-card" tabIndex={0}>
            <div className="friends-cardHeader">
                <InitialsAvatar username={username} />
                <div className="friends-userInfo">
                    <h3 className="friends-userName">{username}</h3>
                    <p className="friends-meta">
                        LVL: {level} • Conquistas: {achievements}
                    </p>
                </div>
            </div>
        </article>
    );
}

function RequestCard({ username, level, achievements, onAccept, onDecline }) {
    return (
        <article className="friends-card" tabIndex={0}>
            <div className="friends-cardHeader">
                <InitialsAvatar username={username} />
                <div className="friends-userInfo">
                    <h3 className="friends-userName">{username}</h3>
                    <p className="friends-meta">
                        LVL: {level} • Conquistas: {achievements}
                    </p>
                </div>
            </div>

            <div className="friends-cardFooter">
                <button
                    className="friends-btn friends-btn--success"
                    onClick={onAccept}
                >
                    <FontAwesomeIcon icon={fas.faCheck} className="btnIcon" />
                    <span>Aceitar</span>
                </button>
                <button
                    className="friends-btn friends-btn--danger"
                    onClick={onDecline}
                >
                    <FontAwesomeIcon icon={fas.faXmark} className="btnIcon" />
                    <span>Recusar</span>
                </button>
            </div>
        </article>
    );
}


function AddCard({ username, level, achievements, onAdd }) {
    return (
        <article className="friends-card" tabIndex={0}>
            <div className="friends-cardHeader">
                <InitialsAvatar username={username} />
                <div className="friends-userInfo">
                    <h3 className="friends-userName">{username}</h3>
                    <p className="friends-meta">
                        LVL: {level} • Conquistas: {achievements}
                    </p>
                </div>
            </div>

            <div className="friends-cardFooter">
                <button
                    className="friends-btn friends-btn--primary"
                    onClick={onAdd}
                >
                    <FontAwesomeIcon icon={fas.faUserPlus} className="btnIcon" />
                    <span>Enviar solicitação</span>
                </button>
            </div>
        </article>
    );
}


function CardsGrid({ data, renderItem, emptyText }) {
    if (!data?.length) {
        return <p className="friends-emptyState">{emptyText}</p>;
    }
    return <div className="friends-grid">{data.map(renderItem)}</div>;
}

