import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import BottomNav from "@/components/BottomNav";
import { api, type TaskWithCreator } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";

export default function TaskDetail() {
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const [task, setTask] = useState<TaskWithCreator | null>(null);
  const [loading, setLoading] = useState(true);
  const [contacting, setContacting] = useState(false);
  const user = getStoredUser();

  useEffect(() => {
    if (!params.id) return;
    api.getTask(params.id).then(setTask).catch(console.error).finally(() => setLoading(false));
  }, [params.id]);

  async function handleContact() {
    if (!user || !task) return;
    setContacting(true);
    try {
      const conv = await api.createConversation(task.creator.id, task.id);
      navigate(`/chat/${conv.id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setContacting(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100dvh", color: "#7E7A9A" }}>
        Carregando...
      </div>
    );
  }

  if (!task) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100dvh", color: "#7E7A9A", gap: 12 }}>
        <div style={{ fontSize: 32 }}>🔍</div>
        <div>Tarefa não encontrada</div>
        <button className="btn btn-ghost" onClick={() => navigate("/home")}>Voltar</button>
      </div>
    );
  }

  return (
    <>
      <div className="screen" style={{ paddingBottom: 80 }}>
        <div style={{ padding: "14px var(--hpad) 0", display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A" }}>Detalhe da tarefa</span>
        </div>

        <div style={{ padding: "16px var(--hpad)" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <span className="pill">{task.categoryEmoji} {task.category}</span>
            {task.highlight && <span className="pill pill-green">⭐ Destaque</span>}
            <span className={`pill ${task.status === "open" ? "pill-green" : ""}`}>
              {task.status === "open" ? "Aberta" : task.status === "in_progress" ? "Em andamento" : "Concluída"}
            </span>
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(16px,4.5vw,20px)", fontWeight: 700, lineHeight: 1.3, marginBottom: 8 }}>
            {task.title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(22px,7vw,30px)", fontWeight: 800, color: "#9F67FF" }}>
              R${task.price}
            </div>
            <div>
              <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A" }}>⏱ {task.estimatedTime}</div>
              <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A" }}>
                {task.isRemote ? "🌐 Remoto" : "📍 Presencial"}
              </div>
            </div>
          </div>
          {task.tags.length > 0 && (
            <div style={{ marginTop: 10 }}>
              {task.tags.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
          )}
        </div>

        <div className="divider" />

        <div style={{ padding: "12px var(--hpad)" }}>
          <div className="section-sm" style={{ marginBottom: 8 }}>Descrição</div>
          <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#C4B5FD", lineHeight: 1.6 }}>
            {task.description}
          </div>
        </div>

        {!task.isRemote && (
          <>
            <div className="divider" />
            <div style={{ padding: "12px var(--hpad) 0" }}>
              <div className="section-sm" style={{ marginBottom: 10 }}>Localização</div>
            </div>
            <div className="map-placeholder">
              <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" stroke="#9F67FF" strokeWidth="1.8" />
                  <circle cx="12" cy="10" r="3" fill="rgba(159,103,255,.3)" stroke="#9F67FF" strokeWidth="1.8" />
                </svg>
                <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", marginTop: 4 }}>{task.location}</div>
              </div>
            </div>
          </>
        )}

        <div className="divider" style={{ marginTop: 12 }} />

        <div style={{ padding: "12px var(--hpad)" }}>
          <div className="section-sm" style={{ marginBottom: 10 }}>Publicado por</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="avatar" style={{ width: "clamp(38px,10vw,46px)", height: "clamp(38px,10vw,46px)", borderRadius: 14, background: task.creator.avatarBg, color: task.creator.avatarColor, fontSize: "clamp(14px,4vw,17px)" }}>
              {task.creator.avatarInitials}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 600 }}>{task.creator.name}</div>
              <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A" }}>
                {task.creator.tasksCompleted} tarefas · Nível {task.creator.rankLevel}
              </div>
            </div>
            <div className="rank-badge">Nv{task.creator.rankLevel}</div>
          </div>
        </div>

        {user?.id !== task.creatorId && (
          <div style={{ padding: "8px var(--hpad) 0", display: "flex", flexDirection: "column", gap: 8 }}>
            <button className="btn btn-primary" onClick={handleContact} disabled={contacting}>
              {contacting ? "Iniciando..." : "💬 Entrar em contato"}
            </button>
          </div>
        )}
      </div>
      <BottomNav active="home" />
    </>
  );
}
