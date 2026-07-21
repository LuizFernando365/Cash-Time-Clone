import { Router } from "express";
import { db, tasksTable, usersTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

function levelFromTasks(n: number): number {
  if (n >= 100) return 5;
  if (n >= 50) return 4;
  if (n >= 25) return 3;
  if (n >= 10) return 2;
  return 1;
}

router.get("/tasks", async (req, res) => {
  const { category, status } = req.query as Record<string, string>;
  const conditions = [];
  if (status) conditions.push(eq(tasksTable.status, status));

  const rows = await db
    .select({ task: tasksTable, creator: usersTable })
    .from(tasksTable)
    .innerJoin(usersTable, eq(tasksTable.creatorId, usersTable.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(tasksTable.priority), desc(tasksTable.highlight), desc(tasksTable.createdAt));

  const result = rows
    .filter((r) => {
      if (!category) return true;
      return r.task.category === category || (r.task.categories ?? []).includes(category);
    })
    .map(({ task, creator }) => {
      const { passwordHash: _, ...safeCreator } = creator;
      return { ...task, creator: safeCreator };
    });

  res.json(result);
});

router.post("/tasks", async (req, res) => {
  const body = req.body;
  if (!body.title?.trim() || !body.description?.trim() || !body.creatorId) {
    res.status(400).json({ error: "Título, descrição e creatorId são obrigatórios" });
    return;
  }
  const categoryList: string[] = Array.isArray(body.categories) ? body.categories : (body.category ? [body.category] : []);
  const primaryCategory = categoryList[0] ?? body.category ?? "Geral";

  const task = {
    id: randomUUID(),
    title: body.title.trim(),
    description: body.description.trim(),
    category: primaryCategory,
    categoryEmoji: body.categoryEmoji ?? "📋",
    price: Number(body.price) || 0,
    estimatedTime: body.estimatedTime ?? "~1h",
    location: body.location ?? "",
    isRemote: Boolean(body.isRemote),
    lat: body.lat ?? null,
    lng: body.lng ?? null,
    tags: Array.isArray(body.tags) ? body.tags : [],
    categories: categoryList,
    priority: 0,
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

  if (!rows.length) { res.status(404).json({ error: "Tarefa não encontrada" }); return; }
  const { task, creator } = rows[0];
  const { passwordHash: _, ...safeCreator } = creator;
  res.json({ ...task, creator: safeCreator });
});

router.patch("/tasks/:id", async (req, res) => {
  const updates: Record<string, unknown> = {};
  if (req.body.status !== undefined)      updates.status = req.body.status;
  if (req.body.executorId !== undefined)  updates.executorId = req.body.executorId;
  if (req.body.highlight !== undefined)   updates.highlight = req.body.highlight;
  if (req.body.priority !== undefined)    updates.priority = req.body.priority;
  if (req.body.title !== undefined)       updates.title = String(req.body.title).trim();
  if (req.body.description !== undefined) updates.description = String(req.body.description).trim();
  if (req.body.price !== undefined)       updates.price = Number(req.body.price);
  if (req.body.location !== undefined)    updates.location = String(req.body.location).trim();
  if (req.body.estimatedTime !== undefined) updates.estimatedTime = req.body.estimatedTime;
  updates.updatedAt = new Date();

  const [updated] = await db
    .update(tasksTable)
    .set(updates)
    .where(eq(tasksTable.id, req.params.id))
    .returning();

  if (!updated) { res.status(404).json({ error: "Tarefa não encontrada" }); return; }

  if (req.body.status === "done") {
    const [creator] = await db.select().from(usersTable).where(eq(usersTable.id, updated.creatorId)).limit(1);
    if (creator) {
      const newCompleted = (creator.tasksCompleted ?? 0) + 1;
      const newPoints = (creator.rankPoints ?? 0) + 25;
      const newLevel = levelFromTasks(newCompleted);
      await db.update(usersTable)
        .set({ tasksCompleted: newCompleted, rankPoints: newPoints, rankLevel: newLevel })
        .where(eq(usersTable.id, updated.creatorId));
    }
  }
  res.json(updated);
});

router.delete("/tasks/:id", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  const [task] = await db.select().from(tasksTable).where(eq(tasksTable.id, req.params.id)).limit(1);
  if (!task) { res.status(404).json({ error: "Tarefa não encontrada" }); return; }
  if (task.creatorId !== userId) { res.status(403).json({ error: "Sem permissão para excluir esta tarefa" }); return; }
  await db.delete(tasksTable).where(eq(tasksTable.id, req.params.id));
  res.json({ ok: true });
});

router.post("/tasks/:id/boost", async (req, res) => {
  const { priority } = req.body as { priority: 1 | 2 };
  if (priority !== 1 && priority !== 2) { res.status(400).json({ error: "Priority must be 1 or 2" }); return; }
  const [updated] = await db
    .update(tasksTable)
    .set({ priority, highlight: priority === 2, updatedAt: new Date() })
    .where(eq(tasksTable.id, req.params.id))
    .returning();
  if (!updated) { res.status(404).json({ error: "Tarefa não encontrada" }); return; }
  res.json(updated);
});

export default router;
