import { useLocation, useParams } from "wouter";

export default function TaskExecution() {
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const taskId = params.id ?? "";

  return (
    <div className="screen" style={{ paddingBottom: 30 }}>
      <div style={{ padding: "16px var(--hpad) 8px", display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" onClick={() => navigate(-1 as never)} style={{ cursor: "pointer" }}>
          <path d="M19 12H5M12 5l-7 7 7 7" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div style={{ padding: "0 var(--hpad) 8px" }}>
        <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#7E7A9A", marginBottom: 4 }}>TAREFA ACEITA</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(16px,4.5vw,20px)", fontWeight: 700 }}>Confirmação de início</div>
      </div>

      {/* Progress tracker */}
      <div style={{ margin: "0 var(--hpad) 16px", padding: "clamp(12px,3.5vw,15px)", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: "clamp(11px,3vw,13px)", fontWeight: 500 }}>⚡ Tarefa em andamento</div>
          <span className="pill pill-yellow">Em andamento</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {[
            { label: "Aceito", done: true },
            { label: "Início", active: true },
            { label: "Conclusão", done: false },
            { label: "Pagamento", done: false },
          ].map((step, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < arr.length - 1 ? undefined : 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: step.done ? "var(--purple)" : step.active ? "rgba(124,58,237,.2)" : "rgba(126,122,154,.12)",
                  border: step.active ? "2px solid var(--purple)" : step.done ? "none" : "2px solid rgba(126,122,154,.2)",
                }}>
                  {step.done
                    ? <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></svg>
                    : step.active ? <div style={{ width: 8, height: 8, background: "var(--purple)", borderRadius: "50%" }} /> : null}
                </div>
                <div style={{ fontSize: "clamp(9px,2.5vw,11px)", color: step.done || step.active ? "#9F67FF" : "#7E7A9A", fontWeight: 600 }}>{step.label}</div>
              </div>
              {i < arr.length - 1 && (
                <div style={{ flex: 1, height: 2, background: step.done ? "linear-gradient(90deg,var(--purple),rgba(124,58,237,.3))" : "rgba(126,122,154,.2)", margin: "0 6px", marginBottom: 16 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 var(--hpad) 12px" }}>
        <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#C4B5FD", lineHeight: 1.5 }}>
          Para confirmar o início do serviço, tire uma foto mostrando você no local com o equipamento visível.
        </div>
      </div>

      <div className="photo-box">
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" style={{ opacity: 0.5 }}>
          <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="#7E7A9A" strokeWidth="1.5" />
          <circle cx="12" cy="13" r="4" stroke="#7E7A9A" strokeWidth="1.5" />
        </svg>
        <p>Tire uma foto para confirmar<br />que você está no local da tarefa</p>
        <button className="btn btn-primary" style={{ padding: "11px 24px", width: "auto", marginTop: 4 }} onClick={() => navigate(`/task-completion/${taskId}`)}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="white" strokeWidth="1.8" />
            <circle cx="12" cy="13" r="4" stroke="white" strokeWidth="1.8" />
          </svg>
          Abrir câmera
        </button>
      </div>

      <div style={{ padding: "4px var(--hpad)", display: "flex", alignItems: "center", gap: 8 }}>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="#7E7A9A" strokeWidth="1.8" />
          <path d="M12 8v4M12 16h.01" stroke="#7E7A9A" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", lineHeight: 1.4 }}>A foto é usada para confirmar sua presença e proteger ambas as partes de possíveis fraudes.</div>
      </div>
    </div>
  );
}
