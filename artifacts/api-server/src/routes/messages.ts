import { Router } from "express";
import { db, conversationsTable, messagesTable, usersTable } from "@workspace/db";
import { eq, or, and, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { subscribe, broadcast } from "../lib/sse";

const router = Router();

// ── Conversations ────────────────────────────────────────────

router.get("/conversations", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) { res.status(401).json({ error: "x-user-id header required" }); return; }

  const convs = await db
    .select()
    .from(conversationsTable)
    .where(or(eq(conversationsTable.participantA, userId), eq(conversationsTable.participantB, userId)))
    .orderBy(sql`${conversationsTable.lastMessageAt} desc nulls last`);

  const result = await Promise.all(
    convs.map(async (conv) => {
      const otherId = conv.participantA === userId ? conv.participantB : conv.participantA;
      const [other] = await db.select().from(usersTable).where(eq(usersTable.id, otherId)).limit(1);
      const unread = await db
        .select({ count: sql<number>`count(*)` })
        .from(messagesTable)
        .where(and(
          eq(messagesTable.conversationId, conv.id),
          eq(messagesTable.read, false),
          sql`${messagesTable.senderId} != ${userId}`
        ));
      const { passwordHash: _, ...safeOther } = other ?? { passwordHash: "" };
      return { ...conv, otherUser: safeOther, unreadCount: Number(unread[0]?.count ?? 0) };
    })
  );
  res.json(result);
});

router.post("/conversations", async (req, res) => {
  const { otherUserId, taskId } = req.body;
  const userId = req.headers["x-user-id"] as string;
  if (!userId || !otherUserId) { res.status(400).json({ error: "x-user-id header and otherUserId required" }); return; }

  const existing = await db
    .select()
    .from(conversationsTable)
    .where(or(
      and(eq(conversationsTable.participantA, userId), eq(conversationsTable.participantB, otherUserId)),
      and(eq(conversationsTable.participantA, otherUserId), eq(conversationsTable.participantB, userId))
    ))
    .limit(1);

  if (existing.length) { res.status(201).json(existing[0]); return; }

  const [created] = await db
    .insert(conversationsTable)
    .values({ id: randomUUID(), participantA: userId, participantB: otherUserId, taskId: taskId ?? null })
    .returning();
  res.status(201).json(created);
});

// ── SSE stream ───────────────────────────────────────────────

router.get("/conversations/:id/stream", (req, res) => {
  const userId = (req.query["userId"] as string) || (req.headers["x-user-id"] as string);
  if (!userId) { res.status(401).end(); return; }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  // Keep-alive ping every 20s
  const ping = setInterval(() => { try { res.write(": ping\n\n"); } catch { /* ignore */ } }, 20000);

  const unsubscribe = subscribe(req.params.id, userId, res);

  req.on("close", () => {
    clearInterval(ping);
    unsubscribe();
  });
});

// ── Messages ─────────────────────────────────────────────────

router.get("/conversations/:id/messages", async (req, res) => {
  const msgs = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, req.params.id))
    .orderBy(messagesTable.createdAt);
  res.json(msgs);
});

router.post("/conversations/:id/messages", async (req, res) => {
  const { senderId, content } = req.body;
  if (!senderId || !content) { res.status(400).json({ error: "senderId and content required" }); return; }

  const [msg] = await db
    .insert(messagesTable)
    .values({ id: randomUUID(), conversationId: req.params.id, senderId, content, reactions: "[]" })
    .returning();

  await db
    .update(conversationsTable)
    .set({ lastMessage: content, lastMessageAt: new Date() })
    .where(eq(conversationsTable.id, req.params.id));

  broadcast(req.params.id, "new_message", msg);
  res.status(201).json(msg);
});

// Edit a message
router.patch("/conversations/:id/messages/:msgId", async (req, res) => {
  const { content } = req.body;
  if (!content?.trim()) { res.status(400).json({ error: "content required" }); return; }

  const [updated] = await db
    .update(messagesTable)
    .set({ content: content.trim(), editedAt: new Date() })
    .where(and(eq(messagesTable.id, req.params.msgId), eq(messagesTable.conversationId, req.params.id)))
    .returning();

  if (!updated) { res.status(404).json({ error: "Mensagem não encontrada" }); return; }

  broadcast(req.params.id, "edit_message", updated);
  res.json(updated);
});

// Delete (soft-delete) a message
router.delete("/conversations/:id/messages/:msgId", async (req, res) => {
  const [updated] = await db
    .update(messagesTable)
    .set({ content: "Mensagem apagada", deletedAt: new Date() })
    .where(and(eq(messagesTable.id, req.params.msgId), eq(messagesTable.conversationId, req.params.id)))
    .returning();

  if (!updated) { res.status(404).json({ error: "Mensagem não encontrada" }); return; }

  broadcast(req.params.id, "edit_message", updated);
  res.json(updated);
});

// Toggle emoji reaction
router.post("/conversations/:id/messages/:msgId/react", async (req, res) => {
  const { userId, emoji } = req.body;
  if (!userId || !emoji) { res.status(400).json({ error: "userId and emoji required" }); return; }

  const [msg] = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.id, req.params.msgId))
    .limit(1);

  if (!msg) { res.status(404).json({ error: "Mensagem não encontrada" }); return; }

  type Reaction = { emoji: string; userId: string };
  let reactions: Reaction[] = [];
  try { reactions = JSON.parse(msg.reactions ?? "[]"); } catch { reactions = []; }

  const existing = reactions.find((r) => r.userId === userId);
  if (existing && existing.emoji === emoji) {
    // Same emoji — toggle off
    reactions = reactions.filter((r) => r.userId !== userId);
  } else {
    // Different emoji or no reaction — replace/add
    reactions = reactions.filter((r) => r.userId !== userId);
    reactions.push({ emoji, userId });
  }

  const [updated] = await db
    .update(messagesTable)
    .set({ reactions: JSON.stringify(reactions) })
    .where(eq(messagesTable.id, req.params.msgId))
    .returning();

  broadcast(req.params.id, "edit_message", updated);
  res.json(updated);
});

export default router;
