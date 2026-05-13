import { useLocation } from "wouter";

export default function Splash() {
  const [, navigate] = useLocation();

  return (
    <div className="screen" style={{ paddingBottom: 40 }}>
      <div style={{ padding: "clamp(24px,8vw,40px) var(--hpad) 0", textAlign: "center" }}>
        <div style={{
          width: "clamp(72px,22vw,96px)", height: "clamp(72px,22vw,96px)",
          background: "linear-gradient(135deg,rgba(124,58,237,.3),rgba(159,103,255,.15))",
          border: "1.5px solid rgba(138,99,255,.4)",
          borderRadius: "clamp(22px,6vw,32px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px",
          boxShadow: "0 0 60px rgba(124,58,237,.25)"
        }}>
          <svg width="clamp(34px,9vw,46px)" height="clamp(34px,9vw,46px)" fill="none" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(24px,7vw,32px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 6 }}>
          Cash<span style={{ color: "#9F67FF" }}>Time</span>
        </div>
        <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#7E7A9A", marginBottom: "clamp(28px,8vw,42px)" }}>
          Serviços rápidos.<br />Pagamento garantido.
        </div>
      </div>

      <div style={{ padding: "0 var(--hpad)" }}>
        {[
          {
            bg: "rgba(124,58,237,.12)", border: "rgba(124,58,237,.25)", iconColor: "#A78BFA",
            title: "Até 2 horas por tarefa", sub: "Micro-tarefas rápidas e objetivas",
            icon: (
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="#A78BFA" strokeWidth="1.8" />
                <path d="M12 6v6l4 2" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )
          },
          {
            bg: "rgba(52,211,153,.1)", border: "rgba(52,211,153,.25)", iconColor: "#34D399",
            title: "Pagamento seguro", sub: "Receba só após concluir o serviço",
            icon: (
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#34D399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )
          },
          {
            bg: "rgba(251,191,36,.1)", border: "rgba(251,191,36,.2)", iconColor: "#FBBF24",
            title: "Sistema de ranking", sub: "Mais tarefas = mais credibilidade",
            icon: (
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="#FBBF24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )
          }
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "clamp(10px,3vw,14px)", marginBottom: i < 2 ? "clamp(16px,5vw,22px)" : "clamp(28px,8vw,44px)" }}>
            <div style={{ width: "clamp(34px,10vw,42px)", height: "clamp(34px,10vw,42px)", background: item.bg, border: `1px solid ${item.border}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {item.icon}
            </div>
            <div>
              <div style={{ fontSize: "clamp(12px,3.3vw,14px)", fontWeight: 600, color: "#F5F3FF" }}>{item.title}</div>
              <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A" }}>{item.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "0 var(--hpad)", display: "flex", flexDirection: "column", gap: 10 }}>
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
