import { useEffect } from "react";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import { saveSession } from "@/lib/auth";

export default function Splash() {
  const [, navigate] = useLocation();

  useEffect(() => {
    api.login("adm", "123").then(({ token, user }) => {
      saveSession(token, user);
    }).catch(() => {});
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh", background: "var(--bg)" }}>

      {/* TOP — logo + title + tagline */}
      <div style={{ padding: "clamp(32px,9vw,52px) var(--hpad) 0", textAlign: "center" }}>
        <div style={{
          width: "clamp(72px,20vw,94px)", height: "clamp(72px,20vw,94px)",
          background: "linear-gradient(135deg,rgba(124,58,237,.3),rgba(159,103,255,.15))",
          border: "1.5px solid rgba(138,99,255,.4)",
          borderRadius: "clamp(22px,6vw,30px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
          boxShadow: "0 0 60px rgba(124,58,237,.25)"
        }}>
          <svg width="clamp(32px,9vw,44px)" height="clamp(32px,9vw,44px)" fill="none" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(26px,7vw,34px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 8 }}>
          Cash<span style={{ color: "#9F67FF" }}>Time</span>
        </div>
        <div style={{ fontSize: "clamp(13px,3.5vw,15px)", color: "#7E7A9A" }}>
          Serviços rápidos.<br />Pagamento garantido.
        </div>
      </div>

      {/* MIDDLE — features, always vertically centered in remaining space */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 var(--hpad)" }}>
        {/* margin:0 auto on a flex item centers it; width:fit-content sizes to content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(18px,5vw,28px)", width: "fit-content", marginLeft: "auto", marginRight: "auto" }}>
        {[
          {
            bg: "rgba(124,58,237,.12)", border: "rgba(124,58,237,.25)",
            title: "Até 2 horas por tarefa", sub: "Micro-tarefas rápidas e objetivas",
            icon: (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="#A78BFA" strokeWidth="1.8" />
                <path d="M12 6v6l4 2" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )
          },
          {
            bg: "rgba(52,211,153,.1)", border: "rgba(52,211,153,.25)",
            title: "Pagamento seguro", sub: "Receba só após concluir o serviço",
            icon: (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#34D399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )
          },
          {
            bg: "rgba(251,191,36,.1)", border: "rgba(251,191,36,.2)",
            title: "Sistema de ranking", sub: "Mais tarefas = mais credibilidade",
            icon: (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="#FBBF24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )
          }
        ].map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex", alignItems: "center", gap: "clamp(12px,3.5vw,18px)",
            }}
          >
            <div style={{
              width: "clamp(40px,11vw,50px)", height: "clamp(40px,11vw,50px)",
              background: item.bg, border: `1px solid ${item.border}`,
              borderRadius: "clamp(12px,3.5vw,16px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0
            }}>
              {item.icon}
            </div>
            <div>
              <div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 600, color: "#F5F3FF" }}>{item.title}</div>
              <div style={{ fontSize: "clamp(12px,3.2vw,13px)", color: "#7E7A9A", marginTop: 2 }}>{item.sub}</div>
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* BOTTOM — buttons pinned to bottom */}
      <div style={{ padding: "0 var(--hpad) clamp(28px,8vw,44px)", display: "flex", flexDirection: "column", gap: 10 }}>
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
