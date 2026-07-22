import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const taskApplicationsTable = pgTable("task_applications", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull(),
  applicantId: text("applicant_id").notNull(),
  message: text("message"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type TaskApplication = typeof taskApplicationsTable.$inferSelect;
