import { Router } from "express";
import { db, usersTable, tasksTable } from "@workspace/db";
import { eq, or, desc, gt } from "drizzle-orm";

const router = Router();

function levelFromTasks(n: number): number {
  if (n >= 100) return 5;
  if (n >= 50) return 4;
  if (n >= 25) return 3;
  if (n >= 10) return 2;
  return 1;
}

router.get("/users/:id", async (req, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.params.id)).limit(1);
  if (!user) {
    res.status(404).json({ error: "Usuário não encontrado" });
    return;
  }
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

  const [updated] = await db
    .update(usersTable)
    .set(updates)
    .where(eq(usersTable.id, req.params.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Usuário não encontrado" });
    return;
  }

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
  // Only include users who have real activity (completed at least 1 task)
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
    .where(gt(usersTable.tasksCompleted, 0))
    .orderBy(desc(usersTable.rankPoints));
  res.json(users);
});

export default router;
