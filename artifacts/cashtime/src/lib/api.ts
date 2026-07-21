const BASE = "/api";

function headers(extra: Record<string, string> = {}) {
  const userId = localStorage.getItem("ct_user_id") ?? "";
  return {
    "Content-Type": "application/json",
    ...(userId ? { Authorization: `Bearer ${userId}`, "x-user-id": userId } : {}),
    ...extra,
  };
}

async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Erro desconhecido" }));
    throw new Error(err.error ?? "Erro na requisição");
  }
  return res.json();
}

export const api = {
  login: (email: string, password: string) =>
    req<{ token: string; user: User }>("POST", "/auth/login", { email, password }),

  register: (name: string, email: string, password: string) =>
    req<{ token: string; user: User }>("POST", "/auth/register", { name, email, password }),

  me: () => req<User>("GET", "/auth/me"),

  listTasks: (params?: { category?: string; status?: string }) => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set("category", params.category);
    if (params?.status) qs.set("status", params.status);
    const q = qs.toString();
    return req<TaskWithCreator[]>("GET", `/tasks${q ? `?${q}` : ""}`);
  },

  getTask: (id: string) => req<TaskWithCreator>("GET", `/tasks/${id}`),

  createTask: (data: CreateTaskRequest) => req<Task>("POST", "/tasks", data),

  updateTask: (id: string, data: { status?: string; executorId?: string; highlight?: boolean; priority?: number }) =>
    req<Task>("PATCH", `/tasks/${id}`, data),

  boostTask: (id: string, priority: 1 | 2) =>
    req<Task>("POST", `/tasks/${id}/boost`, { priority }),

  listConversations: () => req<ConversationWithUser[]>("GET", "/conversations"),

  createConversation: (otherUserId: string, taskId?: string) =>
    req<Conversation>("POST", "/conversations", { otherUserId, taskId }),

  listMessages: (convId: string) => req<Message[]>("GET", `/conversations/${convId}/messages`),

  sendMessage: (convId: string, senderId: string, content: string) =>
    req<Message>("POST", `/conversations/${convId}/messages`, { senderId, content }),

  editMessage: (convId: string, msgId: string, content: string) =>
    req<Message>("PATCH", `/conversations/${convId}/messages/${msgId}`, { content }),

  deleteMessage: (convId: string, msgId: string) =>
    req<Message>("DELETE", `/conversations/${convId}/messages/${msgId}`),

  reactMessage: (convId: string, msgId: string, userId: string, emoji: string) =>
    req<Message>("POST", `/conversations/${convId}/messages/${msgId}/react`, { userId, emoji }),

  markConvRead: (convId: string) =>
    req<{ ok: boolean }>("POST", `/conversations/${convId}/read`),

  deleteTask: (id: string) => req<{ ok: boolean }>("DELETE", `/tasks/${id}`),

  editTask: (id: string, data: { title?: string; description?: string; price?: number; location?: string; estimatedTime?: string }) =>
    req<Task>("PATCH", `/tasks/${id}`, data),

  acceptTask: (id: string, executorId: string) =>
    req<Task>("PATCH", `/tasks/${id}`, { executorId, status: "in_progress" }),

  completeTask: (id: string) =>
    req<Task>("PATCH", `/tasks/${id}`, { status: "done" }),

  upgradePlan: (userId: string) =>
    req<User>("POST", `/users/${userId}/plan`, { plan: "pro" }),

  cancelPlan: (userId: string) =>
    req<User>("POST", `/users/${userId}/plan`, { plan: "free" }),

  getRanking: () => req<RankingEntry[]>("GET", "/ranking"),

  getUser: (id: string) => req<User>("GET", `/users/${id}`),

  getUserTasks: (id: string) => req<Task[]>("GET", `/users/${id}/tasks`),

  updateUser: (id: string, data: Partial<Pick<User, "name" | "bio" | "city">>) =>
    req<User>("PUT", `/users/${id}`, data),
};

export interface User {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  avatarBg: string;
  avatarColor: string;
  bio?: string | null;
  city?: string | null;
  plan: string;
  rankLevel: number;
  rankPoints: number;
  tasksCompleted: number;
  totalEarned: number;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryEmoji: string;
  categories: string[];
  price: number;
  estimatedTime: string;
  location: string;
  isRemote: boolean;
  lat?: string | null;
  lng?: string | null;
  tags: string[];
  priority: number;
  status: string;
  highlight: boolean;
  creatorId: string;
  executorId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskWithCreator extends Task {
  creator: User;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  category: string;
  categoryEmoji?: string;
  categories?: string[];
  price: number;
  estimatedTime: string;
  location: string;
  isRemote: boolean;
  lat?: string;
  lng?: string;
  tags?: string[];
  creatorId: string;
}

export interface Conversation {
  id: string;
  taskId?: string | null;
  participantA: string;
  participantB: string;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  createdAt: string;
}

export interface ConversationWithUser extends Conversation {
  otherUser: User;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  read: boolean;
  editedAt?: string | null;
  deletedAt?: string | null;
  reactions?: string;
  createdAt: string;
}

export interface RankingEntry {
  id: string;
  name: string;
  avatarInitials: string;
  avatarBg: string;
  avatarColor: string;
  rankLevel: number;
  rankPoints: number;
  tasksCompleted: number;
  totalEarned: number;
}
