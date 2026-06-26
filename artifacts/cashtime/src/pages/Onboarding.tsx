import { useState } from "react";
import { useLocation } from "wouter";
import { getStoredUser } from "@/lib/auth";

const niches = [
  { icon: "💻", title: "Tecnologia & Design", sub: "Dev, UI/UX, suporte técnico" },
  { icon: "📦", title: "Entregas & Logística", sub: "Moto, carro, entrega a pé" },
  { icon: "🏠", title: "Serviços Domésticos", sub: "Limpeza, montagem, reparos" },
  { icon: "📝", title: "Administrativo & Pesquisa", sub: "Formulários, atendimento, dados" },
  { icon: "🎨", title: "Criativo & Marketing", sub: "Foto, vídeo, copy, social media" },
];

export default function Onboarding() {
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState(0);
  const user = getStoredUser();

  return (
    <div className="screen" style={{ paddingBottom: 80 }}>
      <div style={{ padding: "16px var(--hpad) 8px", display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" onClick={() => navigate("/register")} style={{ cursor: "pointer" }}>
          <path d="M19 12H5M12 5l-7 7 7 7" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A" }}>Passo 2 de 3</span>
      </div>

      <div className="progress-bar" style={{ margin: "0 var(--hpad) 20px" }}>
        <div className="progress-fill" style={{ width: "66%" }} />
      </div>

      {user && (
        <div style={{ padding: "0 var(--hpad) 6px" }}>
          <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#7E7A9A" }}>
            Olá, <strong style={{ color: "#C4B5FD" }}>{user.name.split(" ")[0]}</strong>! Quase pronto 🎉
          </div>
        </div>
      )}

      <div style={{ padding: "4px var(--hpad) 18px" }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(17px,5vw,21px)", fontWeight: 700, lineHeight: 1.3, marginBottom: 6 }}>
          Qual é o seu perfil?
        </div>
        <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#7E7A9A", lineHeight: 1.5 }}>
          Isso nos ajuda a mostrar as tarefas certas para você.
        </div>
      </div>

      {niches.map((n, i) => (
        <div
          key={i}
          className={`quiz-option ${selected === i ? "selected" : ""}`}
          onClick={() => setSelected(i)}
        >
          <div className="quiz-option-check">
            {selected === i && (
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <div>
            <div className="quiz-option-text" style={{ fontWeight: selected === i ? 500 : 400, fontSize: "clamp(13px,3.5vw,15px)" }}>
              {n.icon} {n.title}
            </div>
            <div style={{ fontSize: "clamp(11px,3vw,12px)", color: "#7E7A9A", marginTop: 2 }}>{n.sub}</div>
          </div>
        </div>
      ))}

      <div style={{ padding: "16px var(--hpad) 0" }}>
        <button className="btn btn-primary" onClick={() => navigate("/home")}>
          Continuar →
        </button>
      </div>
    </div>
  );
}
