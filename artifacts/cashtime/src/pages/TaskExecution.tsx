import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { api, type TaskWithCreator } from "@/lib/api";

const STEPS = [
  { key: "inicio", label: "Início" },
  { key: "execucao", label: "Execução" },
  { key: "conclusao", label: "Conclusão" },
  { key: "pagamento", label: "Pagamento" },
];

export default function TaskExecution() {
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const taskId = params.id ?? "";
  const [task, setTask] = useState<TaskWithCreator | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [notes, setNotes] = useState("");
  const [link, setLink] = useState("");
  const [showConfirmStart, setShowConfirmStart] = useState(false);
  const [startConfirmed, setStartConfirmed] = useState(false);

  useEffect(() => {
    if (!taskId) return;
    api.getTask(taskId).then(setTask).catch(console.error);
  }, [taskId]);

  const isRemote = task?.isRemote ?? false;

  function StepTracker() {
    return (
      <div style={{ margin: "0 var(--hpad) 16px", padding: "clamp(12px,3.5vw,15px)", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: "clamp(11px,3vw,13px)", fontWeight: 500 }}>⚡ Tarefa em andamento</div>
          <span className="pill pill-yellow">Em andamento</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {STEPS.map((step, i, arr) => (
            <div key={step.key} style={{ display: "flex", alignItems: "center", flex: i < arr.length - 1 ? 1 : 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: i < currentStep ? "var(--purple)" : i === currentStep ? "rgba(124,58,237,.2)" : "rgba(126,122,154,.12)", border: i === currentStep ? "2px solid var(--purple)" : i < currentStep ? "none" : "2px solid rgba(126,122,154,.2)" }}>
                  {i < currentStep
                    ? <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></svg>
                    : i === currentStep ? <div style={{ width: 8, height: 8, background: "var(--purple)", borderRadius: "50%" }} /> : null}
                </div>
                <div style={{ fontSize: "clamp(9px,2.5vw,11px)", color: (i <= currentStep) ? "#9F67FF" : "#7E7A9A", fontWeight: 600 }}>{step.label}</div>
              </div>
              {i < arr.length - 1 && (
                <div style={{ flex: 1, height: 2, background: i < currentStep ? "linear-gradient(90deg,var(--purple),rgba(124,58,237,.3))" : "rgba(126,122,154,.2)", margin: "0 6px", marginBottom: 16 }} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Step 0: Confirm arrival / start
  if (currentStep === 0) {
    return (
      <div className="screen" style={{ paddingBottom: 30 }}>
        <div style={{ padding: "16px var(--hpad) 8px", display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" onClick={() => navigate(`/task/${taskId}`)} style={{ cursor: "pointer" }}>
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div>
            <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#7E7A9A" }}>EXECUÇÃO DA TAREFA</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(14px,4vw,17px)", fontWeight: 700 }}>{task?.title ?? "..."}</div>
          </div>
        </div>
        <StepTracker />

        <div style={{ padding: "0 var(--hpad) 16px" }}>
          <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#C4B5FD", lineHeight: 1.6, marginBottom: 16 }}>
            {isRemote
              ? "Antes de começar, confirme que entendeu todos os requisitos da tarefa e está pronto para iniciar."
              : "Confirme sua chegada ao local da tarefa antes de começar o serviço."}
          </div>

          {!isRemote && (
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, background: "rgba(124,58,237,.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" stroke="#9F67FF" strokeWidth="1.8" />
                  <circle cx="12" cy="10" r="3" fill="rgba(159,103,255,.3)" stroke="#9F67FF" strokeWidth="1.8" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#C4B5FD", fontWeight: 500 }}>{task?.location || "Local a combinar"}</div>
                <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#7E7A9A" }}>Local da tarefa</div>
              </div>
            </div>
          )}

          <div style={{ background: "rgba(251,191,36,.06)", border: "1px solid rgba(251,191,36,.2)", borderRadius: 14, padding: "12px 14px", marginBottom: 20 }}>
            <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#FCD34D", fontWeight: 600, marginBottom: 4 }}>📋 Checklist antes de iniciar</div>
            {[
              isRemote ? "Leia a descrição completa da tarefa" : "Confirme que chegou ao local correto",
              isRemote ? "Tenha os recursos necessários disponíveis" : "Apresente-se ao contratante",
              "Confirme o prazo e as expectativas da entrega",
              "Em caso de dúvidas, use o chat para esclarecer antes de iniciar",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 6 }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(251,191,36,.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <div style={{ width: 6, height: 6, background: "#FBBF24", borderRadius: "50%" }} />
                </div>
                <div style={{ fontSize: "clamp(11px,3vw,12px)", color: "#7E7A9A", lineHeight: 1.4 }}>{item}</div>
              </div>
            ))}
          </div>

          {!startConfirmed ? (
            <button className="btn btn-primary" onClick={() => setShowConfirmStart(true)}>
              {isRemote ? "🚀 Confirmar início" : "📍 Confirmar chegada ao local"}
            </button>
          ) : (
            <div style={{ padding: "14px", background: "rgba(52,211,153,.08)", border: "1px solid rgba(52,211,153,.25)", borderRadius: 14, display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 20 }}>✅</div>
              <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#34D399", fontWeight: 600 }}>Início confirmado!</div>
            </div>
          )}
          {startConfirmed && (
            <button className="btn btn-secondary" onClick={() => setCurrentStep(1)}>
              Ir para execução →
            </button>
          )}
        </div>

        {/* Confirm start dialog */}
        {showConfirmStart && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 var(--hpad)" }}
            onClick={() => setShowConfirmStart(false)}>
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: "24px", width: "100%", maxWidth: 340, textAlign: "center" }}
              onClick={(e) => e.stopPropagation()}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{isRemote ? "🚀" : "📍"}</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(14px,4vw,17px)", fontWeight: 700, marginBottom: 8 }}>
                {isRemote ? "Iniciar a tarefa?" : "Confirmar chegada?"}
              </div>
              <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#7E7A9A", marginBottom: 20, lineHeight: 1.5 }}>
                {isRemote
                  ? "Ao confirmar, você declara que está pronto para iniciar o serviço."
                  : "Ao confirmar, você declara que está no local e pronto para iniciar."}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { setStartConfirmed(true); setShowConfirmStart(false); }}>Confirmar</button>
                <button className="btn btn-ghost" style={{ flex: 0, padding: "0 14px" }} onClick={() => setShowConfirmStart(false)}>Voltar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Step 1: Execution
  if (currentStep === 1) {
    return (
      <div className="screen" style={{ paddingBottom: 30 }}>
        <div style={{ padding: "16px var(--hpad) 8px", display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" onClick={() => setCurrentStep(0)} style={{ cursor: "pointer" }}>
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 700 }}>Executando</div>
        </div>
        <StepTracker />

        <div style={{ padding: "0 var(--hpad)" }}>
          <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#C4B5FD", lineHeight: 1.6, marginBottom: 16 }}>
            {isRemote
              ? "Registre o andamento do trabalho. Ao concluir, envie o resultado com uma descrição clara."
              : "Execute o serviço com atenção. Ao finalizar, registre a conclusão com as informações abaixo."}
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", marginBottom: 6 }}>
              {isRemote ? "Link/referência do trabalho (opcional)" : "Observações do serviço (opcional)"}
            </div>
            {isRemote ? (
              <input
                className="input"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://... (link para o trabalho entregue)"
              />
            ) : (
              <textarea
                className="input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Descreva o que foi feito, materiais usados, etc..."
                style={{ minHeight: 90, resize: "none" }}
              />
            )}
          </div>

          {isRemote && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", marginBottom: 6 }}>Descrição do trabalho realizado</div>
              <textarea
                className="input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Descreva o que foi feito e como atende os requisitos..."
                style={{ minHeight: 90, resize: "none" }}
              />
            </div>
          )}

          <div style={{ background: "rgba(124,58,237,.06)", border: "1px solid rgba(124,58,237,.2)", borderRadius: 14, padding: "12px 14px", marginBottom: 20 }}>
            <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#A78BFA", fontWeight: 600, marginBottom: 4 }}>🛡️ Proteção anti-fraude</div>
            <div style={{ fontSize: "clamp(11px,3vw,12px)", color: "#7E7A9A", lineHeight: 1.5 }}>
              Todas as confirmações são registradas com horário e dados do dispositivo. O contratante precisará confirmar a conclusão para que o pagamento seja liberado.
            </div>
          </div>

          <button className="btn btn-secondary" onClick={() => navigate(`/task-completion/${taskId}`)}>
            ✅ Concluir tarefa e enviar para revisão
          </button>
        </div>
      </div>
    );
  }

  return null;
}
