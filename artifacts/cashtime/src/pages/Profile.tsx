import { useLocation } from "wouter";
import BottomNav from "@/components/BottomNav";

const stars = [1, 2, 3, 4, 5];

export default function Profile() {
  const [, navigate] = useLocation();

  return (
    <>
      <div className="screen" style={{ paddingBottom: 80 }}>
        {/* Hero */}
        <div style={{ padding: "20px 22px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 64, height: 64, background: "linear-gradient(135deg,rgba(124,58,237,.4),rgba(159,103,255,.2))", border: "2px solid rgba(138,99,255,.5)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#A78BFA" }}>L</div>
            <div style={{ position: "absolute", bottom: -4, right: -4, background: "linear-gradient(135deg,#B45309,#D97706)", borderRadius: 6, padding: "2px 5px", fontSize: 10, fontWeight: 700, color: "white", border: "1.5px solid var(--bg)" }}>Nv3</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800 }}>Luiz Oliveira</div>
            <div style={{ fontSize: 12, color: "#7E7A9A", marginTop: 2 }}>💻 Tech · 📝 Administrativo</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
              {stars.map((s) => (
                <svg key={s} width="12" height="12" fill={s <= 4 ? "#FBBF24" : "rgba(251,191,36,.25)"} viewBox="0 0 24 24">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke={s > 4 ? "#FBBF24" : "none"} strokeWidth={s > 4 ? "1.5" : "0"} />
                </svg>
              ))}
              <span style={{ fontSize: 11, color: "#7E7A9A", marginLeft: 3 }}>4.0 · 7 avaliações</span>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div style={{ margin: "0 16px 16px", padding: 14, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 12, color: "#C4B5FD", fontWeight: 600 }}>🏆 Nível 3 — Profissional</div>
            <div style={{ fontSize: 11, color: "#7E7A9A" }}>7 / 15 tarefas</div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "47%" }} />
          </div>
          <div style={{ fontSize: 11, color: "#7E7A9A", marginTop: 6 }}>Mais 8 tarefas para o Nível 4 ✨</div>
        </div>

        {/* Stats */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-label">Tarefas feitas</div>
            <div className="stat-val">7</div>
            <div className="stat-sub">+2 este mês</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Ganho total</div>
            <div className="stat-val" style={{ fontSize: 17, color: "#9F67FF" }}>R$380</div>
            <div className="stat-sub">+R$115 este mês</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Taxa de conclusão</div>
            <div className="stat-val" style={{ color: "#34D399" }}>100%</div>
            <div className="stat-sub" style={{ color: "#7E7A9A" }}>7 de 7</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Avaliação média</div>
            <div className="stat-val" style={{ color: "#FBBF24" }}>4.0 ⭐</div>
            <div className="stat-sub" style={{ color: "#7E7A9A" }}>7 avaliações</div>
          </div>
        </div>

        {/* Specialties */}
        <div style={{ padding: "0 22px 10px" }}>
          <div className="section-sm" style={{ marginBottom: 10 }}>Especialidades</div>
          <div>
            <span className="tag">Redes & Wi-Fi</span>
            <span className="tag">Suporte técnico</span>
            <span className="tag">Configurações de PC</span>
            <span className="tag">Planilhas Excel</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: "0 16px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="btn btn-secondary">Editar perfil</button>
          <button className="btn btn-ghost" onClick={() => navigate("/ranking")}>Ver ranking global</button>
          <button className="btn btn-ghost" onClick={() => navigate("/plans")}>Ver planos</button>
        </div>
      </div>
      <BottomNav active="profile" />
    </>
  );
}
