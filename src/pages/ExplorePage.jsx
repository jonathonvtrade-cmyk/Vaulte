import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import MessageBubble from "../components/MessageBubble"

/* ── Data ── */
const filters = [
  "All niches",
  "Beginner friendly",
  "High income",
  "Low startup cost",
  "Fast results",
]

const niches = [
  {
    name: "Trading",
    icon: "📈",
    gradient: "linear-gradient(135deg, #1a0000, #0d0d0d)",
    members: 2341,
    featured: true,
    desc: "Learn the markets, manage risk and build a strategy that actually works.",
    num: "01",
  },
  {
    name: "Dropshipping",
    icon: "📦",
    gradient: "linear-gradient(135deg, #001a0a, #0d0d0d)",
    members: 1892,
    featured: false,
    desc: "Find winning products, set margins right and build your first store.",
    num: "02",
  },
  {
    name: "Freelancing",
    icon: "💻",
    gradient: "linear-gradient(135deg, #0a001a, #0d0d0d)",
    members: 1654,
    featured: false,
    desc: "Land clients, price your work and scale without burning out.",
    num: "03",
  },
  {
    name: "Content Creation",
    icon: "🎬",
    gradient: "linear-gradient(135deg, #1a0a00, #0d0d0d)",
    members: 1203,
    featured: false,
    desc: "Grow an audience, monetize your content and build a real brand.",
    num: "04",
  },
  {
    name: "Affiliate Marketing",
    icon: "💰",
    gradient: "linear-gradient(135deg, #001a1a, #0d0d0d)",
    members: 987,
    featured: false,
    desc: "Promote products, earn commissions, and build passive income streams without holding any inventory.",
    num: "05",
  },
  {
    name: "AI Tools",
    icon: "🤖",
    gradient: "linear-gradient(135deg, #1a001a, #0d0d0d)",
    members: 743,
    featured: false,
    desc: "Use AI to automate, build products and stay ahead of everyone else.",
    num: "06",
  },
]

export default function ExplorePage() {
  const [activeFilter, setActiveFilter]   = useState("All niches")
  const [mounted,      setMounted]        = useState(false)
  const [hasAnimated,  setHasAnimated]    = useState(false)
  const [hoveredCard,  setHoveredCard]    = useState(null)

  useEffect(() => {
    // trigger enter animation shortly after mount
    const t1 = setTimeout(() => setMounted(true), 50)
    // after last card finishes animating (delay: 5×80ms + 400ms transition + buffer)
    const t2 = setTimeout(() => setHasAnimated(true), 50 + 5 * 80 + 400 + 100)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className="dot-bg" style={{
      minHeight: "100vh",
      width: "100vw",
      maxWidth: "100%",
      fontFamily: "'Inter', sans-serif",
      color: "white",
      overflowX: "hidden",
    }}>
      <Navbar />

      {/* ── Header ── */}
      <div style={{ padding: "72px 80px 0" }}>
        {/* Label */}
        <div style={{
          display: "inline-block",
          background: "#1a0000",
          color: "#d00000",
          border: "1px solid #3a0000",
          padding: "5px 14px",
          borderRadius: "99px",
          fontSize: "11px",
          fontWeight: "700",
          marginBottom: "24px",
          letterSpacing: "0.1em",
        }}>
          EXPLORE NICHES
        </div>

        {/* Heading with animated underline */}
        <div style={{ marginBottom: "16px" }}>
          <h1 style={{ fontSize: "52px", fontWeight: "900", letterSpacing: "-2.5px", lineHeight: "1.1", color: "white", display: "inline" }}>
            Find where you <span style={{ color: "#d00000" }}>belong.</span>
          </h1>
          <div style={{ marginTop: "10px", position: "relative", height: "3px", background: "#1a1a1a", borderRadius: "99px", maxWidth: "380px", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, height: "100%", background: "#d00000", borderRadius: "99px", animation: "underline-slide 0.9s ease 0.3s forwards", width: 0 }} />
          </div>
        </div>

        {/* Subtitle */}
        <p style={{
          fontSize: "15px",
          color: "#555",
          marginBottom: "40px",
          lineHeight: "1.7",
          maxWidth: "520px",
        }}>
          6 niches. 6 AI mentors. One platform built for people serious about it.
        </p>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "48px" }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: "7px 16px",
                borderRadius: "99px",
                border: `1px solid ${activeFilter === f ? "#d00000" : "#1f1f1f"}`,
                background: activeFilter === f ? "#1a0000" : "#111",
                color: activeFilter === f ? "#d00000" : "#555",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.2s ease",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Card grid ── */}
      <div style={{
        padding: "0 80px 80px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "16px",
      }}>
        {niches.map((niche, i) => {
          const isHovered = hoveredCard === i

          // During initial animation use staggered delay; after that hover is instant
          const transition = hasAnimated
            ? "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease"
            : `opacity 0.4s ease ${i * 80}ms, transform 0.4s ease ${i * 80}ms, border-color 0.2s ease, box-shadow 0.2s ease`

          const transform = mounted
            ? (isHovered ? "translateY(-4px)" : "translateY(0)")
            : "translateY(16px)"

          return (
            <div
              key={niche.name}
              style={{
                gridColumn: niche.featured ? "span 2" : "span 1",
                background: "#111",
                border: `1.5px solid ${isHovered ? "#d00000" : "#1f1f1f"}`,
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer",
                opacity: mounted ? 1 : 0,
                transform,
                transition,
                boxShadow: isHovered ? "0 8px 32px rgba(208,0,0,0.10)" : "none",
              }}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* ── Colored top section ── */}
              <div style={{
                height: niche.featured ? "200px" : "140px",
                background: niche.gradient,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {/* Faded number watermark */}
                <div style={{
                  position: "absolute",
                  top: "-6px",
                  right: "16px",
                  fontSize: "90px",
                  fontWeight: "900",
                  color: "white",
                  opacity: 0.06,
                  lineHeight: 1,
                  letterSpacing: "-4px",
                  pointerEvents: "none",
                  userSelect: "none",
                }}>
                  {niche.num}
                </div>

                {/* MOST POPULAR badge (featured only) */}
                {niche.featured && (
                  <div style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    background: "#d00000",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: "800",
                    padding: "4px 10px",
                    borderRadius: "99px",
                    letterSpacing: "0.08em",
                  }}>
                    MOST POPULAR
                  </div>
                )}

                {/* Emoji */}
                <div style={{ fontSize: niche.featured ? "64px" : "48px" }}>
                  {niche.icon}
                </div>
              </div>

              {/* ── Card body ── */}
              <div style={{ padding: "20px" }}>
                {/* AI MENTOR LIVE pill */}
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#1a0000",
                  border: "1px solid #3a0000",
                  color: "#d00000",
                  fontSize: "10px",
                  fontWeight: "700",
                  padding: "3px 10px",
                  borderRadius: "99px",
                  letterSpacing: "0.08em",
                  marginBottom: "12px",
                }}>
                  <span style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#d00000",
                    display: "inline-block",
                    flexShrink: 0,
                  }} />
                  AI MENTOR LIVE
                </div>

                {/* Niche name */}
                <div style={{
                  fontSize: "20px",
                  fontWeight: "800",
                  color: "white",
                  marginBottom: "8px",
                }}>
                  {niche.name}
                </div>

                {/* Description */}
                <div style={{
                  fontSize: "12px",
                  color: "#555",
                  lineHeight: "1.7",
                  marginBottom: "20px",
                }}>
                  {niche.desc}
                </div>

                {/* Footer row */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                  <div style={{ fontSize: "12px", color: "#333", fontWeight: "600" }}>
                    👥 {niche.members.toLocaleString()} members
                  </div>
                  <Link
                    to={`/niche/${encodeURIComponent(niche.name)}`}
                    style={{
                      display: "inline-block",
                      background: "#d00000",
                      color: "white",
                      textDecoration: "none",
                      padding: "8px 18px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "800",
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    Enter niche →
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <Footer />
      <MessageBubble />
    </div>
  )
}
