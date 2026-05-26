import { Link } from "react-router-dom"

export default function PaywallModal({ onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.88)",
      backdropFilter: "blur(6px)",
      zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        background: "#111",
        border: "1px solid #1f1f1f",
        borderTop: "3px solid #d00000",
        borderRadius: "20px",
        padding: "48px 40px",
        maxWidth: "400px",
        width: "100%",
        textAlign: "center",
        animation: "modal-in 0.28s ease",
      }}>
        <div style={{ fontSize: "52px", marginBottom: "16px" }}>🔒</div>
        <h2 style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "-1px", color: "white", marginBottom: "10px" }}>
          Daily limit reached.
        </h2>
        <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.8", marginBottom: "12px" }}>
          You&apos;ve used your <span style={{ color: "#d00000", fontWeight: 700 }}>5 free AI messages</span> for today.
        </p>
        <p style={{ fontSize: "13px", color: "#444", lineHeight: "1.7", marginBottom: "32px" }}>
          Upgrade to Pro for unlimited access to your AI mentor — plus the full roadmap, all 6 niches, and community posting.
        </p>

        <Link
          to="/pricing"
          onClick={onClose}
          style={{
            display: "block",
            background: "#d00000",
            color: "white",
            textDecoration: "none",
            padding: "16px",
            borderRadius: "10px",
            fontSize: "15px",
            fontWeight: 900,
            marginBottom: "12px",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          Upgrade to Pro →
        </Link>

        <button
          onClick={onClose}
          style={{
            background: "transparent", border: "none",
            color: "#333", fontSize: "13px",
            cursor: "pointer", fontFamily: "'Inter', sans-serif",
          }}
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}
