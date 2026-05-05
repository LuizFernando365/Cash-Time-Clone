import { useLocation, useParams } from "wouter";
import BottomNav from "@/components/BottomNav";

export default function TaskDetail() {
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();

  return (
    <>
      <div className="screen" style={{ paddingBottom: 80 }}>
        <div style={{ padding: "14px 22px 0", display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="#7E7A9A" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 13, color: "#7E7A9A" }}>Detalhe da tarefa</span>
        </div>

        <div style={{ padding: "16px 22px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <span className="pill">💻 Tech</span>
            <span className="pill pill-green">⭐ Destaque</span>
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, lineHeight: 1.3, marginBottom: 8 }}>
            Ajuda para configurar roteador wi-fi e resolver queda de sinal
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#9F67FF" }}>R$65</div>
            <div>
              <div style={{ fontSize: 12, color: "#7E7A9A" }}>⏱ Até 1 hora</div>
              <div style={{ fontSize: 12, color: "#7E7A9A" }}>🌐 Presencial</div>
            </div>
          </div>
        </div>

        <div className="divider" />

        <div style={{ padding: "12px 22px" }}>
          <div className="section-sm" style={{ marginBottom: 8 }}>Descrição</div>
          <div style={{ fontSize: 13, color: "#C4B5FD", lineHeight: 1.6 }}>
            Preciso de alguém que entenda de redes para configurar meu roteador TP-Link. O sinal cai toda hora e não consigo fazer a reconexão sozinho. Tenho o manual e todos os acessos.
          </div>
        </div>

        <div className="divider" />

        <div style={{ padding: "12px 22px 0" }}>
          <div className="section-sm" style={{ marginBottom: 10 }}>Localização</div>
        </div>

        <div className="map-placeholder">
          <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" stroke="#9F67FF" strokeWidth="1.8" />
              <circle cx="12" cy="10" r="3" fill="rgba(159,103,255,.3)" stroke="#9F67FF" strokeWidth="1.8" />
            </svg>
            <div style={{ fontSize: 12, color: "#7E7A9A", marginTop: 4 }}>Rua das Acácias, 450<br />1.2 km de você</div>
          </div>
        </div>

        <div className="divider" style={{ marginTop: 12 }} />

        <div style={{ padding: "12px 22px" }}>
          <div className="section-sm" style={{ marginBottom: 10 }}>Recrutador</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="avatar" style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(124,58,237,.2)", color: "#A78BFA", fontSize: 16 }}>MA</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Marcos Alves</div>
              <div style={{ fontSize: 12, color: "#7E7A9A" }}>12 tarefas publicadas</div>
            </div>
            <div className="rank-badge">🏆 Nível 4</div>
          </div>
        </div>

        <div style={{ padding: "8px 16px 0", display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="btn btn-primary" onClick={() => navigate("/chat/marcos")}>
            💬 Entrar em contato
          </button>
        </div>
      </div>
      <BottomNav active="home" />
    </>
  );
}
