import { useLocation } from "wouter";

export default function TaskExecution() {
  const [, navigate] = useLocation();

  return (
    <div className="screen" style={{ paddingBottom: 30 }}>
      <div style={{ padding: "16px var(--hpad) 8px" }}>
        <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#7E7A9A", marginBottom: 4 }}>TAREFA ACEITA</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(16px,4.5vw,20px)", fontWeight: 700 }}>Confirmação de início</div>
      </div>

      {/* Progress tracker */}
      <div style={{ margin: "0 var(--hpad) 16px", padding: "clamp(12px,3.5vw,15px)", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: "clamp(11px,3vw,13px)", fontWeight: 500 }}>💻 Configurar roteador · R$65</div>
          <span className="pill pill-yellow">Em andamento</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Step 1 - Aceito */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: 28, height: 28, background: "var(--purple)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></svg>
            </div>
            <div style={{ fontSize: "clamp(9px,2.5vw,11px)", color: "#9F67FF", fontWeight: 600 }}>Aceito</div>
          </div>
          <div style={{ flex: 1, height: 2, background: "linear-gradient(90deg,var(--purple),rgba(124,58,237,.3))", margin: "0 6px", marginBottom: 16 }} />
          {/* Step 2 - Início */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: 28, height: 28, background: "rgba(124,58,237,.2)", border: "2px solid var(--purple)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 8, height: 8, background: "var(--purple)", borderRadius: "50%" }} />
            </div>
            <div style={{ fontSize: "clamp(9px,2.5vw,11px)", color: "#9F67FF", fontWeight: 600 }}>Início</div>
          </div>
          <div style={{ flex: 1, height: 2, background: "rgba(126,122,154,.2)", margin: "0 6px", marginBottom: 16 }} />
          {/* Step 3 - Conclusão */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: 28, height: 28, background: "rgba(126,122,154,.12)", border: "2px solid rgba(126,122,154,.2)", borderRadius: "50%" }} />
            <div style={{ fontSize: "clamp(9px,2.5vw,11px)", color: "#7E7A9A" }}>Conclusão</div>
          </div>
          <div style={{ flex: 1, height: 2, background: "rgba(126,122,154,.2)", margin: "0 6px", marginBottom: 16 }} />
          {/* Step 4 - Pagamento */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: 28, height: 28, background: "rgba(126,122,154,.12)", border: "2px solid rgba(126,122,154,.2)", borderRadius: "50%" }} />
            <div style={{ fontSize: "clamp(9px,2.5vw,11px)", color: "#7E7A9A" }}>Pagamento</div>
          </div>
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
        <button className="btn btn-primary" style={{ padding: "11px 24px", width: "auto", marginTop: 4 }} onClick={() => navigate("/task-completion")}>
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
