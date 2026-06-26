import { useState } from "react";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import { saveSession } from "@/lib/auth";

export default function Register() {
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password) {
      setError("Preencha todos os campos.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 3) {
      setError("Senha deve ter pelo menos 3 caracteres.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { token, user } = await api.register(name, email, password);
      saveSession(token, user);
      navigate("/onboarding");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh", background: "var(--bg)" }}>
      {/* Header */}
      <div style={{ padding: "16px var(--hpad) 8px", display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <path d="M19 12H5M12 5l-7 7 7 7" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A" }}>Passo 1 de 3</span>
      </div>

      <div className="progress-bar" style={{ margin: "0 var(--hpad) 24px" }}>
        <div className="progress-fill" style={{ width: "33%" }} />
      </div>

      {/* Title */}
      <div style={{ padding: "0 var(--hpad) 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 40, height: 40,
            background: "linear-gradient(135deg,rgba(124,58,237,.3),rgba(159,103,255,.15))",
            border: "1.5px solid rgba(138,99,255,.4)",
            borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(16px,4.5vw,19px)", fontWeight: 800 }}>
            Cash<span style={{ color: "#9F67FF" }}>Time</span>
          </span>
        </div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(17px,5vw,22px)", fontWeight: 700, lineHeight: 1.3, marginBottom: 6 }}>
          Crie sua conta
        </div>
        <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#7E7A9A", lineHeight: 1.5 }}>
          Rápido e gratuito. Comece a ganhar dinheiro hoje.
        </div>
      </div>

      {/* Form */}
      <div style={{ flex: 1, padding: "0 var(--hpad)" }}>
        <div style={{ marginBottom: 14 }}>
          <div className="input-label">Nome completo</div>
          <input
            className="input-field"
            placeholder="Ex: João Silva"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            style={{ borderColor: name ? "var(--purple)" : undefined, background: name ? "rgba(124,58,237,0.07)" : undefined }}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <div className="input-label">E-mail</div>
          <input
            className="input-field"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
            style={{ borderColor: email ? "var(--purple)" : undefined, background: email ? "rgba(124,58,237,0.07)" : undefined }}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <div className="input-label">Senha</div>
          <input
            className="input-field"
            type="password"
            placeholder="Mínimo 3 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div className="input-label">Confirmar senha</div>
          <input
            className="input-field"
            type="password"
            placeholder="Repita a senha"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          />
        </div>

        {error && (
          <div style={{ marginBottom: 14, padding: "10px 14px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, fontSize: "clamp(12px,3.3vw,14px)", color: "#FCA5A5" }}>
            {error}
          </div>
        )}

        <button className="btn btn-primary" onClick={handleRegister} disabled={loading}>
          {loading ? "Criando conta..." : "Criar conta →"}
        </button>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: "clamp(12px,3.3vw,14px)", color: "#7E7A9A" }}>
          Já tem conta?{" "}
          <span style={{ color: "#9F67FF", cursor: "pointer", fontWeight: 600 }} onClick={() => navigate("/login")}>
            Entrar
          </span>
        </div>
      </div>

      <div style={{ height: 32 }} />
    </div>
  );
}
