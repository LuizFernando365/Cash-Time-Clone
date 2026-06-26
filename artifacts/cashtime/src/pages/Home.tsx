import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import BottomNav from "@/components/BottomNav";
import { api, type TaskWithCreator } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";

const filters = ["Todos", "Tech", "Entrega", "Casa", "Admin", "Criativo"];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  return `há ${Math.floor(h / 24)}d`;
}

export default function Home() {
  const [, navigate] = useLocation();
  const [activeFilter, setActiveFilter] = useState(0);
  const [tasks, setTasks] = useState<TaskWithCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getStoredUser();

  useEffect(() => {
    api.listTasks({ status: "open" }).then(setTasks).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === 0
    ? tasks
    : tasks.filter((t) => t.category === filters[activeFilter]);

  return (
    <>
      <div className="screen" style={{ paddingBottom: 80 }}>
        <div className="app-logo" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="logo-icon">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="logo-text">Cash<span style={{ color: "#9F67FF" }}>Time</span></span>
          </div>
          <div style={{ position: "relative" }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#7E7A9A" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <div className="notification-dot" />
          </div>
        </div>

        <div style={{ padding: "12px var(--hpad) 4px" }}>
          <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A" }}>
            Olá, <strong style={{ color: "#C4B5FD" }}>{user?.name.split(" ")[0] ?? "Usuário"}</strong> 👋
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(15px,4.5vw,19px)", fontWeight: 700, marginTop: 2 }}>Tarefas para você</div>
        </div>

        <div className="search-bar">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" stroke="#7E7A9A" strokeWidth="1.8" />
            <path d="M21 21l-4.35-4.35" stroke="#7E7A9A" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Buscar tarefas...
        </div>

        <div className="filter-chips">
          {filters.map((f, i) => (
            <div key={i} className={`chip ${activeFilter === i ? "active" : ""}`} onClick={() => setActiveFilter(i)}>
              {i === 0 ? f : `${["💻","📦","🏠","📝","🎨"][i - 1]} ${f}`}
            </div>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#7E7A9A" }}>Carregando tarefas...</div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px var(--hpad)", color: "#7E7A9A" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
            <div>Nenhuma tarefa encontrada</div>
          </div>
        )}

        {filtered.map((task) => (
          <div
            key={task.id}
            className={`card ${task.highlight ? "card-highlight" : ""}`}
            onClick={() => navigate(`/task/${task.id}`)}
            style={{ cursor: "pointer" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              {task.highlight ? (
                <>
                  <span className="pill" style={{ fontSize: 10 }}>⭐ Destaque</span>
                  <span className="pill pill-green">{task.categoryEmoji} {task.category}</span>
                </>
              ) : (
                <>
                  <span className="pill">{task.categoryEmoji} {task.category}</span>
                  <span style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#7E7A9A" }}>{timeAgo(task.createdAt)}</span>
                </>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div className="card-title">{task.title}</div>
                <div className="card-meta">
                  {!task.isRemote && (
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8" />
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  )}
                  {task.location}
                </div>
                {task.tags.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    {task.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                  </div>
                )}
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                <div className="card-price">R${task.price}</div>
                <span className="card-price-sub">{task.estimatedTime}</span>
              </div>
            </div>

            <div className="divider" style={{ margin: task.highlight ? "12px 0" : "10px 0" }} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <div className="avatar" style={{ background: task.creator.avatarBg, color: task.creator.avatarColor }}>
                  {task.creator.avatarInitials}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "clamp(11px,3vw,13px)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {task.creator.name}
                  </div>
                  <div className="rank-badge">Nv{task.creator.rankLevel}</div>
                </div>
              </div>
              <button
                className={task.highlight ? "btn btn-primary" : "btn btn-secondary"}
                style={{ width: "auto", padding: "8px clamp(10px,3vw,16px)", fontSize: "clamp(11px,3vw,13px)", flexShrink: 0 }}
                onClick={(e) => { e.stopPropagation(); navigate(`/task/${task.id}`); }}
              >
                Tenho interesse
              </button>
            </div>
          </div>
        ))}
      </div>
      <BottomNav active="home" />
    </>
  );
}
