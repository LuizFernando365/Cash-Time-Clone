import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { api } from "@/lib/api";
import { getStoredUser, setStoredUser } from "@/lib/auth";

export default function Checkout() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const plan = params.get("plan") ?? "pro";
  const user = getStoredUser();

  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");

  const price = plan === "pro" ? "R$19,90/mês" : "R$9,90";
  const planLabel = plan === "pro" ? "Plano Pro ✨" : "Publicação Destaque";

  function formatCard(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  }
  function formatExpiry(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  }

  async function handlePay() {
    if (!cardNumber || !cardName || !expiry || !cvv) {
      setError("Preencha todos os campos do cartão.");
      return;
    }
    if (cardNumber.replace(/\s/g, "").length < 16) {
      setError("Número do cartão inválido.");
      return;
    }
    setError("");
    setStep("processing");

    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2200));

    // Activate plan for pro subscriptions
    if (plan === "pro" && user) {
      try {
        const updated = await api.upgradePlan(user.id);
        setStoredUser({ ...user, ...updated });
      } catch { /* ignore */ }
    }

    setStep("success");
  }

  if (step === "processing") {
    return (
      <div className="screen" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100dvh", gap: 20 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", border: "3px solid #7C3AED", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(16px,4.5vw,20px)", fontWeight: 700, color: "#C4B5FD" }}>Processando pagamento...</div>
        <div style={{ fontSize: "clamp(12px,3.3vw,14px)", color: "#7E7A9A" }}>Aguarde um momento</div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="screen" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100dvh", padding: "0 var(--hpad)", gap: 16, textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(52,211,153,.15)", border: "2px solid #34D399", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeInUp 0.5s ease", fontSize: 36 }}>
          ✅
        </div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(20px,6vw,26px)", fontWeight: 800, color: "#34D399", animation: "fadeInUp 0.6s ease" }}>
          Pagamento aprovado!
        </div>
        <div style={{ fontSize: "clamp(13px,3.5vw,15px)", color: "#C4B5FD", lineHeight: 1.5, maxWidth: 280, animation: "fadeInUp 0.7s ease" }}>
          {plan === "pro"
            ? "Seu Plano Pro foi ativado! Agora você pode publicar tarefas ilimitadas com destaque."
            : "Seu pagamento foi confirmado. Sua tarefa será publicada com destaque."}
        </div>
        <div style={{ background: "var(--card)", border: "1px solid rgba(52,211,153,.3)", borderRadius: 14, padding: "14px 24px", animation: "fadeInUp 0.8s ease", marginTop: 8 }}>
          <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", marginBottom: 4 }}>Valor cobrado</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(22px,7vw,28px)", fontWeight: 800, color: "#34D399" }}>{price}</div>
          <div style={{ fontSize: "clamp(11px,3vw,12px)", color: "#7E7A9A", marginTop: 2 }}>{planLabel}</div>
        </div>
        <button
          className="btn btn-primary"
          style={{ marginTop: 8, maxWidth: 320, width: "100%", animation: "fadeInUp 0.9s ease" }}
          onClick={() => {
            if (plan === "pro") navigate("/profile");
            else navigate("/post?boost=1");
          }}
        >
          {plan === "pro" ? "Ir para o perfil →" : "Publicar tarefa →"}
        </button>
      </div>
    );
  }

  return (
    <div className="screen" style={{ paddingBottom: 40 }}>
      <div style={{ padding: "16px var(--hpad) 12px", display: "flex", alignItems: "center", gap: 12 }}>
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" onClick={() => navigate("/plans")} style={{ cursor: "pointer" }}>
          <path d="M19 12H5M12 5l-7 7 7 7" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(15px,4.5vw,18px)", fontWeight: 700 }}>Checkout seguro</div>
      </div>

      {/* Order summary */}
      <div style={{ margin: "0 var(--hpad) 20px", background: "linear-gradient(135deg,rgba(124,58,237,.15),rgba(159,103,255,.08))", border: "1px solid rgba(138,99,255,.35)", borderRadius: 16, padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "clamp(11px,3vw,12px)", color: "#A78BFA", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: ".06em" }}>Resumo do pedido</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(14px,4vw,17px)", fontWeight: 700 }}>{planLabel}</div>
            <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#7E7A9A", marginTop: 2 }}>
              {plan === "pro" ? "Assinatura mensal · cancele a qualquer momento" : "Publicação única com destaque no feed"}
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(20px,6vw,26px)", fontWeight: 800, color: "#A78BFA" }}>
              {plan === "pro" ? "R$19,90" : "R$9,90"}
            </div>
            <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: "#7E7A9A" }}>{plan === "pro" ? "/mês" : "único"}</div>
          </div>
        </div>
      </div>

      {/* Card form */}
      <div style={{ padding: "0 var(--hpad)", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <rect x="1" y="4" width="22" height="16" rx="2" stroke="#A78BFA" strokeWidth="1.8" />
            <path d="M1 10h22" stroke="#A78BFA" strokeWidth="1.8" />
          </svg>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 700 }}>Dados do cartão</div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {["VISA", "MASTER"].map((b) => (
              <div key={b} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 5, padding: "2px 7px", fontSize: 9, fontWeight: 700, color: "#7E7A9A" }}>{b}</div>
            ))}
          </div>
        </div>

        <div>
          <div className="input-label">Número do cartão</div>
          <input
            className="input-field"
            placeholder="0000 0000 0000 0000"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCard(e.target.value))}
            inputMode="numeric"
            maxLength={19}
          />
        </div>

        <div>
          <div className="input-label">Nome no cartão</div>
          <input
            className="input-field"
            placeholder="NOME COMPLETO"
            value={cardName}
            onChange={(e) => setCardName(e.target.value.toUpperCase())}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div className="input-label">Validade</div>
            <input
              className="input-field"
              placeholder="MM/AA"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              inputMode="numeric"
              maxLength={5}
            />
          </div>
          <div>
            <div className="input-label">CVV</div>
            <input
              className="input-field"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
              inputMode="numeric"
            />
          </div>
        </div>

        {error && (
          <div style={{ padding: "10px 14px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, fontSize: "clamp(12px,3.3vw,14px)", color: "#FCA5A5" }}>
            {error}
          </div>
        )}

        <button className="btn btn-primary" onClick={handlePay} style={{ marginTop: 4 }}>
          🔒 Pagar {price}
        </button>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: "clamp(11px,3vw,12px)", color: "#7E7A9A" }}>
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="#7E7A9A" strokeWidth="1.8" />
            <path d="M7 11V7a5 5 0 0110 0v4" stroke="#7E7A9A" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Pagamento 100% seguro via simulação
        </div>
      </div>
    </div>
  );
}
