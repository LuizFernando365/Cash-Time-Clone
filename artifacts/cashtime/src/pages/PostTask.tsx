import { useState } from "react";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";

const CATEGORIES = [
  { emoji: "💻", label: "Tech" },
  { emoji: "📦", label: "Entrega" },
  { emoji: "🏠", label: "Casa" },
  { emoji: "📝", label: "Admin" },
  { emoji: "🎨", label: "Criativo" },
];

const TIME_OPTIONS = ["~30 min", "~45 min", "até 1h", "~1h30", "~2h"];

export default function PostTask() {
  const [, navigate] = useLocation();
  const user = getStoredUser();
  const [serviceType, setServiceType] = useState<"presencial" | "remoto">("presencial");
  const [categoryIdx, setCategoryIdx] = useState(0);
  const [timeIdx, setTimeIdx] = useState(2);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [value, setValue] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const cat = CATEGORIES[categoryIdx];

  async function handleSubmit() {
    if (!title.trim() || !desc.trim() || !value) {
      setError("Preencha título, descrição e valor.");
      return;
    }
    if (!user) {
      setError("Faça login primeiro.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await api.createTask({
        title: title.trim(),
        description: desc.trim(),
        category: cat.label,
        categoryEmoji: cat.emoji,
        price: Math.round(parseFloat(value.replace(",", ".")) * 100) / 100,
        estimatedTime: TIME_OPTIONS[timeIdx],
        location: serviceType === "remoto" ? "🌐 Remoto · sem localização" : (location.trim() || "Local não informado"),
        isRemote: serviceType === "remoto",
        tags: [],
        creatorId: user.id,
      });
      navigate("/home");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao publicar");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="screen" style={{ paddingBottom: 90 }}>
      <div style={{ padding: "16px var(--hpad) 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
          <path d="M19 12H5M12 5l-7 7 7 7" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(14px,4vw,17px)", fontWeight: 700 }}>Nova Tarefa</div>
        <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", cursor: "pointer" }} onClick={() => navigate("/home")}>Cancelar</div>
      </div>

      <div style={{ margin: "0 var(--hpad) 12px" }}>
        <div className="input-label">Título da tarefa</div>
        <input
          className="input-field"
          placeholder="Ex: Configurar impressora HP..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ borderColor: title ? "var(--purple)" : undefined, background: title ? "rgba(124,58,237,0.07)" : undefined }}
        />
      </div>

      <div style={{ margin: "0 var(--hpad) 12px" }}>
        <div className="input-label">Descrição completa</div>
        <textarea
          className="input-field textarea"
          placeholder="Descreva tudo que precisa ser feito, requisitos, materiais disponíveis..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "0 var(--hpad) 12px" }}>
        <div>
          <div className="input-label">Valor (R$)</div>
          <input className="input-field" placeholder="65,00" value={value} onChange={(e) => setValue(e.target.value)} inputMode="decimal" />
        </div>
        <div>
          <div className="input-label">Tempo estimado</div>
          <select
            className="input-field"
            value={timeIdx}
            onChange={(e) => setTimeIdx(Number(e.target.value))}
            style={{ color: "#A78BFA", fontSize: "clamp(12px,3.3vw,14px)" }}
          >
            {TIME_OPTIONS.map((t, i) => <option key={i} value={i}>{t}</option>)}
          </select>
        </div>
      </div>

      <div style={{ margin: "0 var(--hpad) 12px" }}>
        <div className="input-label">Categoria</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map((c, i) => (
            <div
              key={i}
              className={`chip ${categoryIdx === i ? "active" : ""}`}
              onClick={() => setCategoryIdx(i)}
            >
              {c.emoji} {c.label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ margin: "0 var(--hpad) 12px" }}>
        <div className="input-label">Tipo de serviço</div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["presencial", "remoto"] as const).map((t) => (
            <div
              key={t}
              className={`quiz-option ${serviceType === t ? "selected" : ""}`}
              style={{ flex: 1, margin: 0, padding: "11px 12px" }}
              onClick={() => setServiceType(t)}
            >
              <div className="quiz-option-check">
                {serviceType === t && <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></svg>}
              </div>
              <div style={{ fontSize: "clamp(12px,3.3vw,14px)" }}>{t === "presencial" ? "📍 Presencial" : "🌐 Remoto"}</div>
            </div>
          ))}
        </div>
      </div>

      {serviceType === "presencial" && (
        <div style={{ margin: "0 var(--hpad) 12px" }}>
          <div className="input-label">Localização</div>
          <input
            className="input-field"
            placeholder="Ex: 1.2 km · Centro de Apucarana"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      )}

      {error && (
        <div style={{ margin: "0 var(--hpad) 8px", padding: "10px 14px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, fontSize: "clamp(12px,3.3vw,14px)", color: "#FCA5A5" }}>
          {error}
        </div>
      )}

      <div style={{ padding: "14px var(--hpad) 0" }}>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Publicando..." : "Publicar tarefa →"}
        </button>
      </div>
    </div>
  );
}
