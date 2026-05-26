import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import MessageBubble from "../components/MessageBubble"

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    cta: "Get started free",
    ctaLink: "/signup",
    featured: false,
    features: [
      { text: "5 AI mentor messages per day",   check: true  },
      { text: "2 niche mentors",                check: true  },
      { text: "First 3 roadmap steps",           check: true  },
      { text: "Read community feed",             check: true  },
      { text: "Post in community",               check: false },
      { text: "Full roadmap — all steps",        check: false },
      { text: "All 6 niche mentors",             check: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9.99",
    period: "per month",
    cta: "Start for $9.99/month",
    ctaLink: "/signup",
    featured: true,
    badge: "MOST POPULAR",
    features: [
      { text: "Unlimited AI mentor messages",    check: true },
      { text: "All 6 niche mentors",             check: true },
      { text: "Full roadmap — all 10 steps",     check: true },
      { text: "Post in community",               check: true },
      { text: "Progress tracking & stats",       check: true },
      { text: "Priority support",                check: true },
    ],
  },
  {
    id: "team",
    name: "Team",
    price: "$24.99",
    period: "per month",
    cta: "Get Team plan",
    ctaLink: "/signup",
    featured: false,
    features: [
      { text: "Everything in Pro",               check: true },
      { text: "Up to 5 team members",            check: true },
      { text: "Shared roadmap progress",         check: true },
      { text: "Early access to new niches",      check: true },
    ],
  },
]

const TRUST = [
  { icon: "🔒", text: "No credit card needed" },
  { icon: "✕",  text: "Cancel anytime"         },
  { icon: "⚡", text: "Instant access"          },
]

export default function PricingPage() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 40); return () => clearTimeout(t) }, [])

  return (
    <div className="page-enter dot-bg" style={{
      minHeight: "100vh",
      width: "100vw",
      maxWidth: "100%",
      fontFamily: "'Inter', sans-serif",
      color: "white",
      overflowX: "hidden",
      position: "relative",
    }}>
      <Navbar />

      <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "80px 40px 100px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "72px" }}>
          <div style={{
            display: "inline-block",
            background: "#1a0000",
            color: "#d00000",
            border: "1px solid #3a0000",
            padding: "5px 14px",
            borderRadius: "99px",
            fontSize: "11px",
            fontWeight: 700,
            marginBottom: "24px",
            letterSpacing: "0.1em",
          }}>
            SIMPLE PRICING
          </div>

          <h1 style={{ fontSize: "52px", fontWeight: 900, letterSpacing: "-2.5px", lineHeight: 1.08, color: "white", marginBottom: "16px" }}>
            Start free.{" "}
            <span style={{ color: "#d00000" }}>Upgrade when ready.</span>
          </h1>
          <p style={{ fontSize: "16px", color: "#555", maxWidth: "380px", margin: "0 auto", lineHeight: "1.7" }}>
            No credit card needed to start.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", alignItems: "start", marginBottom: "64px" }}>
          {plans.map((plan, i) => (
            <div
              key={plan.id}
              style={{
                background: "#111",
                border: plan.featured ? "2px solid #d00000" : "1px solid #1f1f1f",
                borderRadius: "20px",
                padding: "36px 32px",
                position: "relative",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.5s ease ${i * 120}ms, transform 0.5s ease ${i * 120}ms`,
                animation: plan.featured ? "pro-shimmer 2.5s ease-in-out infinite" : "none",
              }}
            >
              {/* MOST POPULAR badge */}
              {plan.badge && (
                <div style={{
                  position: "absolute",
                  top: "-14px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#d00000",
                  color: "white",
                  fontSize: "10px",
                  fontWeight: 800,
                  padding: "5px 18px",
                  borderRadius: "99px",
                  letterSpacing: "0.1em",
                  whiteSpace: "nowrap",
                }}>
                  {plan.badge}
                </div>
              )}

              {/* Plan label */}
              <div style={{
                fontSize: "11px",
                fontWeight: 700,
                color: plan.featured ? "#d00000" : "#444",
                letterSpacing: "0.12em",
                marginBottom: "14px",
              }}>
                {plan.name.toUpperCase()}
              </div>

              {/* Price */}
              <div style={{ marginBottom: "24px" }}>
                <span style={{ fontSize: "48px", fontWeight: 900, letterSpacing: "-2.5px", color: "white" }}>
                  {plan.price}
                </span>
                <span style={{ fontSize: "14px", color: "#444", marginLeft: "6px" }}>
                  / {plan.period}
                </span>
              </div>

              {/* CTA */}
              <Link
                to={plan.ctaLink}
                style={{
                  display: "block",
                  textAlign: "center",
                  background: plan.featured ? "#d00000" : "transparent",
                  color: plan.featured ? "white" : plan.id === "team" ? "#d00000" : "#aaa",
                  border: plan.featured ? "none" : `1px solid ${plan.id === "team" ? "#d00000" : "#333"}`,
                  textDecoration: "none",
                  padding: "14px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 900,
                  marginBottom: "28px",
                  transition: "opacity 0.2s, background 0.2s",
                }}
                onMouseEnter={e => {
                  if (plan.featured) e.currentTarget.style.opacity = "0.85"
                  else {
                    e.currentTarget.style.background = plan.id === "team" ? "#d00000" : "#1a1a1a"
                    e.currentTarget.style.color = "white"
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.opacity = "1"
                  if (!plan.featured) {
                    e.currentTarget.style.background = "transparent"
                    e.currentTarget.style.color = plan.id === "team" ? "#d00000" : "#aaa"
                  }
                }}
              >
                {plan.cta}
              </Link>

              {/* Divider */}
              <div style={{ height: "1px", background: "#1a1a1a", marginBottom: "24px" }} />

              {/* Feature list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
                {plan.features.map(f => (
                  <div key={f.text} style={{ display: "flex", alignItems: "flex-start", gap: "10px", opacity: f.check ? 1 : 0.35 }}>
                    <span style={{
                      flexShrink: 0,
                      fontSize: "12px",
                      fontWeight: 900,
                      color: f.check ? (plan.featured ? "#d00000" : "#888") : "#555",
                      marginTop: "1px",
                    }}>
                      {f.check ? "✓" : "✕"}
                    </span>
                    <span style={{
                      fontSize: "13px",
                      color: f.check ? "#999" : "#555",
                      lineHeight: "1.5",
                      textDecoration: f.check ? "none" : "line-through",
                    }}>
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div style={{ display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" }}>
          {TRUST.map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "16px" }}>{icon}</span>
              <span style={{ fontSize: "13px", color: "#444", fontWeight: 600 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
      <Footer />
      <MessageBubble />
    </div>
  )
}
