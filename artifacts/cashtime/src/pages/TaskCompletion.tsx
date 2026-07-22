import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { api } from "@/lib/api";

type Step = "form" | "loading" | "success";

export default function TaskCompletion() {
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const taskId = params.id ?? "";
  const [step, setStep] = useState<Step>("form");
  const [description, setDescription] = useState("");
  const [deliverable, setDeliverable] = useState("");
  const [isRemote] = useState(() => {
    // Try to infer from referrer or just default
    return false;
  });

  async function handleSubmit() {
    if (!taskId) return;
    setStep("loading");
    try {
      await api.completeTask(taskId);
      setStep("success");
    } catch {
      setStep("form");
    }
  }

  if (step === "loading") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100dvh", background: "var(--bg)", gap: 20 }}>
        <div style={{ width: 56, height: 56, border: "4px solid rgba(124,58,237,.2)", borderTopColor: "#9F67FF", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(15px,4.5vw,18px)", fontWeight: 700, color: "#C4B5FD" }}>Enviando conclusão...</div>
        <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A" }}>Registrando com segurança</div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="screen" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80dvh", padding: "0 var(--hpad)", gap: 16, textAlign: "center" }}>
        <div style={{ fontSize: 60, animation: "fadeInUp 0.4s ease" }}>📬</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(20px,6vw,26px)", fontWeight: 800, color: "#C4B5FD", animation: "fadeInUp 0.5s ease" }}>
          Conclusão enviada!
        </div>
        <div style={{ fontSize: "clamp(13px,3.5vw,15px)", color: "#7E7A9A", lineHeight: 1.6, animation: "fadeInUp 0.6s ease" }}>
          O contratante recebeu sua conclusão e precisa confirmá-la para liberar o pagamento.
        </div>
        <div style={{ background: "rgba(124,58,237,.08)", border: "1px solid rgba(124,58,237,.25)", borderRadius: 16, padding: "16px 20px", animation: "fadeInUp 0.7s ease", marginTop: 4, width: "100%" }}>
          <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#A78BFA", fontWeight: 600, marginBottom: 8 }}>O que acontece agora?</div>
          {[
            "O contratante revisará seu trabalho",
            "Se aprovado, o pagamento é liberado automaticamente",
            "Em caso de ajustes, vocês combinam pelo chat",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 8 }}>
              <div style={{ width: 18, height: 18, background: "rgba(167,139,250,.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, color: "#A78BFA", fontWeight: 700 }}>{i + 1}</div>
              <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#C4B5FD", lineHeight: 1.4, textAlign: "left" }}>{item}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", marginTop: 8, animation: "fadeInUp 0.8s ease" }}>
          <button className="btn btn-primary" onClick={() => navigate(`/task/${taskId}`)}>
            Ver status da tarefa
          </button>
          <button className="btn btn-ghost" onClick={() => navigate("/home")}>
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen" style={{ paddingBottom: 30 }}>
      <div style={{ padding: "16px var(--hpad) 8px", display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" onClick={() => navigate(`/task-execution/${taskId}`)} style={{ cursor: "pointer" }}>
          <path d="M19 12H5M12 5l-7 7 7 7" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div>
          <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#34D399", fontWeight: 600 }}>ETAPA FINAL</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(14px,4vw,17px)", fontWeight: 700 }}>Enviar para revisão</div>
        </div>
      </div>

      <div style={{ margin: "0 var(--hpad) 16px", background: "rgba(52,211,153,.06)", border: "1px solid rgba(52,211,153,.2)", borderRadius: 16, padding: "clamp(14px,4vw,18px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <div style={{ fontSize: 28 }}>🛡️</div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 700, color: "#34D399" }}>Entrega protegida</div>
            <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#7E7A9A" }}>O pagamento só é liberado após a confirmação do contratante</div>
          </div>
        </div>
        <div style={{ fontSize: "clamp(11px,3vw,12px)", color: "#6EE7B7", lineHeight: 1.5 }}>
          Descreva claramente o que foi realizado. Informações detalhadas evitam disputas e agilizam a aprovação.
        </div>
      </div>

      <div style={{ padding: "0 var(--hpad)", display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", marginBottom: 6 }}>O que foi realizado? *</div>
          <textarea
            className="input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva detalhadamente o serviço prestado, materiais utilizados, tempo gasto..."
            style={{ minHeight: 100, resize: "none" }}
          />
        </div>

        <div>
          <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", marginBottom: 6 }}>Link ou referência do entregável (opcional)</div>
          <input
            className="input"
            type="text"
            value={deliverable}
            onChange={(e) => setDeliverable(e.target.value)}
            placeholder="Link, arquivo, número de referência..."
          />
        </div>

        <div style={{ background: "rgba(251,191,36,.06)", border: "1px solid rgba(251,191,36,.2)", borderRadius: 14, padding: "12px 14px" }}>
          <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#FCD34D", fontWeight: 600, marginBottom: 6 }}>⚠️ Antes de enviar</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              "O trabalho foi concluído conforme os requisitos",
              "Revisei a descrição da tarefa antes de enviar",
              "Estou disponível para esclarecimentos pelo chat",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <div style={{ width: 14, height: 14, border: "1.5px solid #FBBF24", borderRadius: 3, flexShrink: 0, marginTop: 2, background: "rgba(251,191,36,.15)" }} />
                <div style={{ fontSize: "clamp(11px,3vw,12px)", color: "#7E7A9A", lineHeight: 1.4 }}>{item}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn btn-green"
          onClick={handleSubmit}
          disabled={!description.trim()}
          style={{ opacity: !description.trim() ? 0.5 : 1 }}
        >
          📤 Enviar conclusão para revisão
        </button>
        <button className="btn btn-ghost" onClick={() => navigate(`/task-execution/${taskId}`)}>
          Voltar à execução
        </button>
      </div>
    </div>
  );
}
