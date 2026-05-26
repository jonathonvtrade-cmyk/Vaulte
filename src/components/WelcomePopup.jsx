import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const slides = [
  {
    icon: "⚡",
    title: "Welcome to Vaulte.",
    subtitle: "The platform built for people serious about income.",
    body: "We cut the noise. No generic YouTube advice. No wasted time. A niche AI mentor, a clear roadmap, and a community that's already doing it — all in one place.",
  },
  {
    icon: "🎯",
    title: "Pick your niche.",
    subtitle: "Six income paths. Each with a dedicated AI mentor.",
    body: "Choose the path that fits you. Every niche gets its own mentor, its own roadmap, and its own community.",
    niches: ["📈 Trading", "📦 Dropshipping", "💻 Freelancing", "🎬 Content Creation", "💰 Affiliate Marketing", "🤖 AI Tools"],
  },
  {
    icon: "🧠",
    title: "Your AI mentor.",
    subtitle: "Not a chatbot. A niche specialist.",
    body: "Your mentor is trained exclusively on your path. Ask anything — strategy, execution, roadblocks. It knows your niche and keeps you on track. Available 24/7, never judgemental.",
  },
  {
    icon: "🚀",
    title: "Let's go.",
    subtitle: "Your path to income starts now.",
    body: "Pick your niche. Follow your roadmap. Talk to your mentor. Connect with your community. Everything you need — in one place.",
    cta: true,
  },
]

export default function WelcomePopup({ onClose }) {
  const [slide,   setSlide]   = useState(0)
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { setTimeout(() => setVisible(true), 40) }, [])

  const dismiss = () => {
    localStorage.setItem("vaulte_welcome_seen", "1")
    onClose()
  }

  const next = () => {
    if (slide < slides.length - 1) setSlide(s => s + 1)
    else dismiss()
  }

  const goExplore = () => {
    dismiss()
    navigate("/explore")
  }

  const cur = slides[slide]

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.88)",
      backdropFilter: "blur(6px)",
      zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.3s ease",
    }}>
      <div style={{
        background: "#111",
        borderRadius: "20px",
        maxWidth: "500px",
        width: "100%",
        borderTop: "3px solid #d00000",
        animation: "pulse-glow 2.8s ease-in-out infinite",
        overflow: "hidden",
      }}>

        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", padding: "24px 32px 0" }}>
          {slides.map((_, i) => (
            <div key={i} style={{
              height: "6px",
              width: i === slide ? "28px" : "6px",
              borderRadius: "99px",
              background: i <= slide ? "#d00000" : "#222",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>

        {/* Slide */}
        <div key={slide} style={{ padding: "32px 36px 24px", animation: "slide-fade-in 0.28s ease" }}>
          <div style={{ fontSize: "52px", textAlign: "center", marginBottom: "18px" }}>{cur.icon}</div>
          <h2 style={{ fontSize: "26px", fontWeight: 900, letterSpacing: "-1.2px", color: "white", textAlign: "center", marginBottom: "8px" }}>
            {cur.title}
          </h2>
          <p style={{ fontSize: "13px", color: "#d00000", fontWeight: 700, textAlign: "center", marginBottom: "14px", letterSpacing: "0.02em" }}>
            {cur.subtitle}
          </p>
          <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.85", textAlign: "center" }}>
            {cur.body}
          </p>

          {cur.niches && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginTop: "20px" }}>
              {cur.niches.map(n => (
                <span key={n} style={{
                  background: "#0d0d0d", border: "1px solid #1f1f1f", color: "#666",
                  padding: "5px 14px", borderRadius: "99px", fontSize: "12px", fontWeight: 700,
                }}>{n}</span>
              ))}
            </div>
          )}

          {cur.cta && (
            <button
              onClick={goExplore}
              style={{
                marginTop: "24px",
                width: "100%",
                background: "#d00000",
                color: "white",
                border: "none",
                padding: "16px",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: 900,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Explore niches →
            </button>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: "flex",
          justifyContent: cur.cta ? "center" : "space-between",
          alignItems: "center",
          padding: "0 36px 28px",
        }}>
          <button onClick={dismiss} style={{
            background: "transparent", border: "none",
            color: "#333", fontSize: "13px", cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
          }}>Skip</button>

          {!cur.cta && (
            <button onClick={next} style={{
              background: "#d00000", color: "white", border: "none",
              padding: "10px 28px", borderRadius: "8px",
              fontSize: "14px", fontWeight: 800, cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              {slide === slides.length - 2 ? "Let's go →" : "Next →"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
