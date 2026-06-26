import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

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
