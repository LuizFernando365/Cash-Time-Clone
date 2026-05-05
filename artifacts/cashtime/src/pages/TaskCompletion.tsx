import { useLocation } from "wouter";

export default function TaskCompletion() {
  const [, navigate] = useLocation();

  return (
    <div className="screen" style={{ paddingBottom: 30 }}>
      <div style={{ padding: "16px 22px 12px" }}>
        <div style={{ fontSize: 12, color: "#34D399", fontWeight: 600, marginBottom: 4 }}>✅ QUASE LÁ</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700 }}>Confirmar conclusão</div>
      </div>

      {/* Photo taken */}
      <div style={{ margin: "0 16px 12px", height: 160, background: "var(--card)", border: "1px solid rgba(52,211,153,.3)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(52,211,153,.08),rgba(124,58,237,.08))" }} />
        <div style={{ textAlign: "center", zIndex: 1 }}>
          <div style={{ fontSize: 40, marginBottom: 6 }}>📸</div>
          <div style={{ fontSize: 12, color: "#6EE7B7", fontWeight: 500 }}>Foto de início registrada</div>
          <div style={{ fontSize: 11, color: "#7E7A9A" }}>14:02 · Rua das Acácias, 450</div>
        </div>
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <span className="pill pill-green" style={{ fontSize: 10 }}>✓ Verificada</span>
        </div>
      </div>

      <div style={{ padding: "4px 22px 12px" }}>
        <div style={{ fontSize: 13, color: "#C4B5FD", lineHeight: 1.5 }}>
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
        <button className="btn btn-green" style={{ padding: "11px 24px", width: "auto", marginTop: 4 }} onClick={() => navigate("/home")}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="white" strokeWidth="1.8" />
            <circle cx="12" cy="13" r="4" stroke="white" strokeWidth="1.8" />
          </svg>
          Tirar foto final
        </button>
      </div>

      {/* Payment pending */}
      <div style={{ margin: "0 16px", background: "rgba(52,211,153,.07)", border: "1px solid rgba(52,211,153,.2)", borderRadius: 16, padding: 14 }}>
        <div style={{ fontSize: 12, color: "#6EE7B7", fontWeight: 600, marginBottom: 6 }}>💰 Pagamento pendente</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 13, color: "#C4B5FD" }}>Será liberado após a confirmação</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: "#34D399" }}>R$65</div>
        </div>
      </div>
    </div>
  );
}
