import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import BottomNav from "@/components/BottomNav";
import { api, type Task } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";

const stars = [1, 2, 3, 4, 5];

const LEVEL_NAMES: Record<number, string> = {
  1: "Iniciante", 2: "Aprendiz", 3: "Profissional", 4: "Expert", 5: "Mestre",
};

export default function Profile() {
  const [, navigate] = useLocation();
  const user = getStoredUser();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (user?.id) api.getUserTasks(user.id).then(setTasks).catch(console.error);
  }, [user?.id]);

  if (!user) {
    return <div style={{ padding: 32, color: "#7E7A9A" }}>Faça login para ver seu perfil.</div>;
  }

  const nextLevelTasks = (user.rankLevel * 10);
  const progress = Math.min(100, (user.tasksCompleted / nextLevelTasks) * 100);

  return (
    <>
      <div className="screen" style={{ paddingBottom: 80 }}>
        {/* Hero */}
        <div style={{ padding: "20px var(--hpad)", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: "clamp(54px,16vw,68px)", height: "clamp(54px,16vw,68px)", background: "linear-gradient(135deg,rgba(124,58,237,.4),rgba(159,103,255,.2))", border: "2px solid rgba(138,99,255,.5)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontSize: "clamp(18px,5.5vw,24px)", fontWeight: 800, color: user.avatarColor, backgroundColor: user.avatarBg }}>
              {user.avatarInitials}
            </div>
            <div style={{ position: "absolute", bottom: -4, right: -4, background: "linear-gradient(135deg,#B45309,#D97706)", borderRadius: 6, padding: "2px 5px", fontSize: "clamp(9px,2.5vw,11px)", fontWeight: 700, color: "white", border: "1.5px solid var(--bg)" }}>
              Nv{user.rankLevel}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(16px,4.5vw,20px)", fontWeight: 800 }}>{user.name}</div>
            <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", marginTop: 2 }}>
              {user.city ?? "Sem cidade"} · {user.plan === "pro" ? "✨ Pro" : "Plano Free"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
              {stars.map((s) => (
                <svg key={s} width="12" height="12" fill={s <= user.rankLevel ? "#FBBF24" : "rgba(251,191,36,.25)"} viewBox="0 0 24 24">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke={s > user.rankLevel ? "#FBBF24" : "none"} strokeWidth={s > user.rankLevel ? "1.5" : "0"} />
                </svg>
              ))}
              <span style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#7E7A9A", marginLeft: 3 }}>
                Nível {user.rankLevel} · {user.rankPoints} pontos
              </span>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div style={{ margin: "0 var(--hpad) 16px", padding: "clamp(12px,3.5vw,15px)", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#C4B5FD", fontWeight: 600 }}>
              🏆 Nível {user.rankLevel} — {LEVEL_NAMES[user.rankLevel] ?? "Expert"}
            </div>
            <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#7E7A9A" }}>
              {user.tasksCompleted} / {nextLevelTasks} tarefas
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#7E7A9A", marginTop: 6 }}>
            Mais {Math.max(0, nextLevelTasks - user.tasksCompleted)} tarefas para o Nível {user.rankLevel + 1} ✨
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
          <div className="stat-card">
            <div className="stat-label">Tarefas criadas</div>
            <div className="stat-val" style={{ color: "#34D399" }}>
              {tasks.filter(t => t.creatorId === user.id).length}
            </div>
            <div className="stat-sub" style={{ color: "#7E7A9A" }}>publicadas</div>
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
          <button className="btn btn-secondary">Editar perfil</button>
          <button className="btn btn-ghost" onClick={() => navigate("/ranking")}>Ver ranking global</button>
          <button className="btn btn-ghost" onClick={() => navigate("/plans")}>Ver planos</button>
        </div>
      </div>
      <BottomNav active="profile" />
    </>
  );
}
