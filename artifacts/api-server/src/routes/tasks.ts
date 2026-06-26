import { Router } from "express";
import { db, tasksTable, usersTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

router.get("/tasks", async (req, res) => {
  const { category, status } = req.query as Record<string, string>;
  const conditions = [];
  if (status) conditions.push(eq(tasksTable.status, status));

  const rows = await db
    .select({
      task: tasksTable,
      creator: usersTable,
    })
    .from(tasksTable)
    .innerJoin(usersTable, eq(tasksTable.creatorId, usersTable.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(tasksTable.highlight), desc(tasksTable.createdAt));

  const result = rows
    .filter((r) => !category || r.task.category === category)
    .map(({ task, creator }) => {
      const { passwordHash: _, ...safeCreator } = creator;
      return { ...task, creator: safeCreator };
    });

  res.json(result);
});

router.post("/tasks", async (req, res) => {
  const body = req.body;
  const task = {
    id: randomUUID(),
    title: body.title,
    description: body.description,
    category: body.category,
    categoryEmoji: body.categoryEmoji ?? "📋",
    price: Number(body.price),
    estimatedTime: body.estimatedTime,
    location: body.location,
    isRemote: Boolean(body.isRemote),
    lat: body.lat ?? null,
    lng: body.lng ?? null,
    tags: body.tags ?? [],
    status: "open",
    highlight: false,
    creatorId: body.creatorId,
    executorId: null,
  };
  const [created] = await db.insert(tasksTable).values(task).returning();
  res.status(201).json(created);
});

router.get("/tasks/:id", async (req, res) => {
  const rows = await db
    .select({ task: tasksTable, creator: usersTable })
    .from(tasksTable)
    .innerJoin(usersTable, eq(tasksTable.creatorId, usersTable.id))
    .where(eq(tasksTable.id, req.params.id))
    .limit(1);

  if (!rows.length) {
    res.status(404).json({ error: "Tarefa não encontrada" });
    return;
  }
  const { task, creator } = rows[0];
  const { passwordHash: _, ...safeCreator } = creator;
  res.json({ ...task, creator: safeCreator });
});

router.patch("/tasks/:id", async (req, res) => {
  const updates: Record<string, unknown> = {};
  if (req.body.status !== undefined) updates.status = req.body.status;
  if (req.body.executorId !== undefined) updates.executorId = req.body.executorId;
  if (req.body.highlight !== undefined) updates.highlight = req.body.highlight;
  updates.updatedAt = new Date();

  const [updated] = await db
    .update(tasksTable)
    .set(updates)
    .where(eq(tasksTable.id, req.params.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Tarefa não encontrada" });
    return;
  }
  res.json(updated);
});

export default router;
