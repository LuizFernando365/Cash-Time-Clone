import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

router.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
    return;
  }
  const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing) {
    res.status(409).json({ error: "Email já cadastrado" });
    return;
  }
  const initials = name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0].toUpperCase())
    .join("");
  const colors = [
    { bg: "rgba(124,58,237,.2)", color: "#A78BFA" },
    { bg: "rgba(52,211,153,.12)", color: "#34D399" },
    { bg: "rgba(251,191,36,.12)", color: "#FCD34D" },
    { bg: "rgba(239,68,68,.12)", color: "#FCA5A5" },
  ];
  const pick = colors[Math.floor(Math.random() * colors.length)];
  const id = randomUUID();
  const [user] = await db
    .insert(usersTable)
    .values({
      id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: password,
      avatarInitials: initials || name[0].toUpperCase(),
      avatarBg: pick.bg,
      avatarColor: pick.color,
      plan: "free",
      rankLevel: 1,
      rankPoints: 0,
      tasksCompleted: 0,
      totalEarned: 0,
    })
    .returning();
  const { passwordHash: _, ...safeUser } = user;
  res.status(201).json({ token: user.id, user: safeUser });
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email e senha são obrigatórios" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!user || user.passwordHash !== password) {
    res.status(401).json({ error: "Credenciais inválidas" });
    return;
  }
  const { passwordHash: _, ...safeUser } = user;
  res.json({ token: user.id, user: safeUser });
});

router.get("/auth/me", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "") ?? "";
  if (!token) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, token)).limit(1);
  if (!user) {
    res.status(401).json({ error: "Usuário não encontrado" });
    return;
  }
  const { passwordHash: _, ...safeUser } = user;
  res.json(safeUser);
});

export default router;
