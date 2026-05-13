import { useState } from "react";
import { useLocation } from "wouter";
import BottomNav from "@/components/BottomNav";

const mapTasks = [
  { id: 1, x: 52, y: 42, price: "R$65", color: "#9F67FF", label: "💻" },
  { id: 2, x: 30, y: 60, price: "R$30", color: "#34D399", label: "📦" },
  { id: 3, x: 70, y: 65, price: "R$50", color: "#FBBF24", label: "🎨" },
  { id: 4, x: 45, y: 75, price: "R$40", color: "#A78BFA", label: "🏠" },
];

export default function MapView() {
  const [, navigate] = useLocation();
  const [activeFilter, setActiveFilter] = useState(0);
  const filters = ["Todos", "💻 Tech", "📦 Entrega", "🏠 Casa"];

  return (
    <>
      <div className="screen" style={{ paddingBottom: 80 }}>
        <div style={{ padding: "16px var(--hpad) 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(17px,5vw,21px)", fontWeight: 700 }}>Mapa</div>
            <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", marginTop: 2 }}>Tarefas próximas a você</div>
          </div>
          <div style={{ width: 36, height: 36, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" stroke="#A78BFA" strokeWidth="1.8" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="filter-chips">
          {filters.map((f, i) => (
            <div key={i} className={`chip ${activeFilter === i ? "active" : ""}`} onClick={() => setActiveFilter(i)}>{f}</div>
          ))}
        </div>

        {/* Map */}
        <div style={{ margin: "0 var(--hpad) 12px", height: "clamp(220px,55vw,320px)", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.15) 0%, transparent 70%)" }} />
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.1 }}>
            {[0,1,2,3,4,5].map(i => (
              <line key={`h${i}`} x1="0" y1={`${i * 20}%`} x2="100%" y2={`${i * 20}%`} stroke="#9F67FF" strokeWidth="0.5" />
            ))}
            {[0,1,2,3,4,5,6].map(i => (
              <line key={`v${i}`} x1={`${i * 16.66}%`} y1="0" x2={`${i * 16.66}%`} y2="100%" stroke="#9F67FF" strokeWidth="0.5" />
            ))}
          </svg>
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}>
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#A78BFA" strokeWidth="2" />
            <line x1="40%" y1="0" x2="40%" y2="100%" stroke="#A78BFA" strokeWidth="2" />
            <line x1="0" y1="30%" x2="100%" y2="70%" stroke="#A78BFA" strokeWidth="1.5" />
          </svg>
          {mapTasks.map((t) => (
            <div
              key={t.id}
              style={{ position: "absolute", left: `${t.x}%`, top: `${t.y}%`, transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: 2 }}
              onClick={() => navigate(`/task/${t.id}`)}
            >
              <div style={{ background: t.color, borderRadius: 12, padding: "5px 9px", fontSize: "clamp(11px,3vw,13px)", fontWeight: 700, color: "white", fontFamily: "'Syne', sans-serif", boxShadow: `0 4px 16px ${t.color}55`, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4 }}>
                {t.label} {t.price}
              </div>
              <div style={{ width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: `8px solid ${t.color}`, margin: "0 auto" }} />
            </div>
          ))}
          <div style={{ position: "absolute", left: "52%", top: "42%", transform: "translate(-50%, -50%)", zIndex: 3 }}>
            <div style={{ width: 16, height: 16, background: "#9F67FF", borderRadius: "50%", border: "3px solid white", boxShadow: "0 0 0 4px rgba(159,103,255,.3)" }} />
          </div>
          <div style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(13,11,20,0.8)", borderRadius: 8, padding: "4px 10px", fontSize: "clamp(10px,2.8vw,12px)", color: "#A78BFA", backdropFilter: "blur(8px)" }}>
            Apucarana, PR
          </div>
        </div>

        <div style={{ padding: "4px var(--hpad) 8px" }}>
          <div className="section-sm">Tarefas próximas</div>
        </div>

        <div className="card" onClick={() => navigate("/task/1")} style={{ cursor: "pointer" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div className="card-title" style={{ fontSize: "clamp(12px,3.3vw,14px)" }}>Configurar roteador wi-fi</div>
              <div className="card-meta" style={{ marginTop: 4 }}>
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8" /></svg>
                1.2 km · Apucarana
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="card-price" style={{ fontSize: "clamp(14px,4vw,18px)" }}>R$65</div>
              <span className="card-price-sub">até 1h</span>
            </div>
          </div>
        </div>

        <div className="card" onClick={() => navigate("/task/2")} style={{ cursor: "pointer" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div className="card-title" style={{ fontSize: "clamp(12px,3.3vw,14px)" }}>Buscar encomenda nos Correios</div>
              <div className="card-meta" style={{ marginTop: 4 }}>
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8" /></svg>
                0.8 km · Centro
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="card-price" style={{ fontSize: "clamp(14px,4vw,18px)" }}>R$30</div>
              <span className="card-price-sub">~45 min</span>
            </div>
          </div>
        </div>
      </div>
      <BottomNav active="map" />
    </>
  );
}
