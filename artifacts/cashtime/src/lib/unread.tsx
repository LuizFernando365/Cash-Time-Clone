import { createContext, useContext, useState, type ReactNode } from "react";

interface UnreadCtx {
  unreadConvs: number;
  setUnreadConvs: (n: number) => void;
}

const Ctx = createContext<UnreadCtx>({ unreadConvs: 0, setUnreadConvs: () => {} });

export function UnreadProvider({ children }: { children: ReactNode }) {
  const [unreadConvs, setUnreadConvs] = useState(0);
  return <Ctx.Provider value={{ unreadConvs, setUnreadConvs }}>{children}</Ctx.Provider>;
}

export function useUnread() {
  return useContext(Ctx);
}
