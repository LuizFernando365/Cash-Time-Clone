import { useState } from "react";
import { useLocation } from "wouter";

export default function PostTask() {
  const [, navigate] = useLocation();
  const [serviceType, setServiceType] = useState<"presencial" | "remoto">("presencial");
  const [plan, setPlan] = useState<"avulso" | "mensal">("mensal");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [value, setValue] = useState("");

  return (
    <div className="screen" style={{ paddingBottom: 90 }}>
      <div style={{ padding: "16px var(--hpad) 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
          <path d="M19 12H5M12 5l-7 7 7 7" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(14px,4vw,17px)", fontWeight: 700 }}>Nova Tarefa</div>
        <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", cursor: "pointer" }} onClick={() => navigate("/home")}>Cancelar</div>
      </div>

      <div style={{ margin: "0 var(--hpad) 12px" }}>
        <div className="input-label">Título da tarefa</div>
        <input
          className="input-field"
          placeholder="Ex: Configurar impressora HP..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ borderColor: title ? "var(--purple)" : undefined, background: title ? "rgba(124,58,237,0.07)" : undefined }}
        />
      </div>

      <div style={{ margin: "0 var(--hpad) 12px" }}>
        <div className="input-label">Descrição completa</div>
        <textarea
          className="input-field textarea"
          placeholder="Descreva tudo que precisa ser feito, requisitos, materiais disponíveis..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "0 var(--hpad) 12px" }}>
        <div>
          <div className="input-label">Valor (R$)</div>
          <input className="input-field" placeholder="65,00" value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <div>
          <div className="input-label">Tempo estimado</div>
          <div className="input-field" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#A78BFA", fontSize: "clamp(12px,3.3vw,14px)" }}>
            1 hora
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      <div style={{ margin: "0 var(--hpad) 12px" }}>
        <div className="input-label">Nicho / Categoria</div>
        <div className="input-field" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#A78BFA", fontSize: "clamp(12px,3.3vw,14px)" }}>
          💻 Tecnologia & Design
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div style={{ margin: "0 var(--hpad) 12px" }}>
        <div className="input-label">Tipo de serviço</div>
        <div style={{ display: "flex", gap: 8 }}>
          <div
            className={`quiz-option ${serviceType === "presencial" ? "selected" : ""}`}
            style={{ flex: 1, margin: 0, padding: "11px 12px" }}
            onClick={() => setServiceType("presencial")}
          >
            <div className="quiz-option-check">
              {serviceType === "presencial" && <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></svg>}
            </div>
            <div style={{ fontSize: "clamp(12px,3.3vw,14px)" }}>📍 Presencial</div>
          </div>
          <div
            className={`quiz-option ${serviceType === "remoto" ? "selected" : ""}`}
            style={{ flex: 1, margin: 0, padding: "11px 12px" }}
            onClick={() => setServiceType("remoto")}
          >
            <div className="quiz-option-check">
              {serviceType === "remoto" && <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></svg>}
            </div>
            <div style={{ fontSize: "clamp(12px,3.3vw,14px)" }}>🌐 Remoto</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "4px var(--hpad) 12px" }}>
        <div className="section-sm" style={{ marginBottom: 10 }}>Como publicar?</div>
      </div>

      <div
        className="plan-card plan-card-free"
        style={{ cursor: "pointer", marginBottom: 8 }}
        onClick={() => setPlan("avulso")}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, border: plan === "avulso" ? "none" : "1.5px solid #7E7A9A", background: plan === "avulso" ? "var(--purple)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
            {plan === "avulso" && <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></svg>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 600 }}>Publicação Avulsa</div>
            <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", marginTop: 2 }}>Aparece no feed · Sem destaque</div>
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(13px,3.8vw,16px)", fontWeight: 700, color: "#F5F3FF" }}>R$9,90</div>
        </div>
      </div>

      <div
        className="plan-card plan-card-pro"
        style={{ cursor: "pointer" }}
        onClick={() => setPlan("mensal")}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, background: plan === "mensal" ? "var(--purple)" : "transparent", border: plan === "mensal" ? "none" : "1.5px solid rgba(138,99,255,.4)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2, flexShrink: 0 }}>
            {plan === "mensal" && <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></svg>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 600 }}>Plano Mensal ✨</div>
            <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#C4B5FD", marginTop: 2 }}>Todas as tarefas em <strong>destaque</strong> · Prioridade no feed</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(13px,3.8vw,16px)", fontWeight: 700, color: "#A78BFA" }}>R$19,90</div>
            <div style={{ fontSize: "clamp(9px,2.5vw,11px)", color: "#7E7A9A" }}>/mês</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "14px var(--hpad) 0" }}>
        <button className="btn btn-primary" onClick={() => navigate("/home")}>
          Publicar tarefa →
        </button>
      </div>
    </div>
  );
}
