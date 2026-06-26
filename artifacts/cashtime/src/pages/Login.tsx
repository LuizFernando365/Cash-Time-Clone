import { useState } from "react";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import { saveSession } from "@/lib/auth";

export default function Login() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError("Preencha e-mail e senha.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { token, user } = await api.login(email.trim(), password);
      saveSession(token, user);
      navigate("/home");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Credenciais inválidas");
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
        <span style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A" }}>Entrar</span>
      </div>

      {/* Title */}
      <div style={{ padding: "12px var(--hpad) 32px" }}>
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
          Bem-vindo de volta!
        </div>
        <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#7E7A9A" }}>
          Entre na sua conta para continuar.
        </div>
      </div>

      {/* Form */}
      <div style={{ flex: 1, padding: "0 var(--hpad)" }}>
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

        <div style={{ marginBottom: 24 }}>
          <div className="input-label">Senha</div>
          <input
            className="input-field"
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        {error && (
          <div style={{ marginBottom: 14, padding: "10px 14px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, fontSize: "clamp(12px,3.3vw,14px)", color: "#FCA5A5" }}>
            {error}
          </div>
        )}

        <button className="btn btn-primary" onClick={handleLogin} disabled={loading}>
          {loading ? "Entrando..." : "Entrar →"}
        </button>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: "clamp(12px,3.3vw,14px)", color: "#7E7A9A" }}>
          Não tem conta?{" "}
          <span style={{ color: "#9F67FF", cursor: "pointer", fontWeight: 600 }} onClick={() => navigate("/register")}>
            Criar conta grátis
          </span>
        </div>

        <div style={{ marginTop: 24, padding: "12px 14px", background: "rgba(124,58,237,.06)", border: "1px solid rgba(124,58,237,.15)", borderRadius: 10 }}>
          <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#7E7A9A", marginBottom: 4 }}>Conta de demonstração:</div>
          <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#C4B5FD" }}>E-mail: <strong>adm</strong> · Senha: <strong>123</strong></div>
        </div>
      </div>

      <div style={{ height: 32 }} />
    </div>
  );
}
