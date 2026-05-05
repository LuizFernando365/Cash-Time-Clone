import { useState } from "react";
import { useLocation } from "wouter";
import BottomNav from "@/components/BottomNav";

const tasks = [
  {
    id: 1,
    highlight: true,
    category: "💻 Tech",
    categoryClass: "pill-green",
    title: "Ajuda para configurar roteador wi-fi e resolver queda de sinal",
    location: "1.2 km · Apucarana",
    tags: ["Redes", "Wi-Fi", "Roteador"],
    price: "R$65",
    time: "até 1h",
    author: "MA",
    authorName: "Marcos Alves",
    authorBg: "rgba(124,58,237,.2)",
    authorColor: "#A78BFA",
    rank: "🏆 Nível 4",
    rankStyle: {},
    ago: null,
  },
  {
    id: 2,
    highlight: false,
    category: "📦 Entrega",
    categoryClass: "pill-gray",
    title: "Buscar encomenda nos Correios e entregar em endereço próximo",
    location: "0.8 km · Centro",
    tags: [],
    price: "R$30",
    time: "~45 min",
    author: "CS",
    authorName: "Carla Souza",
    authorBg: "rgba(52,211,153,.12)",
    authorColor: "#34D399",
    rank: "🥈 Nível 2",
    rankStyle: { background: "rgba(167,139,250,.1)", borderColor: "rgba(167,139,250,.2)", color: "#C4B5FD" },
    ago: "há 12 min",
  },
  {
    id: 3,
    highlight: false,
    category: "🎨 Criativo",
    categoryClass: "",
    categoryCustomStyle: { background: "rgba(251,191,36,.1)", color: "#FCD34D", borderColor: "rgba(251,191,36,.25)" },
    title: "Editar 3 fotos de produto para loja do Instagram",
    location: "🌐 Remoto · sem localização",
    tags: [],
    price: "R$50",
    time: "~1h30",
    author: "RF",
    authorName: "Rafael F.",
    authorBg: "rgba(251,191,36,.12)",
    authorColor: "#FCD34D",
    rank: "🥇 Nível 5",
    rankStyle: {},
    ago: "há 1h",
  },
];

const filters = ["Todos", "💻 Tech", "📦 Entrega", "🏠 Casa", "📝 Admin"];

export default function Home() {
  const [, navigate] = useLocation();
  const [activeFilter, setActiveFilter] = useState(0);

  return (
    <>
      <div className="screen" style={{ paddingBottom: 80 }}>
        <div className="app-logo" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="logo-icon">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="logo-text">Cash<span style={{ color: "#9F67FF" }}>Time</span></span>
          </div>
          <div style={{ position: "relative" }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#7E7A9A" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <div className="notification-dot" />
          </div>
        </div>

        <div style={{ padding: "12px 22px 4px" }}>
          <div style={{ fontSize: 12, color: "#7E7A9A" }}>Olá, <strong style={{ color: "#C4B5FD" }}>Luiz</strong> 👋</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700, marginTop: 2 }}>Tarefas para você</div>
        </div>

        <div className="search-bar">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" stroke="#7E7A9A" strokeWidth="1.8" />
            <path d="M21 21l-4.35-4.35" stroke="#7E7A9A" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Buscar tarefas...
        </div>

        <div className="filter-chips">
          {filters.map((f, i) => (
            <div key={i} className={`chip ${activeFilter === i ? "active" : ""}`} onClick={() => setActiveFilter(i)}>
              {f}
            </div>
          ))}
        </div>

        {tasks.map((task) => (
          <div
            key={task.id}
            className={`card ${task.highlight ? "card-highlight" : ""}`}
            onClick={() => navigate(`/task/${task.id}`)}
            style={{ cursor: "pointer" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              {task.highlight ? (
                <>
                  <span className="pill" style={{ fontSize: 10 }}>⭐ Destaque</span>
                  <span className={`pill ${task.categoryClass}`}>{task.category}</span>
                </>
              ) : (
                <>
                  <span className={`pill ${task.categoryClass}`} style={task.categoryCustomStyle}>{task.category}</span>
                  {task.ago && <span style={{ fontSize: 11, color: "#7E7A9A" }}>{task.ago}</span>}
                </>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div className="card-title">{task.title}</div>
                <div className="card-meta">
                  {!task.location.startsWith("🌐") && (
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8" />
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  )}
                  {task.location}
                </div>
                {task.tags.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    {task.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                  </div>
                )}
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                <div className="card-price">{task.price}</div>
                <span className="card-price-sub">{task.time}</span>
              </div>
            </div>

            <div className="divider" style={{ margin: task.highlight ? "12px 0" : "10px 0" }} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="avatar" style={{ background: task.authorBg, color: task.authorColor }}>{task.author}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{task.authorName}</div>
                  <div className="rank-badge" style={task.rankStyle}>{task.rank}</div>
                </div>
              </div>
              <button
                className={task.highlight ? "btn btn-primary" : "btn btn-secondary"}
                style={{ width: "auto", padding: "9px 18px", fontSize: 12 }}
                onClick={(e) => { e.stopPropagation(); navigate(`/task/${task.id}`); }}
              >
                Tenho interesse
              </button>
            </div>
          </div>
        ))}
      </div>
      <BottomNav active="home" />
    </>
  );
}
