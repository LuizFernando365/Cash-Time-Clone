import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api } from "./api";
import { getToken } from "./auth";

interface UnreadCtx {
  unreadConvs: number;
  setUnreadConvs: (n: number) => void;
  refresh: () => void;
}

const Ctx = createContext<UnreadCtx>({ unreadConvs: 0, setUnreadConvs: () => {}, refresh: () => {} });

export function UnreadProvider({ children }: { children: ReactNode }) {
  const [unreadConvs, setUnreadConvs] = useState(0);

  async function refresh() {
    if (!getToken()) return;
    try {
      const convs = await api.listConversations();
      const count = convs.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0);
      setUnreadConvs(count);
    } catch { /* silent */ }
  }

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 5000);
    return () => clearInterval(timer);
  }, []);

  return <Ctx.Provider value={{ unreadConvs, setUnreadConvs, refresh }}>{children}</Ctx.Provider>;
}

export function useUnread() {
  return useContext(Ctx);
}
