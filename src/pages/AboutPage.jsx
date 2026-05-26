import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import MessageBubble from "../components/MessageBubble"

export default function AboutPage() {
  return (
    <div className="dot-bg" style={{ minHeight: "100vh", width: "100vw", maxWidth: "100%", fontFamily: "'Inter', sans-serif", color: "white", overflowX: "hidden" }}>
      <Navbar />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 300px)", flexDirection: "column", gap: "16px", padding: "80px 40px" }}>
        <div style={{ display: "inline-block", background: "#1a0000", color: "#d00000", border: "1px solid #3a0000", padding: "5px 14px", borderRadius: "99px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em" }}>
          ABOUT US
        </div>
        <h1 style={{ fontSize: "52px", fontWeight: 900, letterSpacing: "-2.5px", color: "white", textAlign: "center" }}>
          Built for people<br /><span style={{ color: "#d00000" }}>serious about it.</span>
        </h1>
        <p style={{ fontSize: "16px", color: "#555", maxWidth: "480px", textAlign: "center", lineHeight: "1.8" }}>
          Vaulte is a platform that connects driven individuals with AI mentors, structured roadmaps, and a community of people on the same journey.
        </p>
      </div>
      <Footer />
      <MessageBubble />
    </div>
  )
}
