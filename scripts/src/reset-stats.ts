import { db, usersTable } from "@workspace/db";

async function main() {
  const updated = await db
    .update(usersTable)
    .set({ tasksCompleted: 0, rankPoints: 0, rankLevel: 1, totalEarned: 0 })
    .returning({ id: usersTable.id, name: usersTable.name });
  console.log(`Reset stats for ${updated.length} users:`);
  updated.forEach((u) => console.log(` - ${u.name}`));
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
