import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useParams } from "wouter";
import BottomNav from "@/components/BottomNav";
import { api, type Message, type ConversationWithUser } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";

const QUICK_EMOJIS = ["❤️", "😂", "😮", "😢", "😡", "👍"];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

type Reaction = { emoji: string; userId: string };

function parseReactions(raw: string | undefined): Reaction[] {
  try { return JSON.parse(raw ?? "[]"); } catch { return []; }
}

interface MsgAction {
  msgId: string;
  x: number;
  y: number;
  isMe: boolean;
  deleted: boolean;
}

export default function Chat() {
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const convId = params.id;
  const user = getStoredUser();

  const [messages, setMessages] = useState<Message[]>([]);
  const [conv, setConv] = useState<ConversationWithUser | null>(null);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [action, setAction] = useState<MsgAction | null>(null);
  const [editing, setEditing] = useState<{ id: string; content: string } | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sseRef = useRef<EventSource | null>(null);

  // Load initial data + set up SSE
  useEffect(() => {
    if (!convId || !user) return;

    api.listConversations().then((convs) => {
      setConv(convs.find((c) => c.id === convId) ?? null);
    });
    api.listMessages(convId).then(setMessages).catch(console.error);

    // SSE real-time stream
    const url = `/api/conversations/${convId}/stream?userId=${encodeURIComponent(user.id)}`;
    const es = new EventSource(url);
    sseRef.current = es;

    es.addEventListener("new_message", (e) => {
      const newMsg: Message = JSON.parse(e.data);
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    es.addEventListener("edit_message", (e) => {
      const updated: Message = JSON.parse(e.data);
      setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    });

    return () => {
      es.close();
      sseRef.current = null;
    };
  }, [convId, user?.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!msg.trim() || !user || !convId) return;
    setSending(true);
    try {
      await api.sendMessage(convId, user.id, msg.trim());
      setMsg("");
    } catch (e) { console.error(e); }
    finally { setSending(false); }
  }

  async function doDelete(msgId: string) {
    if (!convId) return;
    setAction(null);
    await api.deleteMessage(convId, msgId);
  }

  async function doEdit() {
    if (!editing || !convId) return;
    await api.editMessage(convId, editing.id, editing.content);
    setEditing(null);
  }

  async function doReact(msgId: string, emoji: string) {
    if (!convId || !user) return;
    setAction(null);
    setShowEmoji(false);
    await api.reactMessage(convId, msgId, user.id, emoji);
  }

  // Long-press handlers
  function startPress(msgId: string, e: React.TouchEvent | React.MouseEvent, isMe: boolean, deleted: boolean) {
    if (deleted) return;
    const touch = "touches" in e ? e.touches[0] : e;
    const x = touch.clientX;
    const y = touch.clientY;
    pressTimer.current = setTimeout(() => {
      setAction({ msgId, x, y, isMe, deleted });
      setShowEmoji(false);
      if (navigator.vibrate) navigator.vibrate(40);
    }, 450);
  }

  function cancelPress() {
    if (pressTimer.current) { clearTimeout(pressTimer.current); pressTimer.current = null; }
  }

  const closeAction = useCallback(() => { setAction(null); setShowEmoji(false); }, []);

  return (
    <>
      <div className="screen" style={{ paddingBottom: 140 }}>
        {/* Header */}
        <div style={{ padding: "10px var(--hpad)", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(138,99,255,.12)", position: "sticky", top: 0, background: "var(--bg)", zIndex: 10 }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" onClick={() => navigate("/messages")} style={{ cursor: "pointer", flexShrink: 0 }}>
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {conv ? (
            <>
              <div className="avatar" style={{ width: 36, height: 36, borderRadius: 12, background: conv.otherUser.avatarBg, color: conv.otherUser.avatarColor, flexShrink: 0 }}>
                {conv.otherUser.avatarInitials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 600 }}>{conv.otherUser.name}</div>
                <div style={{ fontSize: "clamp(10px,2.8vw,11px)", color: "#34D399", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34D399", display: "inline-block" }} />
                  Online agora
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 600, color: "#7E7A9A" }}>Conversa</div>
          )}
        </div>

        {/* Messages list */}
        <div ref={listRef} style={{ display: "flex", flexDirection: "column", padding: "12px var(--hpad)", gap: 2 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", color: "#7E7A9A", marginTop: 48 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>👋</div>
              <div style={{ fontSize: "clamp(13px,3.5vw,15px)", color: "#C4B5FD", fontWeight: 600, marginBottom: 4 }}>Comece a conversa!</div>
              <div style={{ fontSize: "clamp(11px,3vw,13px)" }}>Envie uma mensagem para {conv?.otherUser.name ?? "a outra pessoa"}.</div>
            </div>
          )}

          {messages.map((m, i) => {
            const isMe = m.senderId === user?.id;
            const isDeleted = !!m.deletedAt;
            const isEdited = !!m.editedAt && !isDeleted;
            const showLabel = i === 0 || messages[i - 1].senderId !== m.senderId;
            const reactions = parseReactions(m.reactions);
            const myReaction = reactions.find((r) => r.userId === user?.id);

            // Group reactions by emoji
            const reactionMap: Record<string, number> = {};
            for (const r of reactions) reactionMap[r.emoji] = (reactionMap[r.emoji] ?? 0) + 1;

            return (
              <div
                key={m.id}
                style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start", marginBottom: reactions.length > 0 ? 12 : 2 }}
              >
                {showLabel && (
                  <div style={{ fontSize: "clamp(10px,2.8vw,11px)", color: "#7E7A9A", marginBottom: 3, marginTop: 8, padding: isMe ? "0 2px" : "0 2px" }}>
                    {isMe ? "Você" : conv?.otherUser.name ?? "Eles"} · {formatTime(m.createdAt)}
                  </div>
                )}

                <div
                  style={{ position: "relative", maxWidth: "80%" }}
                  onTouchStart={(e) => startPress(m.id, e, isMe, isDeleted)}
                  onTouchEnd={cancelPress}
                  onTouchMove={cancelPress}
                  onMouseDown={(e) => startPress(m.id, e, isMe, isDeleted)}
                  onMouseUp={cancelPress}
                  onMouseLeave={cancelPress}
                  onContextMenu={(e) => { e.preventDefault(); startPress(m.id, e, isMe, isDeleted); }}
                >
                  <div
                    style={{
                      padding: "9px 13px",
                      borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: isDeleted
                        ? "rgba(126,122,154,.15)"
                        : isMe
                        ? "linear-gradient(135deg,#7C3AED,#9F67FF)"
                        : "var(--card)",
                      border: isDeleted ? "1px dashed rgba(126,122,154,.3)" : isMe ? "none" : "1px solid var(--border)",
                      color: isDeleted ? "#7E7A9A" : isMe ? "white" : "#F5F3FF",
                      fontSize: "clamp(13px,3.5vw,15px)",
                      lineHeight: 1.45,
                      fontStyle: isDeleted ? "italic" : "normal",
                      wordBreak: "break-word",
                      userSelect: "none",
                      WebkitUserSelect: "none",
                    }}
                  >
                    {m.content}
                  </div>

                  {/* Edited indicator */}
                  {isEdited && (
                    <div style={{ fontSize: 10, color: "#7E7A9A", marginTop: 2, textAlign: isMe ? "right" : "left" }}>editada</div>
                  )}

                  {/* Reactions bubble */}
                  {Object.keys(reactionMap).length > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: -18,
                        [isMe ? "left" : "right"]: 0,
                        display: "flex",
                        gap: 3,
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 100,
                        padding: "2px 7px",
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(0,0,0,.2)",
                      }}
                      onClick={() => !isDeleted && doReact(m.id, Object.keys(reactionMap)[0])}
                    >
                      {Object.entries(reactionMap).map(([emoji, count]) => (
                        <span key={emoji} style={{ fontSize: 13, lineHeight: 1 }}>
                          {emoji}{count > 1 ? <span style={{ fontSize: 10, color: "#A78BFA", marginLeft: 1 }}>{count}</span> : null}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Message action overlay */}
      {action && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 500 }}
          onClick={closeAction}
        >
          {/* Emoji row */}
          <div style={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            top: Math.min(action.y - 72, window.innerHeight - 130),
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 100,
            padding: "8px 14px",
            display: "flex",
            gap: 10,
            zIndex: 501,
            boxShadow: "0 8px 32px rgba(0,0,0,.4)",
          }} onClick={(e) => e.stopPropagation()}>
            {QUICK_EMOJIS.map((emoji) => (
              <div
                key={emoji}
                style={{ fontSize: 24, cursor: "pointer", lineHeight: 1, transition: "transform .1s" }}
                onTouchStart={(e) => { e.currentTarget.style.transform = "scale(1.35)"; }}
                onTouchEnd={(e) => { e.currentTarget.style.transform = ""; doReact(action.msgId, emoji); }}
                onClick={() => doReact(action.msgId, emoji)}
              >
                {emoji}
              </div>
            ))}
          </div>

          {/* Action menu */}
          <div style={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            top: Math.min(action.y - 2, window.innerHeight - 200),
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            overflow: "hidden",
            minWidth: 180,
            zIndex: 501,
            boxShadow: "0 8px 32px rgba(0,0,0,.5)",
          }} onClick={(e) => e.stopPropagation()}>
            {/* Edit — only own messages, not deleted */}
            {action.isMe && !action.deleted && (
              <div
                style={{ padding: "13px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", fontSize: "clamp(13px,3.5vw,15px)", borderBottom: "1px solid var(--border)" }}
                onClick={() => {
                  const m = messages.find((x) => x.id === action.msgId);
                  if (m) setEditing({ id: m.id, content: m.content });
                  setAction(null);
                }}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
                  <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Editar
              </div>
            )}
            {/* Delete — only own messages */}
            {action.isMe && !action.deleted && (
              <div
                style={{ padding: "13px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", fontSize: "clamp(13px,3.5vw,15px)", color: "#F87171" }}
                onClick={() => doDelete(action.msgId)}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6" stroke="#F87171" strokeWidth="2" strokeLinecap="round" />
                  <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" stroke="#F87171" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Apagar
              </div>
            )}
            {/* Copy — always available */}
            {!action.deleted && (
              <div
                style={{ padding: "13px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", fontSize: "clamp(13px,3.5vw,15px)", borderTop: action.isMe ? "1px solid var(--border)" : undefined }}
                onClick={() => {
                  const m = messages.find((x) => x.id === action.msgId);
                  if (m) navigator.clipboard?.writeText(m.content).catch(() => {});
                  setAction(null);
                }}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <rect x="9" y="9" width="13" height="13" rx="2" stroke="#7E7A9A" strokeWidth="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="#7E7A9A" strokeWidth="2" />
                </svg>
                <span style={{ color: "#7E7A9A" }}>Copiar</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit bar */}
      {editing && (
        <div style={{ position: "fixed", bottom: 128, left: 0, right: 0, padding: "8px var(--hpad)", background: "rgba(124,58,237,.1)", borderTop: "1px solid rgba(124,58,237,.3)", display: "flex", gap: 8, alignItems: "center", zIndex: 100 }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
            <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: "clamp(11px,3vw,12px)", color: "#A78BFA", flex: 1 }}>Editando mensagem</span>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ cursor: "pointer" }} onClick={() => setEditing(null)}>
            <path d="M18 6L6 18M6 6l12 12" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* Chat input */}
      <div style={{ position: "fixed", bottom: 68, left: 0, right: 0, padding: "10px var(--hpad)", background: "rgba(13,11,20,.97)", borderTop: "1px solid var(--border)", display: "flex", gap: 8, alignItems: "center", zIndex: 99 }}>
        <input
          ref={inputRef}
          type="text"
          value={editing ? editing.content : msg}
          onChange={(e) => {
            if (editing) setEditing({ ...editing, content: e.target.value });
            else setMsg(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (editing) doEdit(); else send();
            }
            if (e.key === "Escape" && editing) setEditing(null);
          }}
          placeholder={editing ? "Editar mensagem..." : "Digite uma mensagem..."}
          style={{ flex: 1, background: "var(--card)", border: `1px solid ${editing ? "rgba(124,58,237,.5)" : "var(--border)"}`, borderRadius: 100, padding: "10px 16px", fontSize: "clamp(12px,3.3vw,14px)", color: "#F5F3FF", outline: "none" }}
        />
        <div
          onClick={!sending ? (editing ? doEdit : send) : undefined}
          style={{ width: 38, height: 38, background: (editing ? editing.content.trim() : msg.trim()) ? "linear-gradient(135deg,var(--purple),var(--violet))" : "var(--card)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: (editing ? editing.content.trim() : msg.trim()) ? "pointer" : "default", flexShrink: 0, border: "1px solid var(--border)", transition: "background .2s" }}
        >
          {editing ? (
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5" stroke={(editing.content.trim()) ? "white" : "#7E7A9A"} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke={msg.trim() ? "white" : "#7E7A9A"} strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </div>
      </div>

      <BottomNav active="chat" />
    </>
  );
}
