import { useLocation } from "wouter";

type Tab = "home" | "map" | "add" | "chat" | "profile";

interface BottomNavProps {
  active: Tab;
}

export default function BottomNav({ active }: BottomNavProps) {
  const [, navigate] = useLocation();

  return (
    <div className="bottom-nav">
      <div className={`nav-item ${active === "home" ? "active" : ""}`} onClick={() => navigate("/home")}>
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke={active === "home" ? "#9F67FF" : "#7E7A9A"} strokeWidth="1.8" strokeLinecap="round" />
          <polyline points="9,22 9,12 15,12 15,22" stroke={active === "home" ? "#9F67FF" : "#7E7A9A"} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="nav-label">Início</span>
      </div>

      <div className={`nav-item ${active === "map" ? "active" : ""}`} onClick={() => navigate("/map")}>
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" stroke={active === "map" ? "#9F67FF" : "#7E7A9A"} strokeWidth="1.8" />
          <circle cx="12" cy="10" r="3" stroke={active === "map" ? "#9F67FF" : "#7E7A9A"} strokeWidth="1.8" />
        </svg>
        <span className="nav-label">Mapa</span>
      </div>

      <div className="nav-item" style={{ opacity: 1 }} onClick={() => navigate("/post")}>
        <div className="nav-add">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className={`nav-item ${active === "chat" ? "active" : ""}`} onClick={() => navigate("/messages")}>
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={active === "chat" ? "#9F67FF" : "#7E7A9A"} strokeWidth="1.8" />
        </svg>
        <span className="nav-label">Chat</span>
      </div>

      <div className={`nav-item ${active === "profile" ? "active" : ""}`} onClick={() => navigate("/profile")}>
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke={active === "profile" ? "#9F67FF" : "#7E7A9A"} strokeWidth="1.8" />
          <circle cx="12" cy="7" r="4" stroke={active === "profile" ? "#9F67FF" : "#7E7A9A"} strokeWidth="1.8" />
        </svg>
        <span className="nav-label">Perfil</span>
      </div>
    </div>
  );
}
