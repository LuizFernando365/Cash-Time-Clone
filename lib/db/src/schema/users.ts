import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  avatarInitials: text("avatar_initials").notNull(),
  avatarBg: text("avatar_bg").notNull().default("rgba(124,58,237,.2)"),
  avatarColor: text("avatar_color").notNull().default("#A78BFA"),
  bio: text("bio"),
  city: text("city"),
  plan: text("plan").notNull().default("free"),
  rankLevel: integer("rank_level").notNull().default(1),
  rankPoints: integer("rank_points").notNull().default(0),
  tasksCompleted: integer("tasks_completed").notNull().default(0),
  totalEarned: integer("total_earned").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ createdAt: true });
export const selectUserSchema = createSelectSchema(usersTable);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
