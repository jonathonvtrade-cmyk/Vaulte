import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const NeonDivider = () => (
  <div style={{ width: "100%", height: "1px", background: "#d00000", boxShadow: "0 0 10px rgba(208,0,0,0.7), 0 0 20px rgba(208,0,0,0.3)" }} />
)

export default function BlogPage() {
  return (
    <div className="dot-bg" style={{ minHeight: "100vh", width: "100vw", maxWidth: "100%", fontFamily: "'Inter', sans-serif", color: "white", overflowX: "hidden" }}>
      <Navbar />
      <NeonDivider />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center", padding: "80px 40px" }}>
        <div style={{ fontSize: "64px", marginBottom: "24px" }}>✍️</div>
        <div style={{ display: "inline-block", background: "#1a0000", color: "#d00000", border: "1px solid #3a0000", padding: "5px 14px", borderRadius: "99px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "24px" }}>
          COMING SOON
        </div>
        <h1 style={{ fontSize: "48px", fontWeight: 900, letterSpacing: "-2.5px", color: "white", marginBottom: "16px", lineHeight: 1.1 }}>
          We&apos;re working on<br /><span style={{ color: "#d00000" }}>something great.</span>
        </h1>
        <p style={{ fontSize: "16px", color: "#555", maxWidth: "440px", lineHeight: "1.8", marginBottom: "36px" }}>
          Guides, stories, and insights from people who&apos;ve built real income in their niche. Coming soon.
        </p>
        <Link
          to="/"
          style={{ display: "inline-block", background: "#d00000", color: "white", textDecoration: "none", padding: "14px 32px", borderRadius: "8px", fontSize: "14px", fontWeight: 900, transition: "opacity 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >← Back to home</Link>
      </div>

      <NeonDivider />
      <Footer />
    </div>
  )
}
