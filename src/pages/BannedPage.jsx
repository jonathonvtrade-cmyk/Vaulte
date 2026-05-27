import { Link } from "react-router-dom"

export default function BannedPage() {
  return (
    <div className="dot-bg" style={{ minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px" }}>
      <div style={{ fontSize: "56px", marginBottom: "24px" }}>🚫</div>
      <div style={{ display: "inline-block", background: "#1a0000", color: "#d00000", border: "1px solid #3a0000", padding: "5px 14px", borderRadius: "99px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "24px" }}>
        ACCOUNT SUSPENDED
      </div>
      <h1 style={{ fontSize: "36px", fontWeight: 900, letterSpacing: "-1.5px", color: "white", marginBottom: "16px", lineHeight: 1.1 }}>
        Your account has been<br /><span style={{ color: "#d00000" }}>suspended.</span>
      </h1>
      <p style={{ fontSize: "15px", color: "#555", maxWidth: "420px", lineHeight: "1.8", marginBottom: "36px" }}>
        Contact support if you think this is a mistake and we'll review your account.
      </p>
      <a
        href="mailto:support@vaulte.co"
        style={{ display: "inline-block", background: "#d00000", color: "white", textDecoration: "none", padding: "14px 32px", borderRadius: "8px", fontSize: "14px", fontWeight: 900, marginBottom: "16px" }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        Contact support →
      </a>
      <Link to="/" style={{ fontSize: "13px", color: "#444", textDecoration: "none" }}
        onMouseEnter={e => e.currentTarget.style.color = "#d00000"}
        onMouseLeave={e => e.currentTarget.style.color = "#444"}
      >← Back to home</Link>
    </div>
  )
}
