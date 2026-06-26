import { Router } from "express";
import { db, conversationsTable, messagesTable, usersTable } from "@workspace/db";
import { eq, or, and, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

router.get("/conversations", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "x-user-id header required" });
    return;
  }

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
        .where(
          and(
            eq(messagesTable.conversationId, conv.id),
            eq(messagesTable.read, false),
            sql`${messagesTable.senderId} != ${userId}`
          )
        );
      const { passwordHash: _, ...safeOther } = other ?? { passwordHash: "" };
      return { ...conv, otherUser: safeOther, unreadCount: Number(unread[0]?.count ?? 0) };
    })
  );

  res.json(result);
});

router.post("/conversations", async (req, res) => {
  const { otherUserId, taskId } = req.body;
  const userId = req.headers["x-user-id"] as string;
  if (!userId || !otherUserId) {
    res.status(400).json({ error: "x-user-id header and otherUserId required" });
    return;
  }

  const existing = await db
    .select()
    .from(conversationsTable)
    .where(
      or(
        and(eq(conversationsTable.participantA, userId), eq(conversationsTable.participantB, otherUserId)),
        and(eq(conversationsTable.participantA, otherUserId), eq(conversationsTable.participantB, userId))
      )
    )
    .limit(1);

  if (existing.length) {
    res.status(201).json(existing[0]);
    return;
  }

  const [created] = await db
    .insert(conversationsTable)
    .values({ id: randomUUID(), participantA: userId, participantB: otherUserId, taskId: taskId ?? null })
    .returning();
  res.status(201).json(created);
});

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
  if (!senderId || !content) {
    res.status(400).json({ error: "senderId and content required" });
    return;
  }

  const [msg] = await db
    .insert(messagesTable)
    .values({ id: randomUUID(), conversationId: req.params.id, senderId, content })
    .returning();

  await db
    .update(conversationsTable)
    .set({ lastMessage: content, lastMessageAt: new Date() })
    .where(eq(conversationsTable.id, req.params.id));

  res.status(201).json(msg);
});

export default router;
