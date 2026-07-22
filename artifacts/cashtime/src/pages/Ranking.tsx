import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import BottomNav from "@/components/BottomNav";
import { api, type RankingEntry } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";

const MEDAL_COLORS = ["#FCD34D", "#CBD5E1", "#D97706"];
const MEDAL_EMOJIS = ["🥇", "🥈", "🥉"];

export default function Ranking() {
  const [, navigate] = useLocation();
  const [period, setPeriod] = useState<"semana" | "mes">("semana");
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getStoredUser();

  useEffect(() => {
    api.getRanking().then(setRanking).catch(console.error).finally(() => setLoading(false));
    const timer = setInterval(() => {
      api.getRanking().then(setRanking).catch(() => {});
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const myPos = ranking.findIndex((r) => r.id === user?.id);
  const top3 = ranking.slice(0, 3);

  return (
    <>
      <div className="screen" style={{ paddingBottom: 80 }}>
        <div style={{ padding: "16px var(--hpad) 12px", display: "flex", alignItems: "center", gap: 12 }}>
          {/* Back arrow */}
          <svg
            width="22" height="22" fill="none" viewBox="0 0 24 24"
            style={{ cursor: "pointer", flexShrink: 0 }}
            onClick={() => navigate("/profile")}
          >
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
          </svg>

          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(17px,5vw,21px)", fontWeight: 700 }}>Ranking</div>
            <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", marginTop: 2 }}>Top performers</div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <div className={`chip ${period === "semana" ? "active" : ""}`} style={{ fontSize: "clamp(10px,2.8vw,12px)", padding: "4px 10px" }} onClick={() => setPeriod("semana")}>Semana</div>
            <div className={`chip ${period === "mes" ? "active" : ""}`} style={{ fontSize: "clamp(10px,2.8vw,12px)", padding: "4px 10px" }} onClick={() => setPeriod("mes")}>Mês</div>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#7E7A9A" }}>Carregando...</div>
        )}

        {/* Empty state */}
        {!loading && ranking.length === 0 && (
          <div style={{ textAlign: "center", padding: "clamp(40px,12vw,64px) var(--hpad)", color: "#7E7A9A" }}>
            <div style={{ fontSize: "clamp(36px,10vw,48px)", marginBottom: 14 }}>🏆</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(14px,4vw,17px)", fontWeight: 700, color: "#C4B5FD", marginBottom: 8 }}>
              O ranking está vazio
            </div>
            <div style={{ fontSize: "clamp(12px,3.3vw,14px)", lineHeight: 1.6, maxWidth: 240, margin: "0 auto" }}>
              Complete tarefas para aparecer no ranking e ganhar credibilidade na plataforma.
            </div>
            <div style={{ marginTop: 20, display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(124,58,237,.08)", border: "1px solid rgba(124,58,237,.2)", borderRadius: 12, padding: "10px 16px" }}>
              <span style={{ fontSize: 16 }}>⚡</span>
              <span style={{ fontSize: "clamp(11px,3vw,13px)", color: "#A78BFA" }}>Seja o primeiro a pontuar!</span>
            </div>
          </div>
        )}

        {/* Podium */}
        {!loading && top3.length > 0 && (
          <div style={{ margin: "8px var(--hpad) 16px", background: "linear-gradient(135deg,rgba(124,58,237,.12),var(--card))", border: "1px solid var(--border)", borderRadius: 16, padding: "clamp(12px,3.5vw,16px)" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "clamp(8px,3vw,14px)", marginBottom: 4 }}>
              {[1, 0, 2].filter(i => top3[i]).map((idx) => {
                const r = top3[idx];
                const isFirst = idx === 0;
                const color = MEDAL_COLORS[idx];
                const barH = isFirst ? 68 : idx === 1 ? 48 : 38;
                return (
                  <div key={r.id} style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ position: "relative", display: "inline-block", marginBottom: 6 }}>
                      {isFirst && <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", fontSize: 16 }}>👑</div>}
                      <div style={{
                        width: isFirst ? "clamp(42px,12vw,52px)" : "clamp(36px,10vw,44px)",
                        height: isFirst ? "clamp(42px,12vw,52px)" : "clamp(36px,10vw,44px)",
                        background: r.avatarBg, border: `2px solid ${color}88`,
                        borderRadius: isFirst ? 16 : 14,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto",
                        fontFamily: "'Syne', sans-serif",
                        fontSize: isFirst ? "clamp(13px,4vw,17px)" : "clamp(12px,3.5vw,15px)",
                        fontWeight: 700, color: r.avatarColor,
                      }}>
                        {r.avatarInitials}
                      </div>
                    </div>
                    <div style={{ fontSize: isFirst ? "clamp(11px,3vw,13px)" : "clamp(10px,2.8vw,12px)", fontWeight: isFirst ? 700 : 600, color }}>{r.name.split(" ")[0]}</div>
                    <div style={{ fontSize: "clamp(9px,2.5vw,11px)", color: "#7E7A9A" }}>{r.tasksCompleted} tarefas</div>
                    <div style={{
                      width: "100%", height: barH,
                      background: isFirst ? `linear-gradient(180deg,${color}26,${color}0d)` : `${color}14`,
                      borderRadius: "6px 6px 0 0", marginTop: 8,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                      ...(isFirst ? { border: `1px solid ${color}33`, borderBottom: "none" } : {}),
                    }}>
                      {MEDAL_EMOJIS[idx]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Your position */}
        {!loading && myPos >= 0 && (
          <>
            <div style={{ padding: "0 var(--hpad) 6px" }}><div className="section-sm">Sua posição</div></div>
            <div style={{ margin: "0 var(--hpad) 8px", background: "rgba(124,58,237,.08)", border: "1.5px solid rgba(124,58,237,.35)", borderRadius: 16, padding: "12px clamp(12px,3.5vw,15px)", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(16px,4.5vw,20px)", fontWeight: 800, color: "#9F67FF", width: 28, textAlign: "center" }}>#{myPos + 1}</div>
              <div className="avatar" style={{ width: 36, height: 36, borderRadius: 12, background: user!.avatarBg, color: user!.avatarColor }}>{user!.avatarInitials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "clamp(12px,3.3vw,14px)", fontWeight: 600 }}>
                  {user!.name} <span style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#9F67FF" }}>(você)</span>
                </div>
                <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#7E7A9A" }}>
                  {ranking[myPos].tasksCompleted} tarefas · R${ranking[myPos].totalEarned}
                </div>
              </div>
              <div className="rank-badge">Nv{ranking[myPos].rankLevel}</div>
            </div>
          </>
        )}

        {/* Full ranking */}
        {!loading && ranking.length > 0 && (
          <>
            <div style={{ padding: "4px var(--hpad) 8px" }}><div className="section-sm">Ranking geral</div></div>
            <div style={{ padding: "0 var(--hpad)", display: "flex", flexDirection: "column", gap: 6 }}>
              {ranking.map((r, i) => (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 4px", borderBottom: "1px solid rgba(138,99,255,.08)", background: r.id === user?.id ? "rgba(124,58,237,.04)" : undefined, borderRadius: r.id === user?.id ? 8 : undefined }}>
                  <div style={{ fontSize: "clamp(12px,3.3vw,14px)", fontWeight: 700, color: MEDAL_COLORS[i] ?? "#7E7A9A", width: 24 }}>#{i + 1}</div>
                  <div className="avatar" style={{ width: 32, height: 32, borderRadius: 10, background: r.avatarBg, color: r.avatarColor, fontSize: "clamp(11px,3vw,13px)" }}>{r.avatarInitials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "clamp(12px,3.3vw,14px)", fontWeight: 500 }}>
                      {r.name}{r.id === user?.id ? " (você)" : ""}
                    </div>
                    <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#7E7A9A" }}>{r.tasksCompleted} tarefas · {r.rankPoints} pts</div>
                  </div>
                  <div className="rank-badge">Nv{r.rankLevel}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <BottomNav active="profile" />
    </>
  );
}
