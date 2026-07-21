import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import BottomNav from "@/components/BottomNav";
import { api, type ConversationWithUser } from "@/lib/api";
import { useUnread } from "@/lib/unread";
import { getStoredUser } from "@/lib/auth";

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
  const [search, setSearch] = useState("");
  const { setUnreadConvs } = useUnread();
  const user = getStoredUser();

  useEffect(() => {
    api.listConversations()
      .then((data) => {
        setConvs(data);
        const total = data.filter((c) => c.unreadCount > 0).length;
        setUnreadConvs(total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = convs.filter((c) =>
    c.otherUser.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="screen" style={{ paddingBottom: 80 }}>
        <div style={{ padding: "16px var(--hpad) 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ animation: "fadeInUp 0.3s ease" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(17px,5vw,21px)", fontWeight: 700 }}>Mensagens</div>
            <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", marginTop: 2 }}>
              {loading ? "..." : `${convs.length} conversa${convs.length !== 1 ? "s" : ""}`}
            </div>
          </div>
        </div>

        <div style={{ margin: "0 var(--hpad) 12px", position: "relative", animation: "fadeInUp 0.35s ease" }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
            <circle cx="11" cy="11" r="8" stroke="#7E7A9A" strokeWidth="1.8" />
            <path d="M21 21l-4.35-4.35" stroke="#7E7A9A" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            style={{ width: "100%", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 100, padding: "10px 14px 10px 36px", fontSize: "clamp(12px,3.3vw,14px)", color: "#F5F3FF", outline: "none" }}
            placeholder="Buscar conversa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && <div style={{ textAlign: "center", padding: "40px 0", color: "#7E7A9A" }}>Carregando...</div>}

        {!loading && convs.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px var(--hpad)", color: "#7E7A9A", animation: "fadeInUp 0.4s ease" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>💬</div>
            <div style={{ fontSize: "clamp(14px,4vw,16px)", fontWeight: 600, color: "#C4B5FD", marginBottom: 6 }}>Nenhuma conversa ainda</div>
            <div style={{ fontSize: "clamp(12px,3.3vw,14px)", lineHeight: 1.5 }}>
              Encontre uma tarefa e entre em contato com o criador para começar uma conversa.
            </div>
            <button className="btn btn-primary" style={{ marginTop: 20, maxWidth: 260 }} onClick={() => navigate("/home")}>
              Ver tarefas →
            </button>
          </div>
        )}

        {filtered.map((c, i) => (
          <div
            key={c.id}
            style={{ padding: "12px var(--hpad)", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(138,99,255,.1)", cursor: "pointer", animation: `fadeInUp ${0.2 + i * 0.05}s ease` }}
            onClick={() => navigate(`/chat/${c.id}`)}
          >
            <div style={{ position: "relative" }}>
              <div className="avatar" style={{ width: "clamp(40px,11vw,48px)", height: "clamp(40px,11vw,48px)", borderRadius: 16, background: c.otherUser.avatarBg, color: c.otherUser.avatarColor, fontSize: "clamp(14px,4vw,18px)" }}>
                {c.otherUser.avatarInitials}
              </div>
              {c.unreadCount > 0 && (
                <div style={{ position: "absolute", top: -4, right: -4, width: 10, height: 10, background: "#34D399", borderRadius: "50%", border: "2px solid #0D0B14" }} />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                <div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: c.unreadCount > 0 ? 700 : 600, color: c.unreadCount > 0 ? "#F5F3FF" : "#C4B5FD" }}>{c.otherUser.name}</div>
                <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#7E7A9A" }}>{timeAgo(c.lastMessageAt)}</div>
              </div>
              <div style={{ fontSize: "clamp(11px,3vw,13px)", color: c.unreadCount > 0 ? "#C4B5FD" : "#7E7A9A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: c.unreadCount > 0 ? 500 : 400 }}>
                {c.lastMessage ?? "Conversa iniciada"}
              </div>
            </div>
            {c.unreadCount > 0 && (
              <div style={{ minWidth: 20, height: 20, background: "#7C3AED", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, padding: "0 5px" }}>
                {c.unreadCount > 9 ? "9+" : c.unreadCount}
              </div>
            )}
          </div>
        ))}
      </div>
      <BottomNav active="chat" />
    </>
  );
}
