import { useLocation } from "wouter";

export default function Plans() {
  const [, navigate] = useLocation();

  return (
    <div className="screen" style={{ paddingBottom: 30 }}>
      <div style={{ padding: "16px 22px 8px", display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
          <path d="M19 12H5M12 5l-7 7 7 7" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div style={{ padding: "12px 22px 16px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Impulsione suas tarefas</div>
        <div style={{ fontSize: 13, color: "#7E7A9A", lineHeight: 1.5 }}>Alcance mais pessoas qualificadas e feche mais rápido</div>
      </div>

      {/* Free plan */}
      <div className="plan-card plan-card-free">
        <div style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700 }}>Publicação Avulsa</div>
            <div style={{ fontSize: 12, color: "#7E7A9A", marginTop: 2 }}>Para tarefas pontuais</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#F5F3FF" }}>R$9,90</div>
            <div style={{ fontSize: 11, color: "#7E7A9A" }}>por tarefa</div>
          </div>
        </div>
        <div className="divider" style={{ margin: "10px 0" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 14 }}>
          {[
            { ok: true, text: "Aparece no feed de tarefas" },
            { ok: true, text: "Nicho direcionado automaticamente" },
            { ok: false, text: "Sem prioridade no feed" },
            { ok: false, text: "Sem badge de destaque" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: item.ok ? "#C4B5FD" : "#7E7A9A" }}>
              {item.ok ? (
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="#9F67FF" strokeWidth="2" strokeLinecap="round" /></svg>
              ) : (
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" /></svg>
              )}
              {item.text}
            </div>
          ))}
        </div>
        <button className="btn btn-ghost" style={{ fontSize: 13, padding: 12 }} onClick={() => navigate("/post")}>
          Publicar por R$9,90
        </button>
      </div>

      {/* Pro plan */}
      <div className="plan-card plan-card-pro">
        <div style={{ position: "absolute", top: 14, right: 14, background: "linear-gradient(135deg,#7C3AED,#A78BFA)", borderRadius: 6, padding: "3px 9px", fontSize: 10, fontWeight: 700, color: "white", letterSpacing: ".05em" }}>POPULAR</div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Plano Mensal Pro ✨</div>
          <div style={{ fontSize: 12, color: "#A78BFA" }}>Recrutadores frequentes</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 12 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: "#A78BFA", lineHeight: 1 }}>R$19,90</div>
          <div style={{ fontSize: 13, color: "#7E7A9A", paddingBottom: 4 }}>/mês</div>
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
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#C4B5FD" }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" /></svg>
              {text}
            </div>
          ))}
        </div>
        <button className="btn btn-primary" style={{ fontSize: 13, padding: 13 }} onClick={() => navigate("/profile")}>
          Assinar por R$19,90/mês
        </button>
      </div>
    </div>
  );
}
