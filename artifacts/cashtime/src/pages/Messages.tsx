import { useLocation } from "wouter";
import BottomNav from "@/components/BottomNav";

const conversations = [
  {
    id: "marcos",
    initials: "MA",
    name: "Marcos Alves",
    lastMsg: "Ótimo! Pode vir às 14h hoje?",
    task: "💻 Configurar roteador · R$65",
    time: "agora",
    unread: 2,
    online: true,
    bg: "rgba(124,58,237,.2)",
    color: "#A78BFA",
    opacity: 1,
  },
  {
    id: "rafael",
    initials: "RF",
    name: "Rafael F.",
    lastMsg: "Você: Tudo certo, mandei no e-mail!",
    task: "🎨 Editar fotos · R$50",
    time: "1h",
    unread: 0,
    online: false,
    bg: "rgba(52,211,153,.12)",
    color: "#34D399",
    opacity: 0.7,
  },
  {
    id: "carla",
    initials: "CS",
    name: "Carla Souza",
    lastMsg: "Tarefa concluída ✅",
    task: "📦 Entrega · R$30",
    time: "ontem",
    unread: 0,
    online: false,
    bg: "rgba(251,191,36,.1)",
    color: "#FCD34D",
    opacity: 0.5,
  },
];

export default function Messages() {
  const [, navigate] = useLocation();

  return (
    <>
      <div className="screen" style={{ paddingBottom: 80 }}>
        <div style={{ padding: "16px 22px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700 }}>Mensagens</div>
            <div style={{ fontSize: 12, color: "#7E7A9A", marginTop: 2 }}>3 conversas ativas</div>
          </div>
        </div>

        <div className="search-bar">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" stroke="#7E7A9A" strokeWidth="1.8" />
            <path d="M21 21l-4.35-4.35" stroke="#7E7A9A" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Buscar conversa...
        </div>

        {conversations.map((c) => (
          <div
            key={c.id}
            style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(138,99,255,.1)", opacity: c.opacity, cursor: "pointer" }}
            onClick={() => navigate(`/chat/${c.id}`)}
          >
            <div style={{ position: "relative" }}>
              <div className="avatar" style={{ width: 46, height: 46, borderRadius: 16, background: c.bg, color: c.color, fontSize: 17 }}>{c.initials}</div>
              {c.online && (
                <div style={{ width: 10, height: 10, background: "#34D399", borderRadius: "50%", border: "2px solid var(--bg)", position: "absolute", bottom: -1, right: -1 }} />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: "#7E7A9A" }}>{c.time}</div>
              </div>
              <div style={{ fontSize: 12, color: "#7E7A9A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.lastMsg}</div>
              <div style={{ fontSize: 11, color: "#9F67FF", marginTop: 3 }}>{c.task}</div>
            </div>
            {c.unread > 0 && (
              <div style={{ width: 18, height: 18, background: "#7C3AED", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                {c.unread}
              </div>
            )}
          </div>
        ))}
      </div>
      <BottomNav active="chat" />
    </>
  );
}
