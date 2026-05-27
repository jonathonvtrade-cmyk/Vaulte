import { useState, useEffect, Fragment } from "react"
import { Link } from "react-router-dom"

const DOT_BG_FOOTER = `#080808 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23d00000' fill-opacity='0.06'/%3E%3C/svg%3E") repeat`

const footerNodes = [
  { emoji: "🚀", label: "Start"     },
  { emoji: "⚖️", label: "Learn"     },
  { emoji: "🗺️", label: "Roadmap"   },
  { emoji: "👥", label: "Community" },
  { emoji: "💡", label: "Build"     },
  { emoji: "🏆", label: "Goal", isGoal: true },
]

const socialLinks = [
  {
    label: "Instagram",
    href: "#",
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="6" stroke="#d00000" strokeWidth="1.8"/>
        <circle cx="12" cy="12" r="5" stroke="#d00000" strokeWidth="1.8"/>
        <circle cx="17.5" cy="6.5" r="1.2" fill="#d00000"/>
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "#",
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#d00000">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.31a8.16 8.16 0 0 0 4.79 1.52V6.44a4.85 4.85 0 0 1-1.02-.25z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="4" stroke="#d00000" strokeWidth="1.8"/>
        <path d="M10 9.5l5.5 2.5-5.5 2.5V9.5z" fill="#d00000"/>
      </svg>
    ),
  },
  {
    label: "Email",
    href: "#",
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="16" rx="2" stroke="#d00000" strokeWidth="1.8"/>
        <path d="M2 6l10 9 10-9" stroke="#d00000" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
]

const platformLinks = [
  { label: "Explore",   to: "/explore"   },
  { label: "Roadmap",   to: "/roadmap"   },
  { label: "Community", to: "/community" },
  { label: "Ask AI",    to: "/mentor"    },
]

const companyLinks = [
  { label: "About",   to: "/about"    },
  { label: "Pricing", to: "/pricing"  },
  { label: "Blog",    to: "/blog"     },
  { label: "Contact", to: "/contact"  },
]

const legalLinks = [
  { label: "Privacy", to: "/privacy" },
  { label: "Terms",   to: "/terms"   },
  { label: "Cookies", to: "/cookies" },
]

export default function Footer() {
  const [footerProgress, setFooterProgress] = useState(0)
  const [iconsVisible,   setIconsVisible]   = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setIconsVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    let count = 0
    const t = setInterval(() => {
      count = (count + 1) % 14
      if (count <= 11)      setFooterProgress(count)
      else if (count <= 12) setFooterProgress(11)
      else                  setFooterProgress(0)
    }, 500)
    return () => clearInterval(t)
  }, [])

  const linkStyle = { fontSize: "13px", color: "#555", textDecoration: "none", transition: "color 0.2s" }

  return (
    <footer
      className="m-footer"
      style={{
        background:  DOT_BG_FOOTER,
        borderTop:   "3px solid #d00000",
        padding:     "56px 64px 0",
        fontFamily:  "'Inter', sans-serif",
        color:       "white",
      }}
    >
      {/* ── Main grid ── */}
      <div
        className="m-footer-grid"
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px", marginBottom: "56px" }}
      >

        {/* Brand + socials */}
        <div className="m-footer-brand">
          <Link to="/" style={{ textDecoration: "none" }}>
            <div style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-1.5px", color: "white", marginBottom: "12px" }}>
              VAULT<span style={{ color: "#d00000" }}>E</span>
            </div>
          </Link>
          <div style={{ fontSize: "13px", color: "#444", marginBottom: "28px", lineHeight: "1.7" }}>
            AI mentors for every niche.<br />Skip the noise, find your path.
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {socialLinks.map((icon, i) => (
              <a
                key={i}
                href={icon.href}
                aria-label={icon.label}
                style={{
                  width: "44px", height: "44px", borderRadius: "10px",
                  background: "#111", border: "1px solid #1f1f1f",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", textDecoration: "none",
                  opacity:   iconsVisible ? 1 : 0,
                  transform: iconsVisible ? "translateY(0)" : "translateY(12px)",
                  transition: `opacity 0.35s ease ${i * 120}ms, transform 0.35s ease ${i * 120}ms`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background    = "#1a0000"
                  e.currentTarget.style.borderColor   = "#d00000"
                  e.currentTarget.style.transform     = "scale(1.08) translateY(-2px)"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background    = "#111"
                  e.currentTarget.style.borderColor   = "#1f1f1f"
                  e.currentTarget.style.transform     = "translateY(0)"
                }}
              >
                {icon.svg}
              </a>
            ))}
          </div>
        </div>

        {/* Platform */}
        <div>
          <div style={{ fontSize: "10px", color: "#333", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "20px" }}>PLATFORM</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {platformLinks.map(({ label, to }) => (
              <Link key={label} to={to} style={linkStyle}
                onMouseEnter={e => e.currentTarget.style.color = "#d00000"}
                onMouseLeave={e => e.currentTarget.style.color = "#555"}
              >{label}</Link>
            ))}
          </div>
        </div>

        {/* Company */}
        <div>
          <div style={{ fontSize: "10px", color: "#333", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "20px" }}>COMPANY</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {companyLinks.map(({ label, to }) => (
              <Link key={label} to={to} style={linkStyle}
                onMouseEnter={e => e.currentTarget.style.color = "#d00000"}
                onMouseLeave={e => e.currentTarget.style.color = "#555"}
              >{label}</Link>
            ))}
          </div>
        </div>

        {/* Legal */}
        <div>
          <div style={{ fontSize: "10px", color: "#333", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "20px" }}>LEGAL</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {legalLinks.map(({ label, to }) => (
              <Link key={label} to={to} style={linkStyle}
                onMouseEnter={e => e.currentTarget.style.color = "#d00000"}
                onMouseLeave={e => e.currentTarget.style.color = "#555"}
              >{label}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Roadmap animation ── */}
      <div style={{ borderTop: "1px solid #141414", paddingTop: "32px" }}>
        <div style={{ textAlign: "center", fontSize: "10px", color: "#333", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "24px" }}>
          YOUR PATH TO THE GOAL
        </div>
        <div
          className="m-footer-roadmap"
          style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", marginBottom: "40px" }}
        >
          {footerNodes.map((node, i) => {
            const nodeOn = footerProgress >= i * 2 + 1
            const connOn = footerProgress >= i * 2 + 2
            return (
              <Fragment key={i}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    className="m-footer-node"
                    style={{
                      width: "48px", height: "48px", borderRadius: "50%", flexShrink: 0,
                      background: nodeOn ? (node.isGoal ? "#d00000" : "#1a0000") : "#111",
                      border: `2px solid ${nodeOn ? "#d00000" : "#222"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "20px",
                      boxShadow: node.isGoal && nodeOn ? "0 0 20px rgba(208,0,0,0.5)" : "none",
                      transition: "all 0.35s ease",
                      opacity: iconsVisible ? 1 : 0,
                    }}
                  >{node.emoji}</div>
                  <div style={{
                    marginTop: "8px", fontSize: "11px", fontWeight: 700,
                    color: nodeOn ? "#d00000" : "#555",
                    transition: "color 0.35s ease", whiteSpace: "nowrap",
                  }}>{node.label}</div>
                </div>
                {i < footerNodes.length - 1 && (
                  <div
                    className="m-footer-conn"
                    style={{
                      width: "60px", height: "2px", flexShrink: 0,
                      marginTop: "23px",
                      background: connOn ? "#d00000" : "#1f1f1f",
                      transition: "background 0.35s ease",
                    }}
                  />
                )}
              </Fragment>
            )
          })}
        </div>
      </div>

      {/* ── Copyright ── */}
      <div
        className="m-copyright"
        style={{ borderTop: "1px solid #141414", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <span style={{ fontSize: "12px", color: "#2a2a2a" }}>© 2025 Vaulte. All rights reserved.</span>
        <span style={{ fontSize: "12px", color: "#2a2a2a" }}>Built for people serious about it.</span>
      </div>
    </footer>
  )
}
