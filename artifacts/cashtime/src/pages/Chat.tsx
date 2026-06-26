import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "wouter";
import BottomNav from "@/components/BottomNav";
import { api, type Message, type ConversationWithUser } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export default function Chat() {
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const convId = params.id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [conv, setConv] = useState<ConversationWithUser | null>(null);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const user = getStoredUser();

  useEffect(() => {
    if (!convId) return;
    api.listConversations().then((convs) => {
      const found = convs.find((c) => c.id === convId) ?? null;
      setConv(found);
    });
    api.listMessages(convId).then(setMessages).catch(console.error);
  }, [convId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!msg.trim() || !user || !convId) return;
    setSending(true);
    try {
      const sent = await api.sendMessage(convId, user.id, msg.trim());
      setMessages((prev) => [...prev, sent]);
      setMsg("");
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <div className="screen" style={{ paddingBottom: 132 }}>
        {/* Chat header */}
        <div style={{ padding: "10px var(--hpad)", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(138,99,255,.12)" }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" onClick={() => navigate("/messages")} style={{ cursor: "pointer" }}>
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {conv ? (
            <>
              <div className="avatar" style={{ width: 36, height: 36, borderRadius: 12, background: conv.otherUser.avatarBg, color: conv.otherUser.avatarColor }}>
                {conv.otherUser.avatarInitials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 600 }}>{conv.otherUser.name}</div>
                <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#7E7A9A" }}>Nível {conv.otherUser.rankLevel}</div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 600, color: "#7E7A9A" }}>Conversa</div>
          )}
        </div>

        {/* Messages */}
        <div style={{ display: "flex", flexDirection: "column", padding: "12px var(--hpad)", gap: 4 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", color: "#7E7A9A", marginTop: 40 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>👋</div>
              <div>Comece a conversa!</div>
            </div>
          )}
          {messages.map((m, i) => {
            const isMe = m.senderId === user?.id;
            const showTime = i === 0 || messages[i - 1].senderId !== m.senderId;
            return (
              <div key={m.id}>
                {showTime && (
                  <div className="chat-time" style={{ textAlign: isMe ? "right" : "left" }}>
                    {isMe ? "Você" : conv?.otherUser.name ?? "Eles"} · {formatTime(m.createdAt)}
                  </div>
                )}
                <div className={`chat-bubble ${isMe ? "chat-bubble-out" : "chat-bubble-in"}`}>
                  {m.content}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Chat input */}
      <div style={{ position: "absolute", bottom: 68, left: 0, right: 0, padding: "10px var(--hpad)", background: "rgba(13,11,20,0.97)", borderTop: "1px solid var(--border)", display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Digite uma mensagem..."
          style={{ flex: 1, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 100, padding: "10px 16px", fontSize: "clamp(12px,3.3vw,14px)", color: "#F5F3FF", outline: "none" }}
        />
        <div
          onClick={!sending ? send : undefined}
          style={{ width: 38, height: 38, background: msg.trim() ? "linear-gradient(135deg, var(--purple), var(--violet))" : "var(--card)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: msg.trim() ? "pointer" : "default", flexShrink: 0, border: "1px solid var(--border)", transition: "background 0.2s" }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke={msg.trim() ? "white" : "#7E7A9A"} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <BottomNav active="chat" />
    </>
  );
}
