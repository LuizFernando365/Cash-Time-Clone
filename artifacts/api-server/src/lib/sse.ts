import type { Response } from "express";

type SSEClient = { res: Response; userId: string };

const rooms = new Map<string, Set<SSEClient>>();

export function subscribe(convId: string, userId: string, res: Response): () => void {
  if (!rooms.has(convId)) rooms.set(convId, new Set());
  const client: SSEClient = { res, userId };
  rooms.get(convId)!.add(client);
  return () => rooms.get(convId)?.delete(client);
}

export function broadcast(convId: string, event: string, data: unknown) {
  const clients = rooms.get(convId);
  if (!clients) return;
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const { res } of clients) {
    try { res.write(payload); } catch { /* client disconnected */ }
  }
}
