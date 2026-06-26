import { db, tasksTable } from "@workspace/db";

async function main() {
  const deleted = await db.delete(tasksTable).returning({ id: tasksTable.id });
  console.log(`Deleted ${deleted.length} tasks from the database.`);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
