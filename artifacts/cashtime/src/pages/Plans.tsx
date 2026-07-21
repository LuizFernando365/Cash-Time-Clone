import { useState } from "react";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import { getStoredUser, setStoredUser } from "@/lib/auth";

export default function Plans() {
  const [, navigate] = useLocation();
  const user = getStoredUser();
  const isPro = user?.plan === "pro";
  const [cancelling, setCancelling] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  async function handleCancel() {
    if (!user) return;
    setCancelling(true);
    try {
      const updated = await api.cancelPlan(user.id);
      setStoredUser({ ...user, ...updated });
      setShowCancel(false);
      navigate("/profile");
    } catch { /* ignore */ } finally { setCancelling(false); }
  }

  return (
    <div className="screen" style={{ paddingBottom: 30 }}>
      <div style={{ padding: "16px var(--hpad) 8px", display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
          <path d="M19 12H5M12 5l-7 7 7 7" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {isPro ? (
        /* ── PRO USER: show current plan ── */
        <div style={{ animation: "fadeInUp 0.4s ease" }}>
          <div style={{ padding: "12px var(--hpad) 20px", textAlign: "center" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>✨</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(20px,6vw,26px)", fontWeight: 800, marginBottom: 6 }}>Plano Pro Ativo</div>
            <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#A78BFA", lineHeight: 1.5 }}>Você tem acesso completo a todas as funcionalidades</div>
          </div>

          <div style={{ margin: "0 var(--hpad) 20px", background: "linear-gradient(135deg,rgba(124,58,237,.18),rgba(159,103,255,.08))", border: "1px solid rgba(138,99,255,.45)", borderRadius: 20, padding: "20px" }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(14px,4vw,17px)", fontWeight: 700, marginBottom: 4 }}>Plano Mensal Pro ✨</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 14 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(28px,8vw,36px)", fontWeight: 800, color: "#A78BFA", lineHeight: 1 }}>R$19,90</div>
              <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#7E7A9A", paddingBottom: 4 }}>/mês</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "Tarefas ilimitadas com destaque",
                "Prioridade no topo do feed",
                "Badge ⭐ em todas as publicações",
                "Publicações ilimitadas no mês",
              ].map((text, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "clamp(12px,3.3vw,14px)", color: "#C4B5FD" }}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" /></svg>
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: "0 var(--hpad)" }}>
            <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#7E7A9A", textAlign: "center", marginBottom: 14, lineHeight: 1.5 }}>
              Seu plano renova automaticamente todo mês. Cancele a qualquer momento.
            </div>
            <button className="btn btn-ghost" style={{ color: "#F87171", borderColor: "rgba(248,113,113,.3)" }} onClick={() => setShowCancel(true)}>
              Cancelar plano
            </button>
          </div>
        </div>
      ) : (
        /* ── FREE USER: show upgrade options ── */
        <div style={{ animation: "fadeInUp 0.4s ease" }}>
          <div style={{ padding: "12px var(--hpad) 16px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(17px,5vw,22px)", fontWeight: 800, marginBottom: 6 }}>Impulsione suas tarefas</div>
            <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#7E7A9A", lineHeight: 1.5 }}>Alcance mais pessoas qualificadas e feche mais rápido</div>
          </div>

          {/* R$9,90 */}
          <div className="plan-card plan-card-free">
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
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 14 }}>
              {[
                { ok: true, text: "Aparece em destaque no feed" },
                { ok: true, text: "Nicho direcionado automaticamente" },
                { ok: false, text: "Sem prioridade máxima" },
                { ok: false, text: "Sem badge premium" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "clamp(12px,3.3vw,14px)", color: item.ok ? "#C4B5FD" : "#7E7A9A" }}>
                  {item.ok
                    ? <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="#9F67FF" strokeWidth="2" strokeLinecap="round" /></svg>
                    : <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" /></svg>}
                  {item.text}
                </div>
              ))}
            </div>
            <button className="btn btn-ghost" style={{ fontSize: "clamp(12px,3.3vw,14px)", padding: 12 }} onClick={() => navigate("/checkout?plan=boost")}>
              Publicar por R$9,90
            </button>
          </div>

          {/* R$19,90 Pro */}
          <div className="plan-card plan-card-pro">
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
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16 }}>
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
            <button className="btn btn-primary" style={{ fontSize: "clamp(12px,3.3vw,14px)", padding: 13 }} onClick={() => navigate("/checkout?plan=pro")}>
              Assinar por R$19,90/mês
            </button>
          </div>
        </div>
      )}

      {/* Cancel confirmation modal */}
      {showCancel && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 500, display: "flex", alignItems: "flex-end" }} onClick={() => setShowCancel(false)}>
          <div style={{ width: "100%", background: "var(--card)", borderRadius: "20px 20px 0 0", padding: "24px var(--hpad) 36px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(16px,4.5vw,19px)", fontWeight: 700, marginBottom: 8 }}>Cancelar plano Pro?</div>
            <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#7E7A9A", lineHeight: 1.6, marginBottom: 20 }}>
              Ao cancelar, você perderá todos os benefícios Pro imediatamente. Suas tarefas atuais continuarão publicadas, mas sem o destaque premium.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button className="btn btn-ghost" style={{ color: "#F87171", borderColor: "rgba(248,113,113,.3)" }} onClick={handleCancel} disabled={cancelling}>
                {cancelling ? "Cancelando..." : "Sim, cancelar plano"}
              </button>
              <button className="btn btn-secondary" onClick={() => setShowCancel(false)}>Manter plano Pro</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
