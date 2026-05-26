import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import MessageBubble from "../components/MessageBubble"
import WelcomePopup from "../components/WelcomePopup"

/* ── Data ── */
const previewNiches = [
  { name: "Trading",      icon: "📈", sub: "Markets & Strategy" },
  { name: "Dropshipping", icon: "📦", sub: "Products & Stores"  },
  { name: "Freelancing",  icon: "💻", sub: "Clients & Scaling"  },
  { name: "Content",      icon: "🎬", sub: "Audience & Brand"   },
]

const roadmapNodes = [
  { emoji: "🚀", label: "Start Here"       },
  { emoji: "⚖️", label: "Risk Management"  },
  { emoji: "📊", label: "Chart Reading"    },
  { emoji: "🧠", label: "Build Strategy"   },
  { emoji: "🏆", label: "Reach Your Goal", glow: true },
]

const communityAvatars = [
  { init: "JK" }, { init: "RM" }, { init: "AS" }, { init: "BT" },
  { init: "CL" }, { init: "DP" }, { init: "EW" }, { init: "FN" },
]

const activityCards = [
  { init: "JK", name: "Jake K.",   msg: "Just closed my first freelance client after following the roadmap. The AI mentor was incredible." },
  { init: "RM", name: "Rachel M.", msg: "3 weeks into trading and I finally understand risk management. This platform changed everything." },
  { init: "AS", name: "Alex S.",   msg: "Posted my first piece of content today. The community feedback helped me push through." },
]

const step1Bullets = [
  { title: "AI trained on your niche only",      sub: "Not a generic chatbot. A focused expert that knows your exact path."  },
  { title: "Step by step roadmap built for you", sub: "No missing steps. No wasted time. Everything in the right order."     },
  { title: "Available 24/7, never judgemental",  sub: "Ask anything. No stupid questions. Your mentor is always ready."      },
]

/* ── Utility components ── */
const Divider = () => (
  <div style={{ width: "100%", height: "1px", flexShrink: 0, background: "linear-gradient(to right, transparent, #1f1f1f 20%, #1f1f1f 80%, transparent)" }} />
)

const Num = ({ n }) => (
  <div className="m-num" style={{ position: "absolute", top: "-40px", left: "-10px", fontSize: "320px", fontWeight: 900, lineHeight: 1, color: "white", opacity: 0.025, pointerEvents: "none", userSelect: "none", letterSpacing: "-16px", zIndex: 0 }}>{n}</div>
)

const CenterWord = ({ word, size }) => (
  <div className="m-centerword" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: `${size}px`, fontWeight: 900, color: "#d00000", opacity: 0.03, pointerEvents: "none", userSelect: "none", zIndex: 0, letterSpacing: "-8px", whiteSpace: "nowrap" }}>{word}</div>
)

/* ── Page ── */
export default function HomePage() {
  const [line1, setLine1] = useState("")
  const [line2, setLine2] = useState("")
  const [showLine2, setShowLine2] = useState(false)
  const [done, setDone] = useState(false)
  const [activeCard, setActiveCard] = useState(0)
  const [visibleNodes, setVisibleNodes] = useState(0)
  const [avatarCount, setAvatarCount] = useState(0)
  const [communityCardCount, setCommunityCardCount] = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)

  const niches = [
    { name: "Trading",          icon: "📈", desc: "Learn the markets, manage risk and build a strategy that actually works." },
    { name: "Dropshipping",     icon: "📦", desc: "Find winning products, set margins right and build your first store."      },
    { name: "Freelancing",      icon: "💻", desc: "Land clients, price your work and scale without burning out."             },
    { name: "Content Creation", icon: "🎬", desc: "Grow an audience, monetize your content and build a real brand."          },
    { name: "Affiliate Marketing", icon: "💰", desc: "Promote products, earn commissions, and build passive income streams without holding any inventory." },
    { name: "AI Tools",         icon: "🤖", desc: "Use AI to automate, build products and stay ahead of everyone else."      },
  ]

  /* Typewriter */
  useEffect(() => {
    const text1 = "Skip the noise."
    const text2 = "Find your path."
    let i = 0
    const type1 = setInterval(() => {
      if (i < text1.length) { setLine1(text1.slice(0, i + 1)); i++ }
      else {
        clearInterval(type1)
        setTimeout(() => {
          setShowLine2(true)
          let j = 0
          const type2 = setInterval(() => {
            if (j < text2.length) { setLine2(text2.slice(0, j + 1)); j++ }
            else { clearInterval(type2); setDone(true) }
          }, 60)
        }, 400)
      }
    }, 60)
    return () => clearInterval(type1)
  }, [])

  /* Step 01 card cycling */
  useEffect(() => {
    const t = setInterval(() => setActiveCard(c => (c + 1) % 4), 1600)
    return () => clearInterval(t)
  }, [])

  /* Step 02 roadmap animation */
  useEffect(() => {
    let count = 0
    const t = setInterval(() => {
      count = (count + 1) % 8
      if (count < 5)      setVisibleNodes(count + 1)
      else if (count < 6) setVisibleNodes(5)
      else                setVisibleNodes(0)
    }, 500)
    return () => clearInterval(t)
  }, [])

  /* Step 03 community animation */
  useEffect(() => {
    const run = () => {
      setAvatarCount(0)
      setCommunityCardCount(0)
      for (let i = 1; i <= 8; i++) setTimeout(() => setAvatarCount(i), i * 250)
      setTimeout(() => setCommunityCardCount(1), 8 * 250 + 400)
      setTimeout(() => setCommunityCardCount(2), 8 * 250 + 1000)
      setTimeout(() => setCommunityCardCount(3), 8 * 250 + 1600)
    }
    run()
    const t = setInterval(run, 9000)
    return () => clearInterval(t)
  }, [])

  /* Welcome popup — show once */
  useEffect(() => {
    if (!localStorage.getItem("vaulte_welcome_seen")) {
      const t = setTimeout(() => setShowWelcome(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  return (
    <div className="dot-bg" style={{ minHeight: "100vh", width: "100vw", maxWidth: "100%", fontFamily: "'Inter', sans-serif", color: "white", overflowX: "hidden" }}>

      {showWelcome && <WelcomePopup onClose={() => setShowWelcome(false)} />}
      <Navbar />

      {/* ── Hero ── */}
      <div className="m-hero" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "90px 80px 56px", maxWidth: "1000px", margin: "0 auto", width: "100%" }}>
        <div style={{ display: "inline-block", background: "#1a0000", color: "#d00000", border: "1px solid #3a0000", padding: "5px 14px", borderRadius: "99px", fontSize: "11px", fontWeight: "700", marginBottom: "28px", letterSpacing: "0.1em" }}>
          AI MENTORS FOR EVERY NICHE
        </div>
        <div className="m-hero-title" style={{ fontSize: "76px", fontWeight: "900", lineHeight: "1.08", letterSpacing: "-3px", marginBottom: "28px", minHeight: "170px", width: "100%" }}>
          <div style={{ color: "white" }}>
            {line1}<span style={{ color: "#d00000", animation: !showLine2 ? "blink 1s infinite" : "none", opacity: !showLine2 ? 1 : 0 }}>|</span>
          </div>
          {showLine2 && (
            <div style={{ color: "#d00000" }}>
              {line2}<span style={{ color: "#d00000", animation: !done ? "blink 1s infinite" : "none", opacity: !done ? 1 : 0 }}>|</span>
            </div>
          )}
        </div>
        <div className="m-hero-sub" style={{ fontSize: "16px", color: "#555", marginBottom: "40px", lineHeight: "1.8", maxWidth: "560px" }}>
          Skip 100 hours of YouTube. Get a niche AI mentor, a real roadmap, and a community that&apos;s already done it.
        </div>
        <div className="m-hero-input" style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "620px" }}>
          <input placeholder="What niche are you in?" style={{ flex: 1, background: "#1a1a1a", border: "1px solid #333", color: "white", padding: "18px 22px", borderRadius: "8px", fontSize: "16px", fontWeight: "600", outline: "none", fontFamily: "'Inter', sans-serif" }} />
          <button style={{ background: "#d00000", color: "white", border: "none", padding: "18px 36px", borderRadius: "8px", fontSize: "15px", fontWeight: "900", cursor: "pointer", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" }}>Go →</button>
        </div>
      </div>

      <Divider />

      {/* ── Marquee ── */}
      <div style={{ width: "100%", padding: "60px 0 72px" }}>
        <p className="m-marquee-label" style={{ fontSize: "11px", color: "#444", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "28px", paddingLeft: "80px" }}>Pick your niche</p>
        <div style={{ overflow: "hidden", width: "100%", WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)", maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}>
          <div style={{ display: "flex", gap: "16px", width: "max-content", animation: "marquee 32s linear infinite" }}>
            {[...niches, ...niches].map((n, i) => (
              <div key={i} style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: "16px", padding: "26px 28px", width: "290px", flexShrink: 0, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "30px", marginBottom: "14px" }}>{n.icon}</div>
                <div style={{ fontSize: "16px", fontWeight: "800", color: "white", marginBottom: "10px" }}>{n.name}</div>
                <div style={{ fontSize: "12px", color: "#555", lineHeight: "1.7", marginBottom: "20px", flex: 1 }}>{n.desc}</div>
                <button style={{ alignSelf: "flex-start", background: "#d00000", color: "white", border: "none", padding: "7px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>Enter →</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Divider />

      {/* ── How It Works ── */}
      <div style={{ width: "100%", padding: "100px 0 0" }}>
        <div className="m-hiw-header" style={{ textAlign: "center", marginBottom: "80px", padding: "0 80px" }}>
          <div style={{ display: "inline-block", background: "#1a0000", color: "#d00000", border: "1px solid #3a0000", padding: "5px 14px", borderRadius: "99px", fontSize: "11px", fontWeight: "700", marginBottom: "24px", letterSpacing: "0.1em" }}>HOW IT WORKS</div>
          <div className="m-hiw-heading" style={{ fontSize: "48px", fontWeight: "900", lineHeight: "1.08", letterSpacing: "-2px" }}>
            <div style={{ color: "white" }}>Three steps.</div>
            <div style={{ color: "#d00000" }}>That&apos;s all it takes.</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>

          {/* ── Step 01 ── */}
          <div className="m-step" style={{ position: "relative", overflow: "hidden", padding: "64px 80px" }}>
            <Num n="01" />
            <CenterWord word="NICHE" size={180} />
            <div className="m-step-inner" style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", gap: "80px", maxWidth: "1200px", margin: "0 auto" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#d00000", letterSpacing: "0.15em", marginBottom: "18px" }}>STEP 01</div>
                <div className="m-step-title" style={{ fontSize: "52px", fontWeight: "900", lineHeight: "1.1", letterSpacing: "-3px", marginBottom: "20px" }}>
                  <div style={{ color: "white" }}>Pick your niche,</div>
                  <div style={{ color: "#d00000" }}>meet your mentor.</div>
                </div>
                <div className="m-step-desc" style={{ fontSize: "15px", color: "#666", lineHeight: "1.9", maxWidth: "400px", marginBottom: "28px" }}>
                  Tell us what you&apos;re building towards. We match you with an AI mentor built specifically for your path — not generic advice that applies to everyone.
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {step1Bullets.map((b, i) => (
                    <div key={i} style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "flex-start", gap: "14px" }}>
                      <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#d00000", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                        <span style={{ color: "white", fontSize: "12px", fontWeight: "900" }}>✓</span>
                      </div>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: "white", marginBottom: "4px" }}>{b.title}</div>
                        <div style={{ fontSize: "12px", color: "#444", lineHeight: "1.6" }}>{b.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="m-step-preview" style={{ flex: 1, background: "#111", border: "1px solid #222", borderRadius: "20px", padding: "28px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridAutoRows: "130px", gap: "12px", marginBottom: "16px" }}>
                  {previewNiches.map((n, i) => (
                    <div key={i} style={{ background: activeCard === i ? "#1a0000" : "#0d0d0d", border: activeCard === i ? "1.5px solid #d00000" : "1px solid #1f1f1f", borderRadius: "14px", padding: "20px", transition: "all 0.4s ease", transform: activeCard === i ? "scale(1.04)" : "scale(1)", display: "flex", flexDirection: "column" }}>
                      <div style={{ fontSize: "26px", marginBottom: "10px" }}>{n.icon}</div>
                      <div style={{ fontSize: "14px", fontWeight: "900", color: activeCard === i ? "white" : "#888" }}>{n.name}</div>
                      <div style={{ fontSize: "11px", color: "#444", marginTop: "4px" }}>{n.sub}</div>
                    </div>
                  ))}
                </div>
                <button style={{ width: "100%", background: "#d00000", color: "white", border: "none", padding: "14px", borderRadius: "10px", fontSize: "14px", fontWeight: "900", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>
                  Enter {previewNiches[activeCard].name} →
                </button>
              </div>
            </div>
          </div>

          <Divider />

          {/* ── Step 02 ── */}
          <div className="m-step" style={{ position: "relative", overflow: "hidden", padding: "56px 80px" }}>
            <Num n="02" />
            <CenterWord word="ROADMAP" size={160} />
            <div className="m-step-inner" style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", flexDirection: "row-reverse", gap: "80px", maxWidth: "1200px", margin: "0 auto" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#d00000", letterSpacing: "0.15em", marginBottom: "18px" }}>STEP 02</div>
                <div className="m-step-title" style={{ fontSize: "52px", fontWeight: "900", lineHeight: "1.1", letterSpacing: "-3px", marginBottom: "20px" }}>
                  <div style={{ color: "white" }}>Follow a real</div>
                  <div style={{ color: "#d00000" }}>roadmap.</div>
                </div>
                <div className="m-step-desc" style={{ fontSize: "15px", color: "#666", lineHeight: "1.9", maxWidth: "400px" }}>
                  No fluff. A clear, step-by-step path from where you are now to where you want to be — built by people who&apos;ve already done it in your niche.
                </div>
              </div>
              <div className="m-step-preview" style={{ flex: 1, background: "#111", border: "1px solid #222", borderRadius: "20px", padding: "32px 28px", minHeight: "340px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                {roadmapNodes.map((node, i) => {
                  const on = visibleNodes > i
                  return (
                    <div key={i}>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px", opacity: on ? 1 : 0.1, transition: "all 0.35s ease", transform: on ? "translateX(0)" : "translateX(-10px)" }}>
                        <div style={{ width: "46px", height: "46px", borderRadius: "50%", flexShrink: 0, background: on ? (node.glow ? "#d00000" : "#1a0000") : "#0d0d0d", border: `2px solid ${on ? "#d00000" : "#222"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", boxShadow: node.glow && on ? "0 0 22px rgba(208,0,0,0.55)" : "none", transition: "all 0.35s ease" }}>
                          {node.emoji}
                        </div>
                        <div style={{ fontSize: "14px", fontWeight: "700", color: on ? (node.glow ? "#d00000" : "white") : "#2a2a2a" }}>{node.label}</div>
                      </div>
                      {i < roadmapNodes.length - 1 && (
                        <div style={{ marginLeft: "22px", width: "2px", height: "36px", background: `repeating-linear-gradient(to bottom, ${visibleNodes > i + 1 ? "#d00000" : "#2a2a2a"} 0px, ${visibleNodes > i + 1 ? "#d00000" : "#2a2a2a"} 5px, transparent 5px, transparent 10px)`, transition: "background 0.35s ease" }} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <Divider />

          {/* ── Step 03 ── */}
          <div className="m-step" style={{ position: "relative", overflow: "hidden", padding: "56px 80px" }}>
            <Num n="03" />
            <CenterWord word="COMMUNITY" size={140} />
            <div className="m-step-inner" style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "80px", maxWidth: "1200px", margin: "0 auto" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#d00000", letterSpacing: "0.15em", marginBottom: "18px" }}>STEP 03</div>
                <div className="m-step-title" style={{ fontSize: "52px", fontWeight: "900", lineHeight: "1.1", letterSpacing: "-3px", marginBottom: "20px" }}>
                  <div style={{ color: "white" }}>Grow with a</div>
                  <div style={{ color: "#d00000" }}>community.</div>
                </div>
                <div className="m-step-desc" style={{ fontSize: "15px", color: "#666", lineHeight: "1.9", maxWidth: "400px" }}>
                  Connect with others on the exact same journey. Share wins, ask questions, and stay accountable with people who actually get what you&apos;re building.
                </div>
              </div>
              <div className="m-step-preview" style={{ flex: 1, background: "#111", border: "1px solid #222", borderRadius: "20px", padding: "28px" }}>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "22px" }}>
                  {communityAvatars.map((a, i) => (
                    <div key={i} style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#1a0000", border: "2px solid #d00000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800", color: "#d00000", opacity: avatarCount > i ? 1 : 0, transform: avatarCount > i ? "scale(1)" : "scale(0.4)", transition: "all 0.3s ease" }}>
                      {a.init}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {activityCards.map((card, i) => (
                    <div key={i} style={{ background: "#0d0d0d", border: "1px solid #1f1f1f", borderRadius: "10px", padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: "12px", opacity: communityCardCount > i ? 1 : 0, transform: communityCardCount > i ? "translateY(0)" : "translateY(14px)", transition: "all 0.45s ease" }}>
                      <div style={{ width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0, background: "#1a0000", border: "2px solid #d00000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800", color: "#d00000" }}>{card.init}</div>
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: "700", color: "white", marginBottom: "4px" }}>{card.name}</div>
                        <div style={{ fontSize: "11px", color: "#555", lineHeight: "1.6" }}>{card.msg}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Divider />

      <Footer />
      <MessageBubble />
    </div>
  )
}
