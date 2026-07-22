import { useState, useEffect, useCallback } from "react";
import { useLocation, useParams } from "wouter";
import BottomNav from "@/components/BottomNav";
import { api, type TaskWithCreator, type TaskApplication, type TaskApplicationWithUser } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";

function goBack(navigate: (to: string) => void, fallback = "/home") {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    navigate(fallback);
  }
}

export default function TaskDetail() {
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const taskId = params.id ?? "";
  const [task, setTask] = useState<TaskWithCreator | null>(null);
  const [loading, setLoading] = useState(true);
  const [myApp, setMyApp] = useState<TaskApplication | null>(null);
  const [applications, setApplications] = useState<TaskApplicationWithUser[]>([]);
  const [showAppsModal, setShowAppsModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyMsg, setApplyMsg] = useState("");
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [contacting, setContacting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const user = getStoredUser();

  const loadTask = useCallback(async () => {
    if (!taskId) return;
    try {
      const t = await api.getTask(taskId);
      setTask(t);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [taskId]);

  useEffect(() => {
    loadTask();
    // Poll for updates every 8 seconds
    const timer = setInterval(loadTask, 8000);
    return () => clearInterval(timer);
  }, [loadTask]);

  useEffect(() => {
    if (!taskId || !user) return;
    api.getMyApplication(taskId).then(setMyApp).catch(() => {});
  }, [taskId, user?.id]);

  const loadApplications = useCallback(async () => {
    if (!taskId) return;
    const apps = await api.getTaskApplications(taskId);
    setApplications(apps);
  }, [taskId]);

  async function handleApply() {
    if (!user || !task) return;
    setApplying(true);
    try {
      const app = await api.applyToTask(task.id, applyMsg.trim() || undefined);
      setMyApp(app);
      setShowApplyForm(false);
      setApplyMsg("");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao se candidatar");
    } finally { setApplying(false); }
  }

  async function handleContact() {
    if (!user || !task) return;
    setContacting(true);
    try {
      const conv = await api.createConversation(task.creator.id, task.id);
      navigate(`/chat/${conv.id}`);
    } catch { /* ignore */ }
    finally { setContacting(false); }
  }

  async function handleApprove(appId: string) {
    if (!task) return;
    setApprovingId(appId);
    try {
      const updated = await api.approveApplication(task.id, appId);
      setTask({ ...task, ...updated } as TaskWithCreator);
      setShowAppsModal(false);
      await loadApplications();
    } catch (e) { alert(e instanceof Error ? e.message : "Erro"); }
    finally { setApprovingId(null); }
  }

  async function handleConfirmDone() {
    if (!task) return;
    setConfirming(true);
    try {
      const updated = await api.confirmTask(task.id);
      setTask({ ...task, ...updated } as TaskWithCreator);
    } catch { /* ignore */ }
    finally { setConfirming(false); }
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
  const isAwaitingConfirmation = task.status === "awaiting_confirmation";
  const isDone = task.status === "done";

  const statusLabel = isOpen ? "● Aberta"
    : isInProgress ? "⚡ Em andamento"
    : isAwaitingConfirmation ? "⏳ Aguardando confirmação"
    : isDone ? "✓ Concluída" : task.status;
  const statusClass = isOpen ? "pill-green" : isInProgress ? "pill-yellow" : isDone ? "pill-gray" : "";

  return (
    <>
      <div className="screen" style={{ paddingBottom: 100 }}>
        <div style={{ padding: "14px var(--hpad) 0", display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" onClick={() => goBack(navigate)} style={{ cursor: "pointer" }}>
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A" }}>Detalhe da tarefa</span>
        </div>

        <div style={{ padding: "16px var(--hpad)", animation: "fadeInUp 0.35s ease" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <span className="pill">{task.categoryEmoji} {task.category}</span>
            {task.highlight && <span className="pill pill-green">⭐ Destaque</span>}
            {task.priority === 2 && <span className="pill" style={{ background: "rgba(167,139,250,.15)", color: "#C4B5FD", borderColor: "rgba(167,139,250,.3)" }}>💎 Premium</span>}
            <span className={`pill ${statusClass}`}>{statusLabel}</span>
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
            <div style={{ marginTop: 10 }}>{task.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
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
                {task.creator.tasksCompleted} tarefas concluídas · Nível {task.creator.rankLevel}
              </div>
            </div>
            <div className="rank-badge">Nv{task.creator.rankLevel}</div>
          </div>
        </div>

        {/* ── ACTIONS ZONE ── */}
        <div style={{ padding: "8px var(--hpad) 0", display: "flex", flexDirection: "column", gap: 8, animation: "fadeInUp 0.55s ease" }}>

          {/* === TASK OWNER ACTIONS === */}
          {isOwner && (
            <>
              <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", textAlign: "center", padding: "10px", background: "var(--card)", borderRadius: 12, border: "1px solid var(--border)" }}>
                {isOpen && "Aberta para candidaturas"}
                {isInProgress && "⚡ Em andamento com executor aprovado"}
                {isAwaitingConfirmation && "⏳ Executor enviou a conclusão — aguardando sua confirmação"}
                {isDone && "✅ Tarefa concluída com sucesso"}
              </div>

              {isOpen && (
                <button className="btn btn-secondary" onClick={async () => { await loadApplications(); setShowAppsModal(true); }}>
                  👥 Ver candidatos ({applications.length > 0 ? applications.length : "carregar"})
                </button>
              )}

              {isAwaitingConfirmation && (
                <button className="btn btn-green" onClick={handleConfirmDone} disabled={confirming}>
                  {confirming ? "Confirmando..." : "✅ Confirmar conclusão e liberar pagamento"}
                </button>
              )}
            </>
          )}

          {/* === NON-OWNER ACTIONS === */}
          {!isOwner && (
            <>
              {/* Pending application */}
              {myApp?.status === "pending" && (
                <div style={{ padding: "12px 14px", background: "rgba(251,191,36,.08)", border: "1px solid rgba(251,191,36,.25)", borderRadius: 14, display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ fontSize: 22 }}>⏳</div>
                  <div>
                    <div style={{ fontSize: "clamp(12px,3.3vw,14px)", fontWeight: 600, color: "#FBBF24" }}>Candidatura enviada!</div>
                    <div style={{ fontSize: "clamp(11px,3vw,12px)", color: "#7E7A9A", marginTop: 2 }}>O contratante analisará e aprovará um candidato em breve.</div>
                  </div>
                </div>
              )}

              {/* Approved application */}
              {myApp?.status === "approved" && (
                <div style={{ padding: "12px 14px", background: "rgba(52,211,153,.08)", border: "1px solid rgba(52,211,153,.25)", borderRadius: 14, display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ fontSize: 22 }}>🎉</div>
                  <div>
                    <div style={{ fontSize: "clamp(12px,3.3vw,14px)", fontWeight: 600, color: "#34D399" }}>Candidatura aprovada!</div>
                    <div style={{ fontSize: "clamp(11px,3vw,12px)", color: "#7E7A9A", marginTop: 2 }}>Você foi escolhido para realizar esta tarefa.</div>
                  </div>
                </div>
              )}

              {/* Rejected application */}
              {myApp?.status === "rejected" && (
                <div style={{ padding: "12px 14px", background: "rgba(126,122,154,.08)", border: "1px solid rgba(126,122,154,.2)", borderRadius: 14, display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ fontSize: 22 }}>💪</div>
                  <div>
                    <div style={{ fontSize: "clamp(12px,3.3vw,14px)", fontWeight: 600, color: "#C4B5FD" }}>Outro profissional foi escolhido</div>
                    <div style={{ fontSize: "clamp(11px,3vw,12px)", color: "#7E7A9A", marginTop: 2 }}>Continue se candidatando — há muitas oportunidades esperando por você!</div>
                  </div>
                </div>
              )}

              {/* Apply form */}
              {!myApp && isOpen && !showApplyForm && (
                <button className="btn btn-primary" onClick={() => setShowApplyForm(true)}>
                  📝 Candidatar-se a esta tarefa
                </button>
              )}

              {!myApp && isOpen && showApplyForm && (
                <div style={{ background: "var(--card)", border: "1px solid rgba(138,99,255,.3)", borderRadius: 16, padding: "14px" }}>
                  <div style={{ fontSize: "clamp(12px,3.3vw,14px)", fontWeight: 600, color: "#C4B5FD", marginBottom: 8 }}>Por que você é ideal para esta tarefa?</div>
                  <textarea
                    className="input"
                    placeholder="Fale sobre sua experiência e como pode ajudar... (opcional)"
                    value={applyMsg}
                    onChange={(e) => setApplyMsg(e.target.value)}
                    style={{ minHeight: 80, resize: "none", marginBottom: 10 }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleApply} disabled={applying}>
                      {applying ? "Enviando..." : "Enviar candidatura"}
                    </button>
                    <button className="btn btn-ghost" style={{ flex: 0, padding: "0 14px" }} onClick={() => setShowApplyForm(false)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Executor going to execution */}
              {isExecutor && (isInProgress || isAwaitingConfirmation) && (
                <button className="btn btn-primary" style={{ background: "linear-gradient(135deg,#059669,#10B981)" }} onClick={() => navigate(`/task-execution/${task.id}`)}>
                  📸 Acessar execução da tarefa
                </button>
              )}

              {/* Contact button — always available when open */}
              {isOpen && (
                <button className="btn btn-secondary" onClick={handleContact} disabled={contacting}>
                  {contacting ? "Abrindo..." : "💬 Falar com o contratante"}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <BottomNav active="home" />

      {/* ── Applications modal (for owner) ── */}
      {showAppsModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 400, display: "flex", alignItems: "flex-end" }}
          onClick={() => setShowAppsModal(false)}>
          <div style={{ width: "100%", background: "var(--card)", borderRadius: "20px 20px 0 0", maxHeight: "82vh", display: "flex", flexDirection: "column" }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "16px var(--hpad) 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(14px,4vw,17px)", fontWeight: 700 }}>Candidatos ({applications.length})</div>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" onClick={() => setShowAppsModal(false)} style={{ cursor: "pointer" }}>
                <path d="M18 6L6 18M6 6l12 12" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ overflowY: "auto", flex: 1, padding: "12px var(--hpad) 32px", display: "flex", flexDirection: "column", gap: 10 }}>
              {applications.length === 0 && (
                <div style={{ textAlign: "center", padding: "32px 0", color: "#7E7A9A" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                  <div style={{ fontSize: "clamp(12px,3.3vw,14px)" }}>Nenhuma candidatura ainda</div>
                  <div style={{ fontSize: "clamp(11px,3vw,12px)", marginTop: 4, color: "#9F67FF" }}>Compartilhe sua tarefa para atrair profissionais!</div>
                </div>
              )}
              {applications.map((app) => (
                <div key={app.id} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: app.message ? 10 : 0 }}>
                    <div className="avatar" style={{ width: 40, height: 40, borderRadius: 12, background: app.applicant.avatarBg, color: app.applicant.avatarColor, fontSize: 16, flexShrink: 0 }}>
                      {app.applicant.avatarInitials}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 600 }}>{app.applicant.name}</div>
                      <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#7E7A9A" }}>
                        {app.applicant.tasksCompleted} tarefas · Nível {app.applicant.rankLevel} · {app.applicant.rankPoints} XP
                      </div>
                    </div>
                    {app.status === "approved" && <span className="pill pill-green" style={{ fontSize: 10 }}>✓ Aprovado</span>}
                    {app.status === "rejected" && <span className="pill pill-gray" style={{ fontSize: 10 }}>Não selecionado</span>}
                  </div>
                  {app.message && (
                    <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#C4B5FD", lineHeight: 1.5, background: "var(--card)", borderRadius: 10, padding: "8px 12px", marginBottom: 10 }}>
                      "{app.message}"
                    </div>
                  )}
                  {app.status === "pending" && isOpen && (
                    <button className="btn btn-primary" style={{ padding: "9px 0", fontSize: "clamp(11px,3vw,13px)" }} onClick={() => handleApprove(app.id)} disabled={approvingId === app.id}>
                      {approvingId === app.id ? "Aprovando..." : "✅ Selecionar este profissional"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
