import { useState } from "react";
import { useLocation, useParams } from "wouter";
import BottomNav from "@/components/BottomNav";

const messages = [
  { from: "them", text: "Olá! Vi que você tem interesse na minha tarefa. Você tem experiência com roteadores TP-Link?", time: "Marcos · 09:15" },
  { from: "me", text: "Sim! Já configurei bastante. Qual o modelo exato? Pode me mandar uma foto do equipamento?", time: "Você · 09:17" },
  { from: "them", text: "É um Archer C6. Vou te mandar foto agora. O problema é que cai toda hora, especialmente à noite.", time: "Marcos · 09:18" },
  { from: "them", type: "image", text: "roteador_tp-link.jpg", time: "" },
  { from: "me", text: "Entendido. Consigo resolver isso. Posso ir hoje à tarde, por volta das 14h. R$65 tá ótimo.", time: "Você · 09:20" },
  { from: "them", text: "Ótimo! Pode vir às 14h hoje? Endereço: Rua das Acácias, 450.", time: "Marcos · 09:21" },
];

export default function Chat() {
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const [msg, setMsg] = useState("");

  return (
    <>
      <div className="screen" style={{ paddingBottom: 132 }}>
        {/* Chat header */}
        <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(138,99,255,.12)" }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" onClick={() => navigate("/messages")} style={{ cursor: "pointer" }}>
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div className="avatar" style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(124,58,237,.2)", color: "#A78BFA" }}>MA</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Marcos Alves</div>
            <div style={{ fontSize: 11, color: "#34D399" }}>● online agora</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: "#9F67FF" }}>R$65</div>
            <span className="pill pill-green" style={{ fontSize: 10, padding: "2px 7px" }}>Em negociação</span>
          </div>
        </div>

        {/* Task mini card */}
        <div style={{ margin: "10px 16px", background: "rgba(124,58,237,.08)", border: "1px solid rgba(124,58,237,.2)", borderRadius: 10, padding: "10px 12px" }}>
          <div style={{ fontSize: 11, color: "#A78BFA", marginBottom: 3, fontWeight: 600 }}>TAREFA EM DISCUSSÃO</div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Configurar roteador wi-fi e resolver queda de sinal</div>
        </div>

        {/* Messages */}
        <div style={{ display: "flex", flexDirection: "column", padding: "0 16px" }}>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: "#7E7A9A", background: "var(--card)", padding: "3px 10px", borderRadius: 100 }}>Hoje · 09:15</span>
          </div>

          {messages.map((m, i) => (
            <div key={i}>
              {m.time && (
                <div className="chat-time" style={{ textAlign: m.from === "me" ? "right" : "left" }}>{m.time}</div>
              )}
              {m.type === "image" ? (
                <div className="chat-bubble chat-bubble-in" style={{ background: "rgba(124,58,237,.12)", border: "1px solid var(--border)" }}>
                  <div style={{ width: "100%", height: 70, background: "var(--surface)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="#7E7A9A" strokeWidth="1.8" />
                      <circle cx="8.5" cy="8.5" r="1.5" fill="#7E7A9A" />
                      <path d="M21 15l-5-5L5 21" stroke="#7E7A9A" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div style={{ fontSize: 11, color: "#7E7A9A" }}>{m.text}</div>
                </div>
              ) : (
                <div className={`chat-bubble ${m.from === "me" ? "chat-bubble-out" : "chat-bubble-in"}`}>
                  {m.text}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat input */}
      <div style={{ position: "absolute", bottom: 68, left: 0, right: 0, padding: "10px 16px", background: "rgba(13,11,20,0.97)", borderTop: "1px solid var(--border)", display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ flex: 1, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 100, padding: "10px 16px", fontSize: 13, color: "#7E7A9A" }}>
          Digite uma mensagem...
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ width: 38, height: 38, background: "var(--card)", border: "1px solid var(--border)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="#7E7A9A" strokeWidth="1.8" />
              <circle cx="8.5" cy="8.5" r="1.5" fill="#7E7A9A" />
            </svg>
          </div>
          <div style={{ width: 38, height: 38, background: "linear-gradient(135deg, var(--purple), var(--violet))", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      <BottomNav active="chat" />
    </>
  );
}
