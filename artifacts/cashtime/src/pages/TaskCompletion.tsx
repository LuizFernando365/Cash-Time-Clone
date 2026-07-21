import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { api } from "@/lib/api";

export default function TaskCompletion() {
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const taskId = params.id ?? "";
  const [completing, setCompleting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleComplete() {
    if (!taskId || completing) return;
    setCompleting(true);
    try {
      await api.completeTask(taskId);
      setDone(true);
    } catch (e) { console.error(e); }
    finally { setCompleting(false); }
  }

  if (done) {
    return (
      <div className="screen" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80dvh", padding: "0 var(--hpad)", gap: 16, textAlign: "center" }}>
        <div style={{ fontSize: 60, animation: "fadeInUp 0.4s ease" }}>🎉</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(20px,6vw,26px)", fontWeight: 800, color: "#34D399", animation: "fadeInUp 0.5s ease" }}>Tarefa concluída!</div>
        <div style={{ fontSize: "clamp(13px,3.5vw,15px)", color: "#C4B5FD", lineHeight: 1.5, animation: "fadeInUp 0.6s ease" }}>
          Parabéns! O pagamento será liberado após a confirmação do contratante.
        </div>
        <div style={{ background: "rgba(52,211,153,.07)", border: "1px solid rgba(52,211,153,.2)", borderRadius: 14, padding: "14px 20px", animation: "fadeInUp 0.7s ease", marginTop: 4 }}>
          <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#6EE7B7", fontWeight: 600, marginBottom: 4 }}>💰 Pagamento pendente</div>
          <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#7E7A9A" }}>Aguardando confirmação do contratante</div>
        </div>
        <button className="btn btn-primary" style={{ marginTop: 8, maxWidth: 280 }} onClick={() => navigate("/home")}>
          Voltar ao início →
        </button>
      </div>
    );
  }

  return (
    <div className="screen" style={{ paddingBottom: 30 }}>
      <div style={{ padding: "16px var(--hpad) 8px", display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" onClick={() => navigate(-1 as never)} style={{ cursor: "pointer" }}>
          <path d="M19 12H5M12 5l-7 7 7 7" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div style={{ padding: "0 var(--hpad) 12px" }}>
        <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#34D399", fontWeight: 600, marginBottom: 4 }}>✅ QUASE LÁ</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(16px,4.5vw,20px)", fontWeight: 700 }}>Confirmar conclusão</div>
      </div>

      <div style={{ margin: "0 var(--hpad) 12px", height: "clamp(130px,38vw,170px)", background: "var(--card)", border: "1px solid rgba(52,211,153,.3)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(52,211,153,.08),rgba(124,58,237,.08))" }} />
        <div style={{ textAlign: "center", zIndex: 1 }}>
          <div style={{ fontSize: "clamp(32px,10vw,44px)", marginBottom: 6 }}>📸</div>
          <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#6EE7B7", fontWeight: 500 }}>Foto de início registrada</div>
          <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#7E7A9A" }}>{new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} · Local da tarefa</div>
        </div>
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <span className="pill pill-green" style={{ fontSize: 10 }}>✓ Verificada</span>
        </div>
      </div>

      <div style={{ padding: "4px var(--hpad) 12px" }}>
        <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#C4B5FD", lineHeight: 1.5 }}>
          Serviço realizado? Tire a foto de conclusão para liberar seu pagamento.
        </div>
      </div>

      <div className="photo-box" style={{ borderColor: "rgba(52,211,153,.3)" }}>
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
          <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="#34D399" strokeWidth="1.5" />
          <circle cx="12" cy="13" r="4" stroke="#34D399" strokeWidth="1.5" />
        </svg>
        <p style={{ color: "#6EE7B7" }}>
          Foto de conclusão do serviço<br />
          <span style={{ color: "#7E7A9A" }}>Mostre o resultado do trabalho</span>
        </p>
        <button className="btn btn-green" style={{ padding: "11px 24px", width: "auto", marginTop: 4 }} onClick={handleComplete} disabled={completing}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="white" strokeWidth="1.8" />
            <circle cx="12" cy="13" r="4" stroke="white" strokeWidth="1.8" />
          </svg>
          {completing ? "Confirmando..." : "Confirmar conclusão"}
        </button>
      </div>

      <div style={{ margin: "0 var(--hpad)", background: "rgba(52,211,153,.07)", border: "1px solid rgba(52,211,153,.2)", borderRadius: 16, padding: "clamp(12px,3.5vw,15px)" }}>
        <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#6EE7B7", fontWeight: 600, marginBottom: 6 }}>💰 Pagamento pendente</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#C4B5FD" }}>Será liberado após a confirmação</div>
        </div>
      </div>
    </div>
  );
}
