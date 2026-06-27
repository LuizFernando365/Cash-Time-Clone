import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const tasksTable = pgTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  categoryEmoji: text("category_emoji").notNull().default("📋"),
  price: integer("price").notNull(),
  estimatedTime: text("estimated_time").notNull(),
  location: text("location").notNull(),
  isRemote: boolean("is_remote").notNull().default(false),
  lat: text("lat"),
  lng: text("lng"),
  tags: text("tags").array().notNull().default([]),
  categories: text("categories").array().notNull().default([]),
  priority: integer("priority").notNull().default(0),
  status: text("status").notNull().default("open"),
  highlight: boolean("highlight").notNull().default(false),
  creatorId: text("creator_id").notNull(),
  executorId: text("executor_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertTaskSchema = createInsertSchema(tasksTable).omit({ createdAt: true, updatedAt: true });
export const selectTaskSchema = createSelectSchema(tasksTable);
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasksTable.$inferSelect;
