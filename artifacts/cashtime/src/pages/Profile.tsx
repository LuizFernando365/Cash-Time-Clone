import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import BottomNav from "@/components/BottomNav";
import { api, type Task, type User } from "@/lib/api";
import { getStoredUser, setStoredUser, clearSession } from "@/lib/auth";

const stars = [1, 2, 3, 4, 5];

const LEVEL_NAMES: Record<number, string> = {
  1: "Iniciante", 2: "Aprendiz", 3: "Profissional", 4: "Expert", 5: "Mestre",
};

function levelFromTasks(n: number): number {
  if (n >= 100) return 5;
  if (n >= 50) return 4;
  if (n >= 25) return 3;
  if (n >= 10) return 2;
  return 1;
}

function nextLevelThreshold(level: number): number {
  if (level >= 5) return 100;
  if (level >= 4) return 100;
  if (level >= 3) return 50;
  if (level >= 2) return 25;
  return 10;
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  open:    { label: "Pendente",   color: "#FBBF24", bg: "rgba(251,191,36,.12)" },
  done:    { label: "Concluída",  color: "#34D399", bg: "rgba(52,211,153,.12)" },
  cancelled: { label: "Cancelada", color: "#F87171", bg: "rgba(248,113,113,.12)" },
};

const BOOST_OPTIONS = [
  { priority: 1 as const, label: "✨ Destaque", price: "R$ 9,90", desc: "Apareça em destaque para mais pessoas" },
  { priority: 2 as const, label: "⭐ Premium",  price: "R$ 19,90", desc: "Topo do feed com selo premium exclusivo" },
];

const AVATAR_COLORS = [
  { bg: "rgba(124,58,237,.2)", color: "#A78BFA" },
  { bg: "rgba(52,211,153,.12)", color: "#34D399" },
  { bg: "rgba(251,191,36,.12)", color: "#FCD34D" },
  { bg: "rgba(239,68,68,.12)", color: "#F87171" },
  { bg: "rgba(59,130,246,.12)", color: "#60A5FA" },
  { bg: "rgba(236,72,153,.12)", color: "#F472B6" },
];

export default function Profile() {
  const [, navigate] = useLocation();
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [boostTask, setBoostTask] = useState<Task | null>(null);
  const [boostLoading, setBoostLoading] = useState(false);
  const [boostDone, setBoostDone] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [deletingTask, setDeletingTask] = useState(false);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDesc, setEditTaskDesc] = useState("");
  const [editTaskPrice, setEditTaskPrice] = useState("");
  const [editTaskLocation, setEditTaskLocation] = useState("");
  const [editTaskSaving, setEditTaskSaving] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editAvatarIdx, setEditAvatarIdx] = useState(0);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    if (user?.id) api.getUserTasks(user.id).then(setTasks).catch(console.error);
  }, [user?.id]);

  if (!user) {
    return <div style={{ padding: 32, color: "#7E7A9A" }}>Faça login para ver seu perfil.</div>;
  }

  const myTasks = tasks.filter((t) => t.creatorId === user.id);
  const level = levelFromTasks(user.tasksCompleted);
  const threshold = nextLevelThreshold(level);
  const prevThreshold = level === 1 ? 0 : nextLevelThreshold(level - 1);
  const progress = level >= 5 ? 100 : Math.min(100, ((user.tasksCompleted - prevThreshold) / (threshold - prevThreshold)) * 100);

  function openEdit() {
    setEditName(user!.name);
    setEditBio(user!.bio ?? "");
    setEditCity(user!.city ?? "");
    const idx = AVATAR_COLORS.findIndex(
      (c) => c.bg === user!.avatarBg && c.color === user!.avatarColor
    );
    setEditAvatarIdx(idx >= 0 ? idx : 0);
    setEditError("");
    setShowEditModal(true);
  }

  async function saveEdit() {
    if (!editName.trim()) { setEditError("Nome é obrigatório."); return; }
    setEditSaving(true);
    setEditError("");
    try {
      const chosenColor = AVATAR_COLORS[editAvatarIdx];
      const initials = editName.trim().split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
      const updated = await api.updateUser(user!.id, {
        name: editName.trim(),
        bio: editBio.trim() || undefined,
        city: editCity.trim() || undefined,
      });
      // Also patch avatar if color changed
      const patchedUser: User = {
        ...updated,
        avatarBg: chosenColor.bg,
        avatarColor: chosenColor.color,
        avatarInitials: initials,
      };
      setUser(patchedUser);
      setStoredUser(patchedUser);
      setShowEditModal(false);
    } catch (e: unknown) {
      setEditError(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setEditSaving(false);
    }
  }

  function handleLogout() {
    clearSession();
    navigate("/");
  }

  function openEditTask(task: Task) {
    setEditTask(task);
    setEditTaskTitle(task.title);
    setEditTaskDesc(task.description);
    setEditTaskPrice(String(task.price));
    setEditTaskLocation(task.location ?? "");
  }

  async function saveEditTask() {
    if (!editTask) return;
    setEditTaskSaving(true);
    try {
      await api.editTask(editTask.id, {
        title: editTaskTitle.trim(),
        description: editTaskDesc.trim(),
        price: parseFloat(editTaskPrice.replace(",", ".")),
        location: editTaskLocation.trim(),
      });
      const updated = await api.getUserTasks(user!.id);
      setTasks(updated);
      setEditTask(null);
    } catch { /* ignore */ } finally { setEditTaskSaving(false); }
  }

  async function confirmDeleteTask() {
    if (!deleteTaskId) return;
    setDeletingTask(true);
    try {
      await api.deleteTask(deleteTaskId);
      setTasks((prev) => prev.filter((t) => t.id !== deleteTaskId));
      setDeleteTaskId(null);
    } catch { /* ignore */ } finally { setDeletingTask(false); }
  }

  async function handleBoost(task: Task, priority: 1 | 2) {
    setBoostLoading(true);
    try {
      await api.boostTask(task.id, priority);
      setBoostDone(true);
      // Refresh tasks list
      const updated = await api.getUserTasks(user!.id);
      setTasks(updated);
      setTimeout(() => { setBoostDone(false); setBoostTask(null); }, 1800);
    } catch {
      // ignore
    } finally {
      setBoostLoading(false);
    }
  }

  return (
    <>
      <div className="screen" style={{ paddingBottom: 80 }}>
        {/* Hero */}
        <div style={{ padding: "20px var(--hpad)", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ position: "relative" }}>
            <div style={{
              width: "clamp(54px,16vw,68px)", height: "clamp(54px,16vw,68px)",
              background: `linear-gradient(135deg,rgba(124,58,237,.4),rgba(159,103,255,.2))`,
              border: "2px solid rgba(138,99,255,.5)", borderRadius: 20,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Syne', sans-serif", fontSize: "clamp(18px,5.5vw,24px)", fontWeight: 800,
              color: user.avatarColor, backgroundColor: user.avatarBg,
            }}>
              {user.avatarInitials}
            </div>
            <div style={{ position: "absolute", bottom: -4, right: -4, background: "linear-gradient(135deg,#B45309,#D97706)", borderRadius: 6, padding: "2px 5px", fontSize: "clamp(9px,2.5vw,11px)", fontWeight: 700, color: "white", border: "1.5px solid var(--bg)" }}>
              Nv{level}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(16px,4.5vw,20px)", fontWeight: 800 }}>{user.name}</div>
            <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", marginTop: 2 }}>
              {user.city ?? "Sem cidade"} · {user.plan === "pro" ? "✨ Pro" : "Plano Free"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
              {stars.map((s) => (
                <svg key={s} width="12" height="12" fill={s <= level ? "#FBBF24" : "rgba(251,191,36,.25)"} viewBox="0 0 24 24">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                    stroke={s > level ? "#FBBF24" : "none"} strokeWidth={s > level ? "1.5" : "0"} />
                </svg>
              ))}
              <span style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#7E7A9A", marginLeft: 3 }}>
                Nível {level} · {user.rankPoints} pontos
              </span>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div style={{ margin: "0 var(--hpad) 16px", padding: "clamp(12px,3.5vw,15px)", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#C4B5FD", fontWeight: 600 }}>
              🏆 Nível {level} — {LEVEL_NAMES[level] ?? "Mestre"}
            </div>
            <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#7E7A9A" }}>
              {user.tasksCompleted} / {level >= 5 ? "100+" : threshold} tarefas
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#7E7A9A", marginTop: 6 }}>
            {level >= 5 ? "🏆 Nível máximo atingido!" : `Mais ${Math.max(0, threshold - user.tasksCompleted)} tarefas para o Nível ${level + 1} ✨`}
          </div>
        </div>

        {/* Stats */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-label">Tarefas feitas</div>
            <div className="stat-val">{user.tasksCompleted}</div>
            <div className="stat-sub">{tasks.filter(t => t.status === "done").length} concluídas</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Ganho total</div>
            <div className="stat-val" style={{ fontSize: "clamp(15px,4.5vw,19px)", color: "#9F67FF" }}>
              R${user.totalEarned}
            </div>
            <div className="stat-sub">{user.rankPoints} pontos XP</div>
          </div>
          <div
            className="stat-card"
            style={{ cursor: "pointer", border: myTasks.length > 0 ? "1px solid rgba(124,58,237,.3)" : undefined }}
            onClick={() => setShowTasksModal(true)}
          >
            <div className="stat-label">Tarefas criadas</div>
            <div className="stat-val" style={{ color: "#34D399" }}>{myTasks.length}</div>
            <div className="stat-sub" style={{ color: myTasks.length > 0 ? "#9F67FF" : "#7E7A9A" }}>
              {myTasks.length > 0 ? "ver todas →" : "publicadas"}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Plano atual</div>
            <div className="stat-val" style={{ color: "#FBBF24", fontSize: "clamp(14px,4vw,17px)" }}>
              {user.plan === "pro" ? "✨ Pro" : "Free"}
            </div>
            <div className="stat-sub" style={{ color: "#7E7A9A" }}>
              {user.plan === "pro" ? "sem limites" : "upgrade disponível"}
            </div>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <div style={{ padding: "0 var(--hpad) 12px" }}>
            <div className="section-sm" style={{ marginBottom: 8 }}>Sobre</div>
            <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#C4B5FD", lineHeight: 1.6 }}>{user.bio}</div>
          </div>
        )}

        {/* Actions */}
        <div style={{ padding: "0 var(--hpad) 12px", display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="btn btn-secondary" onClick={openEdit}>Editar perfil</button>
          <button className="btn btn-ghost" onClick={() => navigate("/ranking")}>Ver ranking global</button>
          <button className="btn btn-ghost" onClick={() => navigate("/plans")}>Ver planos</button>
          <button className="btn btn-ghost" style={{ color: "#F87171", borderColor: "rgba(248,113,113,.25)" }} onClick={() => setShowLogoutConfirm(true)}>
            Sair da conta
          </button>
        </div>
      </div>

      <BottomNav active="profile" />

      {/* ── Tarefas criadas modal ── */}
      {showTasksModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.65)", zIndex: 300, display: "flex", alignItems: "flex-end" }}
          onClick={() => setShowTasksModal(false)}>
          <div style={{ width: "100%", background: "var(--card)", borderRadius: "20px 20px 0 0", maxHeight: "82vh", display: "flex", flexDirection: "column" }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "16px var(--hpad) 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(15px,4.5vw,18px)", fontWeight: 700 }}>
                Minhas Tarefas ({myTasks.length})
              </div>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" onClick={() => setShowTasksModal(false)} style={{ cursor: "pointer" }}>
                <path d="M18 6L6 18M6 6l12 12" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ overflowY: "auto", flex: 1, padding: "12px var(--hpad) 32px" }}>
              {myTasks.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#7E7A9A" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
                  <div>Você ainda não publicou nenhuma tarefa.</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {myTasks.map((task) => {
                    const st = STATUS_LABELS[task.status] ?? STATUS_LABELS.open;
                    return (
                      <div key={task.id} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 600, marginBottom: 4 }}>{task.title}</div>
                            <div style={{ fontSize: "clamp(11px,3vw,12px)", color: "#7E7A9A" }}>{task.categoryEmoji} {task.category} · R${task.price}</div>
                          </div>
                          <span style={{ background: st.bg, color: st.color, borderRadius: 20, padding: "3px 10px", fontSize: "clamp(10px,2.8vw,11px)", fontWeight: 600, flexShrink: 0 }}>
                            {st.label}
                          </span>
                        </div>
                        {task.priority >= 1 && (
                          <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: task.priority === 2 ? "#C4B5FD" : "#FBBF24", marginBottom: 8 }}>
                            {task.priority === 2 ? "⭐ Impulsionada Premium" : "✨ Impulsionada Destaque"}
                          </div>
                        )}
                        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                          {task.status === "open" && task.priority < 2 && (
                            <button className="btn btn-secondary" style={{ padding: "7px 12px", fontSize: "clamp(10px,2.8vw,12px)", flex: 1 }} onClick={() => { setBoostTask(task); setBoostDone(false); }}>
                              ⚡ Impulsionar
                            </button>
                          )}
                          {task.status === "open" && (
                            <button className="btn btn-ghost" style={{ padding: "7px 12px", fontSize: "clamp(10px,2.8vw,12px)", flex: 1 }} onClick={() => openEditTask(task)}>
                              ✏️ Editar
                            </button>
                          )}
                          <button className="btn btn-ghost" style={{ padding: "7px 12px", fontSize: "clamp(10px,2.8vw,12px)", color: "#F87171", borderColor: "rgba(248,113,113,.2)", flex: 0 }} onClick={() => setDeleteTaskId(task.id)}>
                            🗑
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Boost modal ── */}
      {boostTask && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 400, overflowY: "auto", display: "flex", alignItems: "flex-start" }}
          onClick={() => !boostLoading && setBoostTask(null)}
        >
          <div style={{ width: "100%", minHeight: "100%", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: "16px var(--hpad) 8px", display: "flex", alignItems: "center", gap: 10, background: "var(--bg)" }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" onClick={() => !boostLoading && setBoostTask(null)} style={{ cursor: "pointer" }}>
                <path d="M19 12H5M12 5l-7 7 7 7" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            {boostDone ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px var(--hpad)", background: "var(--bg)" }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>🚀</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(17px,5vw,22px)", fontWeight: 800, color: "#C4B5FD", textAlign: "center", marginBottom: 8 }}>Tarefa impulsionada!</div>
                <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#7E7A9A", textAlign: "center" }}>Ela já está no topo do feed.</div>
              </div>
            ) : (
              <div style={{ flex: 1, background: "var(--bg)", paddingBottom: 32 }}>
                {/* Title */}
                <div style={{ padding: "12px var(--hpad) 16px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(17px,5vw,22px)", fontWeight: 800, marginBottom: 6 }}>Impulsione suas tarefas</div>
                  <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#7E7A9A", lineHeight: 1.5 }}>Alcance mais pessoas qualificadas e feche mais rápido</div>
                </div>

                {/* Card R$9,90 — only if task isn't already at priority 1+ */}
                {boostTask.priority < 1 && (
                  <div
                    className="plan-card plan-card-free"
                    style={{ cursor: boostLoading ? "not-allowed" : "pointer", opacity: boostLoading ? 0.6 : 1, transition: "opacity .15s" }}
                    onClick={() => !boostLoading && handleBoost(boostTask, 1)}
                  >
                    <div style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(14px,4vw,17px)", fontWeight: 700 }}>Publicação Avulsa</div>
                        <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", marginTop: 2 }}>Para tarefas pontuais</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(20px,6vw,26px)", fontWeight: 800, color: "#F5F3FF" }}>R$9,90</div>
                        <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#7E7A9A" }}>por tarefa</div>
                      </div>
                    </div>
                    <div className="divider" style={{ margin: "10px 0" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                      {[
                        { ok: true,  text: "Aparece no feed de tarefas" },
                        { ok: true,  text: "Nicho direcionado automaticamente" },
                        { ok: false, text: "Sem prioridade no feed" },
                        { ok: false, text: "Sem badge de destaque" },
                      ].map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "clamp(12px,3.3vw,14px)", color: item.ok ? "#C4B5FD" : "#7E7A9A" }}>
                          {item.ok ? (
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="#9F67FF" strokeWidth="2" strokeLinecap="round" /></svg>
                          ) : (
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" /></svg>
                          )}
                          {item.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Card R$19,90 — only if task isn't already at priority 2 */}
                {boostTask.priority < 2 && (
                  <div
                    className="plan-card plan-card-pro"
                    style={{ cursor: boostLoading ? "not-allowed" : "pointer", opacity: boostLoading ? 0.6 : 1, transition: "opacity .15s" }}
                    onClick={() => !boostLoading && handleBoost(boostTask, 2)}
                  >
                    <div style={{ position: "absolute", top: 14, right: 14, background: "linear-gradient(135deg,#7C3AED,#A78BFA)", borderRadius: 6, padding: "3px 9px", fontSize: "clamp(9px,2.5vw,11px)", fontWeight: 700, color: "white", letterSpacing: ".05em" }}>POPULAR</div>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(14px,4vw,17px)", fontWeight: 700, marginBottom: 2 }}>Plano Mensal Pro ✨</div>
                      <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#A78BFA" }}>Recrutadores frequentes</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 12 }}>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(26px,8vw,34px)", fontWeight: 800, color: "#A78BFA", lineHeight: 1 }}>R$19,90</div>
                      <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#7E7A9A", paddingBottom: 4 }}>/mês</div>
                    </div>
                    <div className="divider" style={{ margin: "10px 0", background: "rgba(138,99,255,.25)" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                      {[
                        <><strong style={{ color: "#F5F3FF" }}>Todas</strong> as tarefas com destaque</>,
                        "Prioridade no topo do feed",
                        "Badge ⭐ em todas as publicações",
                        "Publicações ilimitadas no mês",
                        "Relatório de interesse por tarefa",
                      ].map((text, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "clamp(12px,3.3vw,14px)", color: "#C4B5FD" }}>
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" /></svg>
                          {text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Edit Profile modal ── */}
      {showEditModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.65)", zIndex: 300, display: "flex", alignItems: "flex-end" }}
          onClick={() => !editSaving && setShowEditModal(false)}>
          <div style={{ width: "100%", background: "var(--card)", borderRadius: "20px 20px 0 0", maxHeight: "88vh", display: "flex", flexDirection: "column" }}
            onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: "16px var(--hpad) 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(15px,4.5vw,18px)", fontWeight: 700 }}>Editar Perfil</div>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" onClick={() => !editSaving && setShowEditModal(false)} style={{ cursor: "pointer" }}>
                <path d="M18 6L6 18M6 6l12 12" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            <div style={{ overflowY: "auto", flex: 1, padding: "16px var(--hpad) 32px", display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Avatar color picker */}
              <div>
                <div className="input-label">Cor do avatar</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {AVATAR_COLORS.map((c, i) => (
                    <div
                      key={i}
                      onClick={() => setEditAvatarIdx(i)}
                      style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: c.bg, border: `2.5px solid ${editAvatarIdx === i ? c.color : "transparent"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14,
                        color: c.color, cursor: "pointer",
                        boxShadow: editAvatarIdx === i ? `0 0 8px ${c.color}60` : "none",
                      }}
                    >
                      {editName.trim().split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("") || "?"}
                    </div>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <div className="input-label">Nome completo</div>
                <input
                  className="input-field"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Seu nome"
                  style={{ borderColor: editName ? "var(--purple)" : undefined }}
                />
              </div>

              {/* City */}
              <div>
                <div className="input-label">Cidade</div>
                <input
                  className="input-field"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  placeholder="Ex: São Paulo, SP"
                />
              </div>

              {/* Bio */}
              <div>
                <div className="input-label">Bio (opcional)</div>
                <textarea
                  className="input-field textarea"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Conte um pouco sobre você, suas habilidades..."
                  style={{ minHeight: 80 }}
                />
              </div>

              {editError && (
                <div style={{ padding: "10px 14px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, fontSize: "clamp(12px,3.3vw,14px)", color: "#FCA5A5" }}>
                  {editError}
                </div>
              )}

              <button className="btn btn-primary" onClick={saveEdit} disabled={editSaving}>
                {editSaving ? "Salvando..." : "Salvar alterações"}
              </button>
              <button className="btn btn-ghost" onClick={() => setShowEditModal(false)} disabled={editSaving}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Logout confirmation ── */}
      {showLogoutConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 var(--hpad)" }}
          onClick={() => setShowLogoutConfirm(false)}>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: "24px", width: "100%", maxWidth: 340, textAlign: "center" }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👋</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(15px,4.5vw,18px)", fontWeight: 700, marginBottom: 8 }}>Sair da conta?</div>
            <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#7E7A9A", marginBottom: 20 }}>Você precisará fazer login novamente para acessar o CashTime.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="btn btn-ghost" style={{ color: "#F87171", borderColor: "rgba(248,113,113,.25)" }} onClick={handleLogout}>Sim, sair</button>
              <button className="btn btn-secondary" onClick={() => setShowLogoutConfirm(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit task modal ── */}
      {editTask && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 500, display: "flex", alignItems: "flex-end" }}
          onClick={() => !editTaskSaving && setEditTask(null)}>
          <div style={{ width: "100%", background: "var(--card)", borderRadius: "20px 20px 0 0", padding: "20px var(--hpad) 36px", display: "flex", flexDirection: "column", gap: 12 }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(14px,4vw,17px)", fontWeight: 700 }}>Editar tarefa</div>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" onClick={() => !editTaskSaving && setEditTask(null)} style={{ cursor: "pointer" }}>
                <path d="M18 6L6 18M6 6l12 12" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", marginBottom: 6 }}>Título</div>
              <input className="input" value={editTaskTitle} onChange={(e) => setEditTaskTitle(e.target.value)} placeholder="Título da tarefa" />
            </div>
            <div>
              <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", marginBottom: 6 }}>Descrição</div>
              <textarea className="input" value={editTaskDesc} onChange={(e) => setEditTaskDesc(e.target.value)} placeholder="Descrição do serviço" style={{ minHeight: 70, resize: "none" }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", marginBottom: 6 }}>Valor (R$)</div>
                <input className="input" type="number" value={editTaskPrice} onChange={(e) => setEditTaskPrice(e.target.value)} placeholder="0,00" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", marginBottom: 6 }}>Local</div>
                <input className="input" value={editTaskLocation} onChange={(e) => setEditTaskLocation(e.target.value)} placeholder="Localização" />
              </div>
            </div>
            <button className="btn btn-primary" onClick={saveEditTask} disabled={editTaskSaving || !editTaskTitle.trim()}>
              {editTaskSaving ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </div>
      )}

      {/* ── Delete task confirmation ── */}
      {deleteTaskId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 var(--hpad)" }}
          onClick={() => !deletingTask && setDeleteTaskId(null)}>
          <div style={{ background: "var(--card)", border: "1px solid rgba(248,113,113,.2)", borderRadius: 20, padding: "24px", width: "100%", maxWidth: 340, textAlign: "center" }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(15px,4.5vw,18px)", fontWeight: 700, marginBottom: 8 }}>Excluir tarefa?</div>
            <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#7E7A9A", marginBottom: 20 }}>Esta ação não pode ser desfeita. A tarefa será removida permanentemente.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="btn btn-ghost" style={{ color: "#F87171", borderColor: "rgba(248,113,113,.25)" }} onClick={confirmDeleteTask} disabled={deletingTask}>
                {deletingTask ? "Excluindo..." : "Sim, excluir"}
              </button>
              <button className="btn btn-secondary" onClick={() => setDeleteTaskId(null)} disabled={deletingTask}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
