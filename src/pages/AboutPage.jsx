import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const NeonDivider = () => (
  <div style={{ width: "100%", height: "1px", background: "#d00000", boxShadow: "0 0 10px rgba(208,0,0,0.7), 0 0 20px rgba(208,0,0,0.3)" }} />
)

const stats = [
  { value: "12+", label: "Niche Roadmaps" },
  { value: "500+", label: "Community Members" },
  { value: "10k+", label: "AI Mentor Messages" },
  { value: "Free", label: "To Get Started" },
]

export default function AboutPage() {
  return (
    <div className="dot-bg" style={{ minHeight: "100vh", width: "100vw", maxWidth: "100%", fontFamily: "'Inter', sans-serif", color: "white", overflowX: "hidden" }}>
      <Navbar />
      <NeonDivider />

      {/* Hero */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "80px 40px 64px" }}>
        <div style={{ display: "inline-block", background: "#1a0000", color: "#d00000", border: "1px solid #3a0000", padding: "5px 14px", borderRadius: "99px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "24px" }}>
          OUR STORY
        </div>
        <h1 style={{ fontSize: "52px", fontWeight: 900, letterSpacing: "-2.5px", lineHeight: 1.1, marginBottom: "20px" }}>
          Built for people who are<br /><span style={{ color: "#d00000" }}>serious about it.</span>
        </h1>
        <p style={{ fontSize: "16px", color: "#555", lineHeight: "1.8", maxWidth: "580px", margin: 0 }}>
          Vaulte was built because the information gap shouldn't stop talented people from reaching their potential. We combined structured roadmaps, real AI mentorship, and a community of driven people — all in one place.
        </p>
      </div>

      <NeonDivider />

      {/* Founder */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "64px 40px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: "#444", letterSpacing: "0.12em", marginBottom: "32px" }}>FOUNDER</p>

        <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Avatar with spinning ring */}
          <div style={{ position: "relative", width: "96px", height: "96px", flexShrink: 0 }}>
            <div className="founder-ring" />
            <div style={{
              position: "absolute", inset: "6px", borderRadius: "50%",
              background: "linear-gradient(135deg, #1a0000 0%, #2a0000 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "32px", fontWeight: 900, color: "#d00000",
              border: "1px solid #3a0000",
            }}>
              JV
            </div>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: "200px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "-0.5px" }}>Jonathon V.</span>
              <span style={{ fontSize: "11px", background: "#0a1a2a", color: "#3399ff", border: "1px solid #1a3a5a", padding: "2px 10px", borderRadius: "99px", fontWeight: 700, letterSpacing: "0.08em" }}>✓ VERIFIED</span>
              <span style={{ fontSize: "11px", background: "#1a0000", color: "#d00000", border: "1px solid #3a0000", padding: "2px 10px", borderRadius: "99px", fontWeight: 700, letterSpacing: "0.08em" }}>FOUNDER</span>
            </div>
            <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.8", margin: 0, maxWidth: "480px" }}>
              Built Vaulte to give every motivated person access to the same quality of guidance that used to cost thousands — or require the right connections. The platform exists to remove the noise and give people a real path forward.
            </p>
          </div>
        </div>

        {/* Growing card */}
        <div style={{
          marginTop: "32px",
          border: "1px dashed #222",
          borderRadius: "16px",
          padding: "28px 32px",
          display: "flex", alignItems: "center", gap: "16px",
          background: "rgba(255,255,255,0.01)",
        }}>
          <div style={{ fontSize: "28px" }}>🌱</div>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 800, color: "#555", margin: "0 0 4px", letterSpacing: "0.05em" }}>WE&apos;RE GROWING</p>
            <p style={{ fontSize: "14px", color: "#333", margin: 0, lineHeight: "1.6" }}>
              Vaulte is an early-stage platform. More roadmaps, niches, and features are added regularly. If you want to help build it — reach out.
            </p>
          </div>
        </div>
      </div>

      <NeonDivider />

      {/* Stats */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "64px 40px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: "#444", letterSpacing: "0.12em", marginBottom: "32px" }}>BY THE NUMBERS</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "24px" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "16px", padding: "28px 24px" }}>
              <p style={{ fontSize: "36px", fontWeight: 900, letterSpacing: "-1.5px", color: "#d00000", margin: "0 0 6px" }}>{s.value}</p>
              <p style={{ fontSize: "12px", color: "#444", fontWeight: 700, letterSpacing: "0.08em", margin: 0, textTransform: "uppercase" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <NeonDivider />

      {/* Mission */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "64px 40px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: "#444", letterSpacing: "0.12em", marginBottom: "24px" }}>MISSION</p>
        <h2 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1.5px", marginBottom: "20px", lineHeight: 1.15 }}>
          No fluff. No gatekeeping.<br />Just the path.
        </h2>
        <p style={{ fontSize: "15px", color: "#555", lineHeight: "1.9", margin: "0 0 16px", maxWidth: "620px" }}>
          Too many people waste years watching the same generic content and never building anything real. Vaulte gives you a structured roadmap for your exact niche, an AI mentor that knows where you are in the journey, and a community of people doing the same thing.
        </p>
        <p style={{ fontSize: "15px", color: "#555", lineHeight: "1.9", margin: 0, maxWidth: "620px" }}>
          We believe focused, structured action beats motivation every time. That&apos;s what Vaulte is built around.
        </p>
      </div>

      <NeonDivider />
      <Footer />
    </div>
  )
}
