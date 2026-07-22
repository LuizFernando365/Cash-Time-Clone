import { Router } from "express";
import { db, usersTable, tasksTable } from "@workspace/db";
import { eq, or, desc, gt } from "drizzle-orm";

const router = Router();

router.get("/users/:id", async (req, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.params.id)).limit(1);
  if (!user) { res.status(404).json({ error: "Usuário não encontrado" }); return; }
  const { passwordHash: _, ...safe } = user;
  res.json(safe);
});

router.put("/users/:id", async (req, res) => {
  const { name, bio, city, avatarBg, avatarColor, avatarInitials } = req.body;
  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = String(name).trim();
  if (bio !== undefined) updates.bio = String(bio).trim() || null;
  if (city !== undefined) updates.city = String(city).trim() || null;
  if (avatarBg !== undefined) updates.avatarBg = avatarBg;
  if (avatarColor !== undefined) updates.avatarColor = avatarColor;
  if (avatarInitials !== undefined) updates.avatarInitials = avatarInitials;

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "Nenhum campo para atualizar" });
    return;
  }

  const [updated] = await db.update(usersTable).set(updates).where(eq(usersTable.id, req.params.id)).returning();
  if (!updated) { res.status(404).json({ error: "Usuário não encontrado" }); return; }
  const { passwordHash: _, ...safe } = updated;
  res.json(safe);
});

router.post("/users/:id/plan", async (req, res) => {
  const { plan } = req.body as { plan: string };
  if (!["free", "pro"].includes(plan)) { res.status(400).json({ error: "Plano inválido" }); return; }
  const [updated] = await db.update(usersTable).set({ plan }).where(eq(usersTable.id, req.params.id)).returning();
  if (!updated) { res.status(404).json({ error: "Usuário não encontrado" }); return; }
  const { passwordHash: _, ...safe } = updated;
  res.json(safe);
});

router.post("/users/:id/withdraw", async (req, res) => {
  const { amount } = req.body as { amount: number };
  if (!amount || amount <= 0) { res.status(400).json({ error: "Valor inválido para saque" }); return; }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.params.id)).limit(1);
  if (!user) { res.status(404).json({ error: "Usuário não encontrado" }); return; }
  if ((user.totalEarned ?? 0) < amount) { res.status(400).json({ error: "Saldo insuficiente" }); return; }

  const [updated] = await db.update(usersTable)
    .set({ totalEarned: (user.totalEarned ?? 0) - amount })
    .where(eq(usersTable.id, req.params.id))
    .returning();
  if (!updated) { res.status(404).json({ error: "Usuário não encontrado" }); return; }
  const { passwordHash: _, ...safe } = updated;
  res.json(safe);
});

router.get("/users/:id/tasks", async (req, res) => {
  const tasks = await db
    .select()
    .from(tasksTable)
    .where(or(eq(tasksTable.creatorId, req.params.id), eq(tasksTable.executorId, req.params.id)))
    .orderBy(desc(tasksTable.createdAt));
  res.json(tasks);
});

router.get("/ranking", async (req, res) => {
  const users = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      avatarInitials: usersTable.avatarInitials,
      avatarBg: usersTable.avatarBg,
      avatarColor: usersTable.avatarColor,
      rankLevel: usersTable.rankLevel,
      rankPoints: usersTable.rankPoints,
      tasksCompleted: usersTable.tasksCompleted,
      totalEarned: usersTable.totalEarned,
    })
    .from(usersTable)
    .where(gt(usersTable.rankPoints, 0))
    .orderBy(desc(usersTable.rankPoints));
  res.json(users);
});

export default router;
