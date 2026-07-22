import { Router } from "express";
import { db, tasksTable, usersTable, taskApplicationsTable } from "@workspace/db";
import { eq, desc, and, ne } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

const TIME_XP: Record<string, number> = {
  "~30 min": 5, "~45 min": 10, "até 1h": 15, "~1h30": 20, "~2h": 25,
};
function xpForTime(t: string): number {
  return TIME_XP[t] ?? 10;
}
function levelFromXP(xp: number): number {
  if (xp >= 500) return 5;
  if (xp >= 200) return 4;
  if (xp >= 100) return 3;
  if (xp >= 30) return 2;
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

  try {
    const [created] = await db.insert(tasksTable).values(task).returning();
    res.status(201).json(created);
  } catch (e) {
    req.log.error(e, "Failed query: insert into \"tasks\"");
    res.status(500).json({ error: "Erro ao criar tarefa" });
  }
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

  // When executor confirms done → awaiting_confirmation (creator must confirm)
  // When creator confirms → status = done → update executor stats
  if (req.body.status === "done" && updated.executorId) {
    const [executor] = await db.select().from(usersTable).where(eq(usersTable.id, updated.executorId)).limit(1);
    if (executor) {
      const xp = xpForTime(updated.estimatedTime);
      const newPoints = (executor.rankPoints ?? 0) + xp;
      const newCompleted = (executor.tasksCompleted ?? 0) + 1;
      const newEarned = (executor.totalEarned ?? 0) + updated.price;
      const newLevel = levelFromXP(newPoints);
      await db.update(usersTable)
        .set({ tasksCompleted: newCompleted, rankPoints: newPoints, totalEarned: newEarned, rankLevel: newLevel })
        .where(eq(usersTable.id, updated.executorId));
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

// ── Applications ──────────────────────────────────────────

router.post("/tasks/:id/apply", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  const taskId = req.params.id;
  const { message } = req.body as { message?: string };

  const [task] = await db.select().from(tasksTable).where(eq(tasksTable.id, taskId)).limit(1);
  if (!task) { res.status(404).json({ error: "Tarefa não encontrada" }); return; }
  if (task.creatorId === userId) { res.status(403).json({ error: "Você não pode se candidatar à sua própria tarefa" }); return; }
  if (task.status !== "open") { res.status(400).json({ error: "Esta tarefa não está mais disponível para candidaturas" }); return; }

  // Check for existing application
  const existing = await db.select().from(taskApplicationsTable)
    .where(and(eq(taskApplicationsTable.taskId, taskId), eq(taskApplicationsTable.applicantId, userId)))
    .limit(1);
  if (existing.length) { res.status(409).json({ error: "Você já se candidatou a esta tarefa" }); return; }

  const [app] = await db.insert(taskApplicationsTable).values({
    id: randomUUID(), taskId, applicantId: userId, message: message ?? null, status: "pending",
  }).returning();

  res.status(201).json(app);
});

router.get("/tasks/:id/applications", async (req, res) => {
  const taskId = req.params.id;
  const apps = await db.select({
    app: taskApplicationsTable,
    applicant: usersTable,
  })
    .from(taskApplicationsTable)
    .innerJoin(usersTable, eq(taskApplicationsTable.applicantId, usersTable.id))
    .where(eq(taskApplicationsTable.taskId, taskId))
    .orderBy(desc(taskApplicationsTable.createdAt));

  const result = apps.map(({ app, applicant }) => {
    const { passwordHash: _, ...safeApplicant } = applicant;
    return { ...app, applicant: safeApplicant };
  });

  res.json(result);
});

router.post("/tasks/:id/applications/:appId/approve", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  const { id: taskId, appId } = req.params;

  const [task] = await db.select().from(tasksTable).where(eq(tasksTable.id, taskId)).limit(1);
  if (!task) { res.status(404).json({ error: "Tarefa não encontrada" }); return; }
  if (task.creatorId !== userId) { res.status(403).json({ error: "Sem permissão" }); return; }

  const [app] = await db.select().from(taskApplicationsTable).where(eq(taskApplicationsTable.id, appId)).limit(1);
  if (!app) { res.status(404).json({ error: "Candidatura não encontrada" }); return; }

  // Approve this one
  await db.update(taskApplicationsTable).set({ status: "approved" }).where(eq(taskApplicationsTable.id, appId));

  // Reject all others for this task
  await db.update(taskApplicationsTable).set({ status: "rejected" })
    .where(and(eq(taskApplicationsTable.taskId, taskId), ne(taskApplicationsTable.id, appId)));

  // Update task: in_progress + executorId
  const [updated] = await db.update(tasksTable)
    .set({ status: "in_progress", executorId: app.applicantId, updatedAt: new Date() })
    .where(eq(tasksTable.id, taskId))
    .returning();

  res.json(updated);
});

router.get("/tasks/:id/my-application", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  const apps = await db.select().from(taskApplicationsTable)
    .where(and(eq(taskApplicationsTable.taskId, req.params.id), eq(taskApplicationsTable.applicantId, userId)))
    .limit(1);
  res.json(apps[0] ?? null);
});

export default router;
