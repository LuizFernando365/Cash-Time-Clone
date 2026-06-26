import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import BottomNav from "@/components/BottomNav";
import { api, type ConversationWithUser } from "@/lib/api";

function timeAgo(iso?: string | null) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  return "ontem";
}

export default function Messages() {
  const [, navigate] = useLocation();
  const [convs, setConvs] = useState<ConversationWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listConversations().then(setConvs).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="screen" style={{ paddingBottom: 80 }}>
        <div style={{ padding: "16px var(--hpad) 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(17px,5vw,21px)", fontWeight: 700 }}>Mensagens</div>
            <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", marginTop: 2 }}>
              {loading ? "..." : `${convs.length} conversa${convs.length !== 1 ? "s" : ""}`}
            </div>
          </div>
        </div>

        <div className="search-bar">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" stroke="#7E7A9A" strokeWidth="1.8" />
            <path d="M21 21l-4.35-4.35" stroke="#7E7A9A" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Buscar conversa...
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#7E7A9A" }}>Carregando...</div>
        )}

        {!loading && convs.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px var(--hpad)", color: "#7E7A9A" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
            <div>Nenhuma conversa ainda</div>
          </div>
        )}

        {convs.map((c) => (
          <div
            key={c.id}
            style={{ padding: "12px var(--hpad)", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(138,99,255,.1)", cursor: "pointer" }}
            onClick={() => navigate(`/chat/${c.id}`)}
          >
            <div style={{ position: "relative" }}>
              <div className="avatar" style={{ width: "clamp(40px,11vw,48px)", height: "clamp(40px,11vw,48px)", borderRadius: 16, background: c.otherUser.avatarBg, color: c.otherUser.avatarColor, fontSize: "clamp(14px,4vw,18px)" }}>
                {c.otherUser.avatarInitials}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                <div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 600 }}>{c.otherUser.name}</div>
                <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#7E7A9A" }}>{timeAgo(c.lastMessageAt)}</div>
              </div>
              <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {c.lastMessage ?? "Conversa iniciada"}
              </div>
            </div>
            {c.unreadCount > 0 && (
              <div style={{ width: 18, height: 18, background: "#7C3AED", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                {c.unreadCount}
              </div>
            )}
          </div>
        ))}
      </div>
      <BottomNav active="chat" />
    </>
  );
}
