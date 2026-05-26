import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import MessageBubble from "../components/MessageBubble"
import { supabase } from "../supabaseClient"

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
  const navigate                          = useNavigate()
  const [activeFilter, setActiveFilter]   = useState("All niches")
  const [mounted,      setMounted]        = useState(false)
  const [hasAnimated,  setHasAnimated]    = useState(false)
  const [hoveredCard,  setHoveredCard]    = useState(null)
  const [user,         setUser]           = useState(null)
  const [showAuthModal,setShowAuthModal]  = useState(false)
  const [pendingNiche, setPendingNiche]   = useState(null)

  useEffect(() => {
    const t1 = setTimeout(() => setMounted(true), 50)
    const t2 = setTimeout(() => setHasAnimated(true), 50 + 5 * 80 + 400 + 100)
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
    return () => { clearTimeout(t1); clearTimeout(t2); subscription.unsubscribe() }
  }, [])

  const handleEnterNiche = (niche) => {
    if (user) {
      navigate(`/niche/${encodeURIComponent(niche.name)}`)
    } else {
      setPendingNiche(niche)
      setShowAuthModal(true)
    }
  }

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

      {/* ── Auth Gate Modal ── */}
      {showAuthModal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={e => { if (e.target === e.currentTarget) setShowAuthModal(false) }}
        >
          <div style={{
            background: "#111", border: "1px solid #1f1f1f", borderTop: "3px solid #d00000",
            borderRadius: "20px", padding: "40px 36px", width: "100%", maxWidth: "380px",
            textAlign: "center", animation: "modal-in 0.25s ease",
          }}>
            {pendingNiche && (
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>{pendingNiche.icon}</div>
            )}
            <h2 style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: "10px" }}>
              Create a free account
            </h2>
            <p style={{ fontSize: "13px", color: "#555", lineHeight: "1.7", marginBottom: "28px" }}>
              to access {pendingNiche?.name || "this niche"} and get your AI mentor, roadmap, and community access.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link
                to="/signup"
                style={{
                  display: "block", background: "#d00000", color: "white", textDecoration: "none",
                  padding: "14px", borderRadius: "10px", fontSize: "14px", fontWeight: 900,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Sign up free →
              </Link>
              <Link
                to="/login"
                style={{
                  display: "block", background: "transparent", color: "#aaa", textDecoration: "none",
                  padding: "14px", borderRadius: "10px", fontSize: "14px", fontWeight: 700,
                  border: "1px solid #1f1f1f", transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#555"; e.currentTarget.style.color = "white" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1f1f1f"; e.currentTarget.style.color = "#aaa" }}
              >
                Log in
              </Link>
            </div>
            <button
              onClick={() => setShowAuthModal(false)}
              style={{ marginTop: "16px", background: "transparent", border: "none", color: "#333", fontSize: "12px", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ padding: "72px 80px 0" }}>
        <div style={{
          display: "inline-block", background: "#1a0000", color: "#d00000",
          border: "1px solid #3a0000", padding: "5px 14px", borderRadius: "99px",
          fontSize: "11px", fontWeight: "700", marginBottom: "24px", letterSpacing: "0.1em",
        }}>
          EXPLORE NICHES
        </div>
        <div style={{ marginBottom: "16px" }}>
          <h1 style={{ fontSize: "52px", fontWeight: "900", letterSpacing: "-2.5px", lineHeight: "1.1", color: "white", display: "inline" }}>
            Find where you <span style={{ color: "#d00000" }}>belong.</span>
          </h1>
          <div style={{ marginTop: "10px", position: "relative", height: "3px", background: "#1a1a1a", borderRadius: "99px", maxWidth: "380px", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, height: "100%", background: "#d00000", borderRadius: "99px", animation: "underline-slide 0.9s ease 0.3s forwards", width: 0 }} />
          </div>
        </div>
        <p style={{ fontSize: "15px", color: "#555", marginBottom: "40px", lineHeight: "1.7", maxWidth: "520px" }}>
          6 niches. 6 AI mentors. One platform built for people serious about it.
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "48px" }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: "7px 16px", borderRadius: "99px",
                border: `1px solid ${activeFilter === f ? "#d00000" : "#1f1f1f"}`,
                background: activeFilter === f ? "#1a0000" : "#111",
                color: activeFilter === f ? "#d00000" : "#555",
                fontSize: "12px", fontWeight: "700", cursor: "pointer",
                fontFamily: "'Inter', sans-serif", transition: "all 0.2s ease",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Card grid ── */}
      <div style={{ padding: "0 80px 80px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
        {niches.map((niche, i) => {
          const isHovered = hoveredCard === i
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
                borderRadius: "16px", overflow: "hidden",
                cursor: "pointer",
                opacity: mounted ? 1 : 0,
                transform, transition,
                boxShadow: isHovered ? "0 8px 32px rgba(208,0,0,0.10)" : "none",
              }}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Coloured top section */}
              <div style={{
                height: niche.featured ? "200px" : "140px",
                background: niche.gradient,
                position: "relative",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{
                  position: "absolute", top: "-6px", right: "16px",
                  fontSize: "90px", fontWeight: "900", color: "white",
                  opacity: 0.06, lineHeight: 1, letterSpacing: "-4px",
                  pointerEvents: "none", userSelect: "none",
                }}>
                  {niche.num}
                </div>
                {niche.featured && (
                  <div style={{
                    position: "absolute", top: "16px", left: "16px",
                    background: "#d00000", color: "white", fontSize: "10px",
                    fontWeight: "800", padding: "4px 10px", borderRadius: "99px", letterSpacing: "0.08em",
                  }}>
                    MOST POPULAR
                  </div>
                )}
                <div style={{ fontSize: niche.featured ? "64px" : "48px" }}>{niche.icon}</div>
              </div>

              {/* Card body */}
              <div style={{ padding: "20px" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  background: "#1a0000", border: "1px solid #3a0000", color: "#d00000",
                  fontSize: "10px", fontWeight: "700", padding: "3px 10px",
                  borderRadius: "99px", letterSpacing: "0.08em", marginBottom: "12px",
                }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#d00000", display: "inline-block", flexShrink: 0 }} />
                  AI MENTOR LIVE
                </div>
                <div style={{ fontSize: "20px", fontWeight: "800", color: "white", marginBottom: "8px" }}>{niche.name}</div>
                <div style={{ fontSize: "12px", color: "#555", lineHeight: "1.7", marginBottom: "20px" }}>{niche.desc}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: "12px", color: "#333", fontWeight: "600" }}>
                    👥 {niche.members.toLocaleString()} members
                  </div>
                  <button
                    onClick={() => handleEnterNiche(niche)}
                    style={{
                      display: "inline-block", background: "#d00000", color: "white",
                      border: "none", padding: "8px 18px", borderRadius: "8px",
                      fontSize: "12px", fontWeight: "800", cursor: "pointer",
                      fontFamily: "'Inter', sans-serif", transition: "opacity 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    Enter niche →
                  </button>
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
