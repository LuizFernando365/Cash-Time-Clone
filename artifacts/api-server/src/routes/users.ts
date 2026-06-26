import { Router } from "express";
import { db, usersTable, tasksTable } from "@workspace/db";
import { eq, or, desc } from "drizzle-orm";

const router = Router();

router.get("/users/:id", async (req, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.params.id)).limit(1);
  if (!user) {
    res.status(404).json({ error: "Usuário não encontrado" });
    return;
  }
  const { passwordHash: _, ...safe } = user;
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
    .orderBy(desc(usersTable.rankPoints));
  res.json(users);
});

export default router;
