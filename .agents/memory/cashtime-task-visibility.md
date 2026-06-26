---
name: CashTime task visibility rule
description: When tasks and ranking appear in the CashTime app — critical rule confirmed by user.
---

## Rule

**Tasks and ranking only appear when real users publish them.** Never insert seed/test tasks or fake ranking data.

**Why:** The app is a real-time marketplace connecting real users. The user explicitly confirmed: tasks must only appear when any user from anywhere in the world publishes one. Fake/seed data pollutes the experience for real new users.

## How to apply

- Home feed (`/home`): shows only `status=open` tasks created by OTHER users (not the current user). If no tasks exist → empty state "Nenhuma tarefa encontrada".
- Map (`/map`): shows only `status=open` tasks from other users that have lat/lng. Empty map if none.
- Ranking (`/ranking`): API filters `WHERE tasksCompleted > 0` — only users with real completed tasks appear. Empty state if none.
- **Never run `pnpm --filter @workspace/scripts run seed` or any task-inserting script** unless the user explicitly requests demo/test data and understands it is fake.
- If test data is inserted during debugging, always clean up with `pnpm --filter @workspace/scripts run clear-tasks` before handing back to the user.
