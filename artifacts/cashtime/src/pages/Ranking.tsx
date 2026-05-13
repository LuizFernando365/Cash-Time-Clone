import { useState } from "react";
import { useLocation } from "wouter";
import BottomNav from "@/components/BottomNav";

export default function Ranking() {
  const [, navigate] = useLocation();
  const [period, setPeriod] = useState<"semana" | "mes">("semana");

  return (
    <>
      <div className="screen" style={{ paddingBottom: 80 }}>
        <div style={{ padding: "16px var(--hpad) 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(17px,5vw,21px)", fontWeight: 700 }}>Ranking</div>
            <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", marginTop: 2 }}>Top performers esta semana</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div className={`chip ${period === "semana" ? "active" : ""}`} style={{ fontSize: "clamp(10px,2.8vw,12px)", padding: "4px 10px" }} onClick={() => setPeriod("semana")}>Semana</div>
            <div className={`chip ${period === "mes" ? "active" : ""}`} style={{ fontSize: "clamp(10px,2.8vw,12px)", padding: "4px 10px" }} onClick={() => setPeriod("mes")}>Mês</div>
          </div>
        </div>

        {/* Podium */}
        <div style={{ margin: "8px var(--hpad) 16px", background: "linear-gradient(135deg,rgba(124,58,237,.12),var(--card))", border: "1px solid var(--border)", borderRadius: 16, padding: "clamp(12px,3.5vw,16px)" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "clamp(8px,3vw,14px)", marginBottom: 4 }}>
            {/* 2nd */}
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ width: "clamp(36px,10vw,44px)", height: "clamp(36px,10vw,44px)", background: "rgba(226,232,240,.1)", border: "2px solid rgba(226,232,240,.25)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px", fontFamily: "'Syne', sans-serif", fontSize: "clamp(12px,3.5vw,15px)", fontWeight: 700, color: "#CBD5E1" }}>CS</div>
              <div style={{ fontSize: "clamp(10px,2.8vw,12px)", fontWeight: 600, color: "#CBD5E1" }}>Carla S.</div>
              <div style={{ fontSize: "clamp(9px,2.5vw,11px)", color: "#7E7A9A" }}>11 tarefas</div>
              <div style={{ width: "100%", height: 48, background: "rgba(226,232,240,.08)", borderRadius: "6px 6px 0 0", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🥈</div>
            </div>
            {/* 1st */}
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ position: "relative", display: "inline-block", marginBottom: 6 }}>
                <div style={{ width: "clamp(42px,12vw,52px)", height: "clamp(42px,12vw,52px)", background: "linear-gradient(135deg,rgba(251,191,36,.3),rgba(251,191,36,.1))", border: "2px solid rgba(251,191,36,.6)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontFamily: "'Syne', sans-serif", fontSize: "clamp(13px,4vw,17px)", fontWeight: 700, color: "#FCD34D" }}>RF</div>
                <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", fontSize: 16 }}>👑</div>
              </div>
              <div style={{ fontSize: "clamp(11px,3vw,13px)", fontWeight: 700, color: "#FCD34D" }}>Rafael F.</div>
              <div style={{ fontSize: "clamp(9px,2.5vw,11px)", color: "#7E7A9A" }}>18 tarefas</div>
              <div style={{ width: "100%", height: 68, background: "linear-gradient(180deg,rgba(251,191,36,.15),rgba(251,191,36,.05))", borderRadius: "6px 6px 0 0", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, border: "1px solid rgba(251,191,36,.2)", borderBottom: "none" }}>🥇</div>
            </div>
            {/* 3rd */}
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ width: "clamp(36px,10vw,44px)", height: "clamp(36px,10vw,44px)", background: "rgba(180,83,9,.12)", border: "2px solid rgba(180,83,9,.3)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px", fontFamily: "'Syne', sans-serif", fontSize: "clamp(12px,3.5vw,15px)", fontWeight: 700, color: "#D97706" }}>MA</div>
              <div style={{ fontSize: "clamp(10px,2.8vw,12px)", fontWeight: 600, color: "#D97706" }}>Marcos A.</div>
              <div style={{ fontSize: "clamp(9px,2.5vw,11px)", color: "#7E7A9A" }}>9 tarefas</div>
              <div style={{ width: "100%", height: 38, background: "rgba(180,83,9,.08)", borderRadius: "6px 6px 0 0", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🥉</div>
            </div>
          </div>
        </div>

        {/* Your position */}
        <div style={{ padding: "0 var(--hpad) 6px" }}><div className="section-sm">Sua posição</div></div>
        <div style={{ margin: "0 var(--hpad) 8px", background: "rgba(124,58,237,.08)", border: "1.5px solid rgba(124,58,237,.35)", borderRadius: 16, padding: "12px clamp(12px,3.5vw,15px)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(16px,4.5vw,20px)", fontWeight: 800, color: "#9F67FF", width: 28, textAlign: "center" }}>#7</div>
          <div className="avatar" style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(124,58,237,.2)", color: "#A78BFA" }}>L</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "clamp(12px,3.3vw,14px)", fontWeight: 600 }}>Luiz Oliveira <span style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#9F67FF" }}>(você)</span></div>
            <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#7E7A9A" }}>7 tarefas · R$380</div>
          </div>
          <div className="rank-badge">Nv3</div>
        </div>

        {/* Full ranking */}
        <div style={{ padding: "4px var(--hpad) 8px" }}><div className="section-sm">Ranking geral</div></div>
        <div style={{ padding: "0 var(--hpad)", display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { pos: "#1", color: "#FCD34D", initials: "RF", name: "Rafael F.", tasks: 18, rank: "Nv5", bg: "rgba(251,191,36,.12)", ic: "#FCD34D", rankStyle: {} },
            { pos: "#2", color: "#CBD5E1", initials: "CS", name: "Carla S.", tasks: 11, rank: "Nv4", bg: "rgba(52,211,153,.1)", ic: "#34D399", rankStyle: { background: "rgba(167,139,250,.1)", borderColor: "rgba(167,139,250,.2)", color: "#C4B5FD" } },
            { pos: "#3", color: "#D97706", initials: "MA", name: "Marcos A.", tasks: 9, rank: "Nv4", bg: "rgba(124,58,237,.15)", ic: "#A78BFA", rankStyle: {} },
            { pos: "#4", color: "#7E7A9A", initials: "JB", name: "João B.", tasks: 8, rank: "Nv3", bg: "rgba(126,122,154,.12)", ic: "#7E7A9A", rankStyle: { background: "rgba(126,122,154,.1)", borderColor: "rgba(126,122,154,.2)", color: "#7E7A9A" } },
            { pos: "#5", color: "#7E7A9A", initials: "AM", name: "Ana M.", tasks: 8, rank: "Nv3", bg: "rgba(52,211,153,.08)", ic: "#34D399", rankStyle: { background: "rgba(126,122,154,.1)", borderColor: "rgba(126,122,154,.2)", color: "#7E7A9A" } },
          ].map((r) => (
            <div key={r.pos} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid rgba(138,99,255,.08)" }}>
              <div style={{ fontSize: "clamp(12px,3.3vw,14px)", fontWeight: 700, color: r.color, width: 24 }}>{r.pos}</div>
              <div className="avatar" style={{ width: 32, height: 32, borderRadius: 10, background: r.bg, color: r.ic, fontSize: "clamp(11px,3vw,13px)" }}>{r.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "clamp(12px,3.3vw,14px)", fontWeight: 500 }}>{r.name}</div>
                <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#7E7A9A" }}>{r.tasks} tarefas</div>
              </div>
              <div className="rank-badge" style={r.rankStyle}>{r.rank}</div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="profile" />
    </>
  );
}
