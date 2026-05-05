import { useLocation } from "wouter";

export default function Splash() {
  const [, navigate] = useLocation();

  return (
    <div className="screen" style={{ paddingBottom: 40 }}>
      <div style={{ padding: "32px 22px 0", textAlign: "center" }}>
        <div style={{
          width: 90, height: 90,
          background: "linear-gradient(135deg,rgba(124,58,237,.3),rgba(159,103,255,.15))",
          border: "1.5px solid rgba(138,99,255,.4)",
          borderRadius: 30,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px",
          boxShadow: "0 0 60px rgba(124,58,237,.25)"
        }}>
          <svg width="44" height="44" fill="none" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, lineHeight: 1.1, marginBottom: 6 }}>
          Cash<span style={{ color: "#9F67FF" }}>Time</span>
        </div>
        <div style={{ fontSize: 13, color: "#7E7A9A", marginBottom: 36 }}>
          Serviços rápidos.<br />Pagamento garantido.
        </div>
      </div>

      <div style={{ padding: "0 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 38, height: 38, background: "rgba(124,58,237,.12)", border: "1px solid rgba(124,58,237,.25)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#A78BFA" strokeWidth="1.8" />
              <path d="M12 6v6l4 2" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#F5F3FF" }}>Até 2 horas por tarefa</div>
            <div style={{ fontSize: 12, color: "#7E7A9A" }}>Micro-tarefas rápidas e objetivas</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 38, height: 38, background: "rgba(52,211,153,.1)", border: "1px solid rgba(52,211,153,.25)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#34D399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#F5F3FF" }}>Pagamento seguro</div>
            <div style={{ fontSize: 12, color: "#7E7A9A" }}>Receba só após concluir o serviço</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
          <div style={{ width: 38, height: 38, background: "rgba(251,191,36,.1)", border: "1px solid rgba(251,191,36,.2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="#FBBF24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#F5F3FF" }}>Sistema de ranking</div>
            <div style={{ fontSize: 12, color: "#7E7A9A" }}>Mais tarefas = mais credibilidade</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        <button className="btn btn-primary" onClick={() => navigate("/onboarding")}>
          Criar conta grátis
        </button>
        <button className="btn btn-ghost" onClick={() => navigate("/home")}>
          Já tenho conta
        </button>
      </div>
    </div>
  );
}
