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
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
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
    } catch (e) { console.error(e); }
    finally { setContacting(false); }
  }

  async function handleAccept() {
    if (!user || !task) return;
    setAccepting(true);
    try {
      const updated = await api.acceptTask(task.id, user.id);
      setTask({ ...task, ...updated } as TaskWithCreator);
      setAccepted(true);
      setTimeout(() => navigate(`/task-execution/${task.id}`), 1200);
    } catch (e) { console.error(e); }
    finally { setAccepting(false); }
  }

  if (loading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100dvh", color: "#7E7A9A" }}>Carregando...</div>;
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

  const isOwner = user?.id === task.creatorId;
  const isExecutor = user?.id === task.executorId;
  const isOpen = task.status === "open";
  const isInProgress = task.status === "in_progress";

  return (
    <>
      <div className="screen" style={{ paddingBottom: 100 }}>
        <div style={{ padding: "14px var(--hpad) 0", display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" onClick={() => navigate(-1 as never)} style={{ cursor: "pointer" }}>
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A" }}>Detalhe da tarefa</span>
        </div>

        <div style={{ padding: "16px var(--hpad)", animation: "fadeInUp 0.35s ease" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <span className="pill">{task.categoryEmoji} {task.category}</span>
            {task.highlight && <span className="pill pill-green">⭐ Destaque</span>}
            {task.priority === 2 && <span className="pill" style={{ background: "rgba(167,139,250,.15)", color: "#C4B5FD", borderColor: "rgba(167,139,250,.3)" }}>💎 Premium</span>}
            <span className={`pill ${isOpen ? "pill-green" : isInProgress ? "pill-yellow" : "pill-gray"}`}>
              {isOpen ? "● Aberta" : isInProgress ? "⚡ Em andamento" : "✓ Concluída"}
            </span>
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(17px,5vw,22px)", fontWeight: 700, lineHeight: 1.3, marginBottom: 10 }}>
            {task.title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(24px,7.5vw,32px)", fontWeight: 800, color: "#9F67FF" }}>R${task.price}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A" }}>⏱ {task.estimatedTime}</div>
              <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A" }}>{task.isRemote ? "🌐 Remoto" : "📍 Presencial"}</div>
            </div>
          </div>
          {task.tags.length > 0 && (
            <div style={{ marginTop: 10 }}>
              {task.tags.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
          )}
        </div>

        <div className="divider" />

        <div style={{ padding: "12px var(--hpad)", animation: "fadeInUp 0.4s ease" }}>
          <div className="section-sm" style={{ marginBottom: 8 }}>Descrição</div>
          <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#C4B5FD", lineHeight: 1.7 }}>{task.description}</div>
        </div>

        {!task.isRemote && (
          <>
            <div className="divider" />
            <div style={{ padding: "12px var(--hpad)", animation: "fadeInUp 0.45s ease" }}>
              <div className="section-sm" style={{ marginBottom: 10 }}>Localização</div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px" }}>
                <div style={{ width: 36, height: 36, background: "rgba(124,58,237,.15)", border: "1px solid rgba(124,58,237,.3)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" stroke="#9F67FF" strokeWidth="1.8" />
                    <circle cx="12" cy="10" r="3" fill="rgba(159,103,255,.3)" stroke="#9F67FF" strokeWidth="1.8" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#C4B5FD", fontWeight: 500, lineHeight: 1.4 }}>{task.location || "Local a combinar"}</div>
                  {task.lat && task.lng && (
                    <div style={{ fontSize: "clamp(10px,2.8vw,11px)", color: "#7E7A9A", marginTop: 4 }}>📡 Coordenadas GPS disponíveis</div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="divider" />

        <div style={{ padding: "12px var(--hpad)", animation: "fadeInUp 0.5s ease" }}>
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

        {/* Accept success animation */}
        {accepted && (
          <div style={{ margin: "8px var(--hpad)", padding: "14px", background: "rgba(52,211,153,.1)", border: "1px solid rgba(52,211,153,.3)", borderRadius: 14, display: "flex", alignItems: "center", gap: 10, animation: "fadeInUp 0.3s ease" }}>
            <div style={{ fontSize: 24 }}>✅</div>
            <div>
              <div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 600, color: "#34D399" }}>Tarefa aceita!</div>
              <div style={{ fontSize: "clamp(11px,3vw,12px)", color: "#7E7A9A" }}>Redirecionando para a execução...</div>
            </div>
          </div>
        )}

        {/* Actions */}
        {!isOwner && isOpen && !accepted && (
          <div style={{ padding: "8px var(--hpad) 0", display: "flex", flexDirection: "column", gap: 8, animation: "fadeInUp 0.55s ease" }}>
            <button className="btn btn-primary" onClick={handleAccept} disabled={accepting}>
              {accepting ? "Aceitando..." : "⚡ Quero realizar esta tarefa"}
            </button>
            <button className="btn btn-secondary" onClick={handleContact} disabled={contacting}>
              {contacting ? "Abrindo..." : "💬 Entrar em contato"}
            </button>
          </div>
        )}

        {!isOwner && isInProgress && isExecutor && (
          <div style={{ padding: "8px var(--hpad) 0", animation: "fadeInUp 0.55s ease" }}>
            <button className="btn btn-primary" style={{ background: "linear-gradient(135deg,#059669,#10B981)" }} onClick={() => navigate(`/task-execution/${task.id}`)}>
              📸 Ir para execução da tarefa
            </button>
          </div>
        )}

        {isOwner && (
          <div style={{ padding: "8px var(--hpad) 0", animation: "fadeInUp 0.55s ease" }}>
            <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", textAlign: "center", padding: "10px", background: "var(--card)", borderRadius: 12, border: "1px solid var(--border)" }}>
              Esta é sua tarefa · {isInProgress ? "Em andamento — aguardando executor" : isOpen ? "Aberta para candidatos" : "Concluída"}
            </div>
          </div>
        )}
      </div>
      <BottomNav active="home" />
    </>
  );
}
