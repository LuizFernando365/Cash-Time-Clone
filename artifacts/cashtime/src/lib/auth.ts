import type { User } from "./api";

const USER_KEY = "ct_user_id";
const USER_DATA_KEY = "ct_user_data";

export function saveSession(token: string, user: User) {
  localStorage.setItem(USER_KEY, token);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(USER_DATA_KEY);
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_DATA_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User) {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  return localStorage.getItem(USER_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
