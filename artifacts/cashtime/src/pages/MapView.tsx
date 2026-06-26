import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import BottomNav from "@/components/BottomNav";
import { api, type TaskWithCreator } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";

/* ─── Coordinate → Pixel conversion ───────────────────────────────────
   We define a viewport window of ±0.012° lat and ±0.015° lng (~2.5 km²)
   around the user's center. Tasks outside the window are clipped.
──────────────────────────────────────────────────────────────────────── */
const LAT_SPAN = 0.024; // ~2.6 km
const LNG_SPAN = 0.030; // ~2.9 km at this latitude

function latLngToXY(
  lat: number, lng: number,
  centerLat: number, centerLng: number
): { x: number; y: number } {
  const x = ((lng - centerLng) / LNG_SPAN + 0.5) * 100;
  const y = ((centerLat - lat) / LAT_SPAN + 0.5) * 100;
  return { x, y };
}

/* ─── Map grid streets (SVG paths as % of viewBox 100×100) ─────────── */
function Streets() {
  return (
    <g opacity={0.12}>
      {/* Horizontal "avenues" */}
      {[20, 35, 50, 65, 80].map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y}
          stroke="#9F67FF" strokeWidth={y === 50 ? "1.2" : "0.6"} />
      ))}
      {/* Vertical "streets" */}
      {[15, 30, 45, 60, 75, 90].map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100"
          stroke="#9F67FF" strokeWidth={x === 45 ? "1.2" : "0.6"} />
      ))}
      {/* Diagonal arterials */}
      <line x1="0" y1="100" x2="100" y2="0" stroke="#A78BFA" strokeWidth="0.4" />
      <line x1="0" y1="60" x2="60" y2="0" stroke="#A78BFA" strokeWidth="0.3" />
      <line x1="40" y1="100" x2="100" y2="40" stroke="#A78BFA" strokeWidth="0.3" />
      {/* "Blocks" — filled rectangles */}
      {[
        [16,21,13,13],[30,21,13,12],[46,22,12,11],[61,21,12,12],[76,21,12,11],
        [16,36,13,12],[30,36,13,12],[46,36,12,12],[61,36,12,12],[76,36,12,12],
        [16,51,13,12],[30,51,13,12],[46,51,12,12],[61,51,12,12],[76,51,12,12],
        [16,66,13,12],[30,66,13,12],[46,66,12,12],[61,66,12,12],[76,66,12,12],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h}
          fill="rgba(28,23,53,0.9)" rx="1" />
      ))}
    </g>
  );
}

const CAT_COLOR: Record<string, string> = {
  Tech:     "#9F67FF",
  Entrega:  "#34D399",
  Casa:     "#FBBF24",
  Admin:    "#60A5FA",
  Criativo: "#F472B6",
};
const CAT_EMOJI: Record<string, string> = {
  Tech: "💻", Entrega: "📦", Casa: "🏠", Admin: "📝", Criativo: "🎨",
};
const FILTERS = ["Todos", "Tech", "Entrega", "Casa", "Admin", "Criativo"];
const DEFAULT: [number, number] = [-23.551, -51.461];

interface Pin {
  task: TaskWithCreator;
  x: number;
  y: number;
}

export default function MapView() {
  const [, navigate] = useLocation();
  const [activeFilter, setActiveFilter] = useState(0);
  const [tasks, setTasks] = useState<TaskWithCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState<[number, number]>(DEFAULT);
  const [selected, setSelected] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const user = getStoredUser();

  useEffect(() => {
    api.listTasks({ status: "open" })
      .then((d) => setTasks(d.filter((t) => t.creatorId !== user?.id)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => setCenter([p.coords.latitude, p.coords.longitude]),
      () => {},
      { timeout: 6000, maximumAge: 60_000 }
    );
  }, []);

  const filtered = tasks.filter((t) =>
    (activeFilter === 0 || t.category === FILTERS[activeFilter])
  );

  const pins: Pin[] = filtered
    .filter((t) => t.lat && t.lng)
    .map((t) => ({
      task: t,
      ...latLngToXY(parseFloat(t.lat!), parseFloat(t.lng!), center[0], center[1]),
    }))
    .filter((p) => p.x >= 2 && p.x <= 98 && p.y >= 2 && p.y <= 98);

  const withCoords = filtered.filter((t) => t.lat && t.lng);
  const noCoords   = filtered.filter((t) => !t.lat);
  const selectedTask = tasks.find((t) => t.id === selected);

  return (
    <>
      <div className="screen" style={{ paddingBottom: 80 }}>

        {/* Header */}
        <div style={{ padding: "16px var(--hpad) 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(17px,5vw,21px)", fontWeight: 700 }}>Mapa</div>
            <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", marginTop: 2 }}>
              {loading ? "Carregando..." : `${tasks.length} tarefa${tasks.length !== 1 ? "s" : ""} disponíve${tasks.length !== 1 ? "is" : "l"}`}
            </div>
          </div>
          <div style={{ width: 36, height: 36, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" stroke="#A78BFA" strokeWidth="1.8" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Filter chips */}
        <div className="filter-chips">
          {FILTERS.map((f, i) => (
            <div key={i} className={`chip ${activeFilter === i ? "active" : ""}`}
              onClick={() => { setActiveFilter(i); setSelected(null); }}>
              {i === 0 ? f : `${Object.values(CAT_EMOJI)[i - 1]} ${f}`}
            </div>
          ))}
        </div>

        {/* ─── 3D MAP ──────────────────────────────────── */}
        <div
          ref={containerRef}
          style={{
            margin: "0 var(--hpad) 12px",
            height: "clamp(240px,58vw,340px)",
            borderRadius: 18,
            overflow: "hidden",
            border: "1.5px solid rgba(138,99,255,0.35)",
            position: "relative",
            boxShadow: "0 8px 40px rgba(124,58,237,0.25)",
            background: "#0A0816",
          }}
        >
          {/* 3D perspective wrapper */}
          <div style={{
            width: "100%", height: "100%",
            perspective: "420px",
          }}>
            <div style={{
              width: "100%", height: "100%",
              transform: "rotateX(30deg) scale(1.15) translateY(-6%)",
              transformOrigin: "50% 60%",
              position: "relative",
            }}>
              {/* Radial glow */}
              <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(124,58,237,0.22) 0%, transparent 75%)",
                pointerEvents: "none",
              }} />

              {/* SVG grid + streets */}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              >
                <rect x="0" y="0" width="100" height="100" fill="#0A0816" />
                <Streets />
                {/* Glow lines over streets */}
                <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(159,103,255,0.35)" strokeWidth="0.8" />
                <line x1="45" y1="0" x2="45" y2="100" stroke="rgba(159,103,255,0.35)" strokeWidth="0.8" />
              </svg>

              {/* Task marker pins */}
              {pins.map(({ task: t, x, y }) => {
                const color = CAT_COLOR[t.category] ?? "#9F67FF";
                const emoji = CAT_EMOJI[t.category] ?? "📌";
                const isSelected = selected === t.id;
                return (
                  <div
                    key={t.id}
                    style={{
                      position: "absolute",
                      left: `${x}%`, top: `${y}%`,
                      transform: "translate(-50%, -100%)",
                      cursor: "pointer",
                      zIndex: isSelected ? 20 : 10,
                      transition: "transform .15s",
                    }}
                    onClick={() => setSelected(isSelected ? null : t.id)}
                  >
                    <div style={{
                      background: color,
                      border: `2px solid ${isSelected ? "white" : "rgba(255,255,255,0.25)"}`,
                      borderRadius: 10,
                      padding: "4px 8px",
                      fontSize: 11, fontWeight: 700, color: "white",
                      fontFamily: "'DM Sans',sans-serif",
                      whiteSpace: "nowrap",
                      boxShadow: `0 3px 18px ${color}99`,
                      transform: isSelected ? "scale(1.12)" : "scale(1)",
                      transition: "transform .15s",
                    }}>
                      {emoji} R${t.price}
                    </div>
                    {/* Pin tail */}
                    <div style={{
                      width: 0, height: 0,
                      borderLeft: "6px solid transparent",
                      borderRight: "6px solid transparent",
                      borderTop: `8px solid ${color}`,
                      margin: "0 auto",
                    }} />
                    {/* Drop shadow circle */}
                    <div style={{
                      width: 10, height: 4,
                      background: `${color}44`,
                      borderRadius: "50%",
                      margin: "0 auto",
                      filter: "blur(2px)",
                    }} />
                  </div>
                );
              })}

              {/* User position dot */}
              <div style={{
                position: "absolute",
                left: "50%", top: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 15,
              }}>
                <div style={{
                  width: 16, height: 16,
                  background: "#9F67FF",
                  borderRadius: "50%",
                  border: "3px solid white",
                  boxShadow: "0 0 0 5px rgba(159,103,255,0.4), 0 4px 16px rgba(159,103,255,0.7)",
                }} />
              </div>
            </div>
          </div>

          {/* Popup for selected task */}
          {selectedTask && (
            <div
              style={{
                position: "absolute", bottom: 48, left: "50%",
                transform: "translateX(-50%)",
                zIndex: 100,
                background: "rgba(28,23,53,0.97)",
                border: "1px solid rgba(138,99,255,0.4)",
                borderRadius: 14,
                padding: "10px 14px",
                minWidth: 200, maxWidth: 260,
                boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/task/${selectedTask.id}`)}
            >
              <div style={{ fontSize: 11, color: "#C4B5FD", fontWeight: 700, marginBottom: 4 }}>
                {selectedTask.categoryEmoji} {selectedTask.category}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35, marginBottom: 6, color: "#F5F3FF" }}>
                {selectedTask.title}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#7E7A9A" }}>{selectedTask.estimatedTime}</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#9F67FF" }}>R${selectedTask.price}</span>
              </div>
              <div style={{ marginTop: 6, fontSize: 11, color: "#9F67FF", textAlign: "center" }}>Toque para ver detalhes →</div>
            </div>
          )}

          {/* Empty overlay */}
          {!loading && pins.length === 0 && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 50,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              background: "rgba(10,8,22,0.75)", backdropFilter: "blur(4px)",
              pointerEvents: "none",
            }}>
              <div style={{ fontSize: 30, marginBottom: 6 }}>🗺️</div>
              <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#C4B5FD", fontWeight: 600, marginBottom: 4 }}>
                Nenhuma tarefa no mapa
              </div>
              <div style={{ fontSize: "clamp(11px,3vw,12px)", color: "#7E7A9A", textAlign: "center", padding: "0 28px" }}>
                Publique uma tarefa presencial para aparecer aqui
              </div>
            </div>
          )}

          {/* Location badge */}
          <div style={{
            position: "absolute", bottom: 12, left: 12, zIndex: 60,
            background: "rgba(13,11,20,0.88)", borderRadius: 8,
            padding: "4px 10px", fontSize: "clamp(10px,2.8vw,12px)",
            color: "#A78BFA", backdropFilter: "blur(8px)",
            border: "1px solid rgba(138,99,255,0.2)",
          }}>
            📍 {center === DEFAULT ? "Apucarana, PR" : "Sua localização"}
          </div>
        </div>

        {/* ─── Task lists below the map ─────────────────── */}
        {withCoords.length > 0 && (
          <>
            <div style={{ padding: "4px var(--hpad) 8px" }}><div className="section-sm">📍 Presenciais</div></div>
            {withCoords.map((task) => (
              <div key={task.id} className="card" onClick={() => navigate(`/task/${task.id}`)} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="card-title" style={{ fontSize: "clamp(12px,3.3vw,14px)" }}>{task.title}</div>
                    <div className="card-meta" style={{ marginTop: 4 }}>
                      <svg width="11" height="11" fill="none" viewBox="0 0 24 24">
                        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8" />
                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                      {task.location}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                    <div className="card-price" style={{ fontSize: "clamp(14px,4vw,18px)" }}>R${task.price}</div>
                    <span className="card-price-sub">{task.estimatedTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {noCoords.length > 0 && (
          <>
            <div style={{ padding: "4px var(--hpad) 8px" }}><div className="section-sm">🌐 Remotas</div></div>
            {noCoords.map((task) => (
              <div key={task.id} className="card" onClick={() => navigate(`/task/${task.id}`)} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="card-title" style={{ fontSize: "clamp(12px,3.3vw,14px)" }}>{task.title}</div>
                    <div className="card-meta" style={{ marginTop: 4 }}>🌐 {task.location}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                    <div className="card-price" style={{ fontSize: "clamp(14px,4vw,18px)" }}>R${task.price}</div>
                    <span className="card-price-sub">{task.estimatedTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {!loading && tasks.length === 0 && (
          <div style={{ textAlign: "center", padding: "28px var(--hpad)", color: "#7E7A9A" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
            <div style={{ fontSize: "clamp(12px,3.3vw,14px)", marginBottom: 4 }}>Nenhuma tarefa disponível</div>
            <div style={{ fontSize: "clamp(11px,3vw,12px)" }}>Publique a primeira pelo botão +</div>
          </div>
        )}
      </div>

      <BottomNav active="map" />
    </>
  );
}
