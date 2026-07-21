import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
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
  const search = useSearch();
  const boostParam = new URLSearchParams(search).get("boost");
  const shouldBoost = boostParam === "1";

  const user = getStoredUser();
  const [serviceType, setServiceType] = useState<"presencial" | "remoto">("presencial");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([0]);
  const [timeIdx, setTimeIdx] = useState(2);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [value, setValue] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [coords, setCoords] = useState<{ lat: string; lng: string } | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "ok" | "denied">("idle");

  useEffect(() => {
    if (serviceType === "presencial" && geoStatus === "idle") captureLocation();
  }, [serviceType]);

  function toggleCategory(idx: number) {
    setSelectedCategories((prev) => {
      if (prev.includes(idx)) {
        if (prev.length === 1) return prev;
        return prev.filter((i) => i !== idx);
      }
      return [...prev, idx];
    });
  }

  function captureLocation() {
    if (!navigator.geolocation) { setGeoStatus("denied"); return; }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => { setCoords({ lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6) }); setGeoStatus("ok"); },
      () => setGeoStatus("denied"),
      { timeout: 8000 }
    );
  }

  async function handleSubmit() {
    if (!title.trim()) { setError("Preencha o título da tarefa."); return; }
    if (!desc.trim()) { setError("Preencha a descrição da tarefa."); return; }
    if (!value) { setError("Informe o valor da tarefa."); return; }
    const parsedPrice = parseFloat(value.replace(",", "."));
    if (isNaN(parsedPrice) || parsedPrice <= 0) { setError("Informe um valor válido (ex: 65,00)."); return; }
    if (!user) { setError("Faça login primeiro."); return; }

    setSubmitting(true);
    setError("");
    try {
      const cats = selectedCategories.map((i) => CATEGORIES[i].label);
      const primaryCat = CATEGORIES[selectedCategories[0]];
      const created = await api.createTask({
        title: title.trim(),
        description: desc.trim(),
        category: primaryCat.label,
        categoryEmoji: primaryCat.emoji,
        categories: cats,
        price: Math.round(parsedPrice * 100) / 100,
        estimatedTime: TIME_OPTIONS[timeIdx],
        location: serviceType === "remoto" ? "🌐 Remoto · sem localização" : (location.trim() || "Local a combinar"),
        isRemote: serviceType === "remoto",
        lat: serviceType === "presencial" && coords ? coords.lat : undefined,
        lng: serviceType === "presencial" && coords ? coords.lng : undefined,
        tags: [],
        creatorId: user.id,
      });

      // Auto-boost if coming from Plans R$9,90 or Pro plan
      if (shouldBoost || user.plan === "pro") {
        try {
          await api.boostTask(created.id, user.plan === "pro" ? 2 : 1);
        } catch { /* ignore boost error */ }
      }

      navigate("/home");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao publicar. Tente novamente.");
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

      {shouldBoost && (
        <div style={{ margin: "0 var(--hpad) 12px", padding: "10px 14px", background: "rgba(124,58,237,.12)", border: "1px solid rgba(124,58,237,.35)", borderRadius: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" /></svg>
          <div style={{ fontSize: "clamp(12px,3.3vw,13px)", color: "#C4B5FD" }}>Tarefa com destaque ✨ — será impulsionada após publicação</div>
        </div>
      )}

      <div style={{ margin: "0 var(--hpad) 12px" }}>
        <div className="input-label">Título da tarefa</div>
        <input className="input-field" placeholder="Ex: Configurar impressora HP..." value={title} onChange={(e) => setTitle(e.target.value)} style={{ borderColor: title ? "var(--purple)" : undefined, background: title ? "rgba(124,58,237,0.07)" : undefined }} />
      </div>

      <div style={{ margin: "0 var(--hpad) 12px" }}>
        <div className="input-label">Descrição completa</div>
        <textarea className="input-field textarea" placeholder="Descreva tudo que precisa ser feito, requisitos, materiais disponíveis..." value={desc} onChange={(e) => setDesc(e.target.value)} style={{ minHeight: 90 }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "0 var(--hpad) 12px" }}>
        <div>
          <div className="input-label">Valor (R$)</div>
          <input className="input-field" placeholder="65,00" value={value} onChange={(e) => setValue(e.target.value)} inputMode="decimal" />
        </div>
        <div>
          <div className="input-label">Tempo estimado</div>
          <select className="input-field" value={timeIdx} onChange={(e) => setTimeIdx(Number(e.target.value))} style={{ color: "#A78BFA", fontSize: "clamp(12px,3.3vw,14px)" }}>
            {TIME_OPTIONS.map((t, i) => <option key={i} value={i}>{t}</option>)}
          </select>
        </div>
      </div>

      <div style={{ margin: "0 var(--hpad) 12px" }}>
        <div className="input-label">
          Categorias
          <span style={{ fontWeight: 400, color: "#7E7A9A", marginLeft: 6 }}>
            — selecione uma ou mais ({selectedCategories.length} selecionada{selectedCategories.length !== 1 ? "s" : ""})
          </span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map((c, i) => {
            const active = selectedCategories.includes(i);
            return (
              <div key={i} onClick={() => toggleCategory(i)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 20, cursor: "pointer", fontSize: "clamp(12px,3.3vw,14px)", fontWeight: active ? 600 : 400, background: active ? "rgba(124,58,237,.18)" : "var(--card)", border: `1.5px solid ${active ? "#7C3AED" : "var(--border)"}`, color: active ? "#C4B5FD" : "#7E7A9A", transition: "all .15s", userSelect: "none" }}>
                {active && <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="#9F67FF" strokeWidth="2.5" strokeLinecap="round" /></svg>}
                {c.emoji} {c.label}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ margin: "0 var(--hpad) 12px" }}>
        <div className="input-label">Tipo de serviço</div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["presencial", "remoto"] as const).map((t) => (
            <div key={t} className={`quiz-option ${serviceType === t ? "selected" : ""}`} style={{ flex: 1, margin: 0, padding: "11px 12px" }} onClick={() => setServiceType(t)}>
              <div className="quiz-option-check">{serviceType === t && <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></svg>}</div>
              <div style={{ fontSize: "clamp(12px,3.3vw,14px)" }}>{t === "presencial" ? "📍 Presencial" : "🌐 Remoto"}</div>
            </div>
          ))}
        </div>
      </div>

      {serviceType === "presencial" && (
        <div style={{ margin: "0 var(--hpad) 12px" }}>
          <div className="input-label">Localização da tarefa</div>
          <input className="input-field" placeholder="Ex: Centro de Apucarana, próximo à praça..." value={location} onChange={(e) => setLocation(e.target.value)} />
          <div style={{ marginTop: 8, fontSize: "clamp(11px,3vw,12px)", color: "#7E7A9A" }}>
            {geoStatus === "loading" && "📡 Capturando coordenadas GPS..."}
            {geoStatus === "ok" && <span style={{ color: "#34D399" }}>✓ GPS capturado — tarefa aparecerá no mapa</span>}
            {geoStatus === "denied" && (
              <span>⚠️ GPS não disponível — <span style={{ color: "#9F67FF", cursor: "pointer", textDecoration: "underline" }} onClick={captureLocation}>tentar novamente</span></span>
            )}
          </div>
        </div>
      )}

      {error && (
        <div style={{ margin: "0 var(--hpad) 8px", padding: "10px 14px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, fontSize: "clamp(12px,3.3vw,14px)", color: "#FCA5A5" }}>
          {error}
        </div>
      )}

      <div style={{ padding: "14px var(--hpad) 0" }}>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Publicando..." : shouldBoost ? "Publicar com destaque →" : "Publicar tarefa →"}
        </button>
      </div>
    </div>
  );
}
