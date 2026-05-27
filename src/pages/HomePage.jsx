import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import MessageBubble from "../components/MessageBubble"
import WelcomePopup from "../components/WelcomePopup"
import { supabase } from "../supabaseClient"

/* ── Ticker fallback (8 exact messages from spec) ── */
const FALLBACK_TICKER = [
  { msg: "Jake K. just completed Step 4 in Trading" },
  { msg: "Sara R. just joined Freelancing" },
  { msg: "Devon L. hit step 8 of his roadmap" },
  { msg: "Taylor K. completed the full roadmap" },
  { msg: "Morgan S. posted in the Dropshipping community" },
  { msg: "Riley T. just joined AI Tools" },
  { msg: "Casey S. hit step 5 in Freelancing" },
  { msg: "Alex R. completed his Trading roadmap" },
]

/* ── 14 hero background card data ── */
const HERO_CARD_DATA = [
  // Row 1
  { type: "review",            niche: "TRADING",      name: "Jordan M.", quote: "Better than 3 years of YouTube." },
  { type: "mentor",            niche: "TRADING",      quote: "Before anything: risk management. Most beginners skip this and blow their account.", progress: { step: 3, total: 12 } },
  { type: "mentor",            niche: "CONTENT",      quote: "Your hook is everything. First 3 seconds don't grab? They scroll." },
  { type: "review",            niche: "FREELANCING",  name: "Sara K.",   quote: "First client week 2. Roadmap told me exactly what to say." },
  // Row 2 (2 cards)
  { type: "roadmap",           steps: [
      { label: "Start Here",      done: true,  current: false },
      { label: "Learn Basics",    done: true,  current: false },
      { label: "Risk Management", done: false, current: true  },
      { label: "Build Strategy",  done: false, current: false },
    ]},
  { type: "community",         members: [
      { init: "JK", name: "Jake K.",   msg: "Just hit step 8 🔥"   },
      { init: "RM", name: "Rachel M.", msg: "First sale done 💰"    },
      { init: "AS", name: "Alex S.",   msg: "30 days of content!"  },
    ]},
  // Row 3
  { type: "mentor",            niche: "FREELANCING",  quote: "Never charge hourly. Price per project — triples income." },
  { type: "review",            niche: "DROPSHIPPING", name: "Devon L.",  quote: "Stopped losing money after step 3." },
  { type: "mentor",            niche: "AFFILIATE",    quote: "One niche. One product. One traffic source. Master that first." },
  { type: "review",            niche: "AI TOOLS",     name: "Marcus R.", quote: "Automated workflow in 2 weeks. Mentor nailed it." },
  // Row 4
  { type: "review",            niche: "AFFILIATE",    name: "Alex R.",   quote: "$1200 passive last month." },
  { type: "mentor",            niche: "DROPSHIPPING", quote: "Your margin needs to be 40%+ after ALL fees. Account for everything." },
  { type: "review",            niche: "CONTENT",      name: "Taylor K.", quote: "10k followers in 6 weeks. Roadmap step by step." },
  { type: "roadmap-progress",  step: 7, total: 12, pct: 58 },
]

/* Absolute positions for each card */
const CARD_POSITIONS = [
  { top: 16,  left: "1%"   },  // 0 – Row 1
  { top: 16,  left: "21%"  },  // 1
  { top: 16,  right: "21%" },  // 2
  { top: 16,  right: "1%"  },  // 3
  { top: 190, left: "1%"   },  // 4 – Row 2
  { top: 190, right: "1%"  },  // 5
  { top: 370, left: "1%"   },  // 6 – Row 3
  { top: 370, left: "21%"  },  // 7
  { top: 370, right: "21%" },  // 8
  { top: 370, right: "1%"  },  // 9
  { top: 540, left: "1%"   },  // 10 – Row 4
  { top: 540, left: "21%"  },  // 11
  { top: 540, right: "21%" },  // 12
  { top: 540, right: "1%"  },  // 13
]

/* Float animation name + duration for each card */
const CARD_ANIMS = [
  "fc0 7s", "fc1 8s",   "fc2 6.5s", "fc3 9s",
  "fc4 7.5s", "fc5 8.5s",
  "fc6 6s",  "fc7 7s",  "fc8 8s",   "fc9 6.5s",
  "fc10 9s", "fc11 7.5s","fc12 8.5s","fc13 6s",
]

/* ── Static data ── */
const roadmapNodes = [
  { emoji: "🚀", label: "Start Here"      },
  { emoji: "⚖️", label: "Risk Management" },
  { emoji: "📊", label: "Chart Reading"   },
  { emoji: "🧠", label: "Build Strategy"  },
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
const previewNiches = [
  { name: "Trading",      icon: "📈", sub: "Markets & Strategy" },
  { name: "Dropshipping", icon: "📦", sub: "Products & Stores"  },
  { name: "Freelancing",  icon: "💻", sub: "Clients & Scaling"  },
  { name: "Content",      icon: "🎬", sub: "Audience & Brand"   },
]
const STACKED_INITS = ["JK", "RM", "AS", "BT", "CL"]

/* ── Utility ── */
const NeonDivider = () => (
  <div style={{
    width: "100%", height: "1px", flexShrink: 0,
    background: "#d00000",
    boxShadow: "0 0 10px rgba(208,0,0,0.7), 0 0 20px rgba(208,0,0,0.3)",
  }} />
)
const Num = ({ n }) => (
  <div className="m-num" style={{ position: "absolute", top: "-40px", left: "-10px", fontSize: "320px", fontWeight: 900, lineHeight: 1, color: "white", opacity: 0.025, pointerEvents: "none", userSelect: "none", letterSpacing: "-16px", zIndex: 0 }}>{n}</div>
)
const CenterWord = ({ word, size }) => (
  <div className="m-centerword" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: `${size}px`, fontWeight: 900, color: "#d00000", opacity: 0.03, pointerEvents: "none", userSelect: "none", zIndex: 0, letterSpacing: "-8px", whiteSpace: "nowrap" }}>{word}</div>
)

/* ── Hero background card renderer ── */
function HeroCard({ data }) {
  if (data.type === "review") return (
    <div>
      <div style={{ fontSize: "9px", fontWeight: 800, color: "#555", letterSpacing: "0.08em", marginBottom: "5px" }}>⭐⭐⭐⭐⭐ {data.niche}</div>
      <div style={{ fontSize: "9px", fontWeight: 700, color: "#888", marginBottom: "4px" }}>{data.name}</div>
      <div style={{ fontSize: "9px", color: "#444", lineHeight: "1.5", fontStyle: "italic" }}>"{data.quote}"</div>
    </div>
  )
  if (data.type === "mentor") return (
    <div>
      <div style={{ fontSize: "9px", fontWeight: 800, color: "#d00000", letterSpacing: "0.08em", marginBottom: "5px" }}>🤖 {data.niche} MENTOR</div>
      <div style={{ fontSize: "9px", color: "#666", lineHeight: "1.5", marginBottom: data.progress ? "8px" : 0, fontStyle: "italic" }}>"{data.quote}"</div>
      {data.progress && (
        <>
          <div style={{ fontSize: "8px", color: "#555", marginBottom: "3px" }}>STEP {data.progress.step} OF {data.progress.total}</div>
          <div style={{ background: "#1a1a1a", borderRadius: "99px", height: "3px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.round((data.progress.step / data.progress.total) * 100)}%`, background: "#d00000", borderRadius: "99px" }} />
          </div>
        </>
      )}
    </div>
  )
  if (data.type === "community") return (
    <div>
      <div style={{ fontSize: "9px", fontWeight: 800, color: "#00cc66", letterSpacing: "0.08em", marginBottom: "7px" }}>
        <span style={{ display: "inline-block", width: "5px", height: "5px", borderRadius: "50%", background: "#00cc66", marginRight: "4px", verticalAlign: "middle" }} />
        COMMUNITY LIVE
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {data.members.map((row, i) => (
          <div key={i} style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#1a0000", border: "1px solid #d00000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "7px", fontWeight: 800, color: "#d00000", flexShrink: 0 }}>{row.init}</div>
            <div>
              <div style={{ fontSize: "8px", fontWeight: 700, color: "#888" }}>{row.name}</div>
              <div style={{ fontSize: "8px", color: "#444" }}>{row.msg}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  if (data.type === "roadmap") return (
    <div>
      <div style={{ fontSize: "9px", fontWeight: 800, color: "#d00000", letterSpacing: "0.08em", marginBottom: "7px" }}>🗺️ ROADMAP</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {data.steps.map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{
              width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0,
              background: step.done ? "#d00000" : "transparent",
              border: step.done ? "1.5px solid #d00000" : step.current ? "1.5px solid #d00000" : "1.5px solid #333",
              boxShadow: step.current ? "0 0 4px rgba(208,0,0,0.7)" : "none",
            }} />
            <div style={{ fontSize: "8px", color: step.done ? "#d00000" : step.current ? "white" : "#333", fontWeight: step.current ? 700 : 400 }}>{step.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
  if (data.type === "roadmap-progress") return (
    <div>
      <div style={{ fontSize: "9px", fontWeight: 800, color: "#d00000", letterSpacing: "0.08em", marginBottom: "6px" }}>🗺️ ROADMAP</div>
      <div style={{ fontSize: "9px", fontWeight: 700, color: "#888", marginBottom: "6px" }}>Step {data.step} of {data.total} complete</div>
      <div style={{ background: "#1a1a1a", borderRadius: "99px", height: "3px", overflow: "hidden", marginBottom: "4px" }}>
        <div style={{ height: "100%", width: `${data.pct}%`, background: "#d00000", borderRadius: "99px" }} />
      </div>
      <div style={{ fontSize: "8px", color: "#d00000" }}>{data.pct}% complete</div>
    </div>
  )
  return null
}

/* ── Page ── */
export default function HomePage() {
  const hiw           = useRef(null)
  const cardRefs      = useRef([])
  const activeHl      = useRef(null)   // index of currently highlighted card

  /* Typewriter */
  const [line1,     setLine1]     = useState("")
  const [line2,     setLine2]     = useState("")
  const [showLine2, setShowLine2] = useState(false)
  const [done,      setDone]      = useState(false)

  /* Step animations */
  const [activeCard,         setActiveCard]         = useState(0)
  const [visibleNodes,       setVisibleNodes]        = useState(0)
  const [avatarCount,        setAvatarCount]         = useState(0)
  const [communityCardCount, setCommunityCardCount]  = useState(0)

  /* Data from Supabase */
  const [memberCount,    setMemberCount]    = useState(2341)
  const [tickerItems,    setTickerItems]    = useState(FALLBACK_TICKER)
  const [communityPosts, setCommunityPosts] = useState([])

  const [showWelcome, setShowWelcome] = useState(false)

  const niches = [
    { name: "Trading",           icon: "📈", desc: "Learn the markets, manage risk and build a strategy that actually works." },
    { name: "Dropshipping",      icon: "📦", desc: "Find winning products, set margins right and build your first store."      },
    { name: "Freelancing",       icon: "💻", desc: "Land clients, price your work and scale without burning out."             },
    { name: "Content Creation",  icon: "🎬", desc: "Grow an audience, monetize your content and build a real brand."          },
    { name: "Affiliate Marketing",icon:"💰", desc: "Promote products, earn commissions, and build passive income streams."    },
    { name: "AI Tools",          icon: "🤖", desc: "Use AI to automate, build products and stay ahead of everyone else."      },
  ]

  /* ── Typewriter ── */
  useEffect(() => {
    const t1 = "Skip the noise.", t2 = "Find your path."
    let i = 0
    const iv1 = setInterval(() => {
      if (i < t1.length) { setLine1(t1.slice(0, i + 1)); i++ }
      else {
        clearInterval(iv1)
        setTimeout(() => {
          setShowLine2(true)
          let j = 0
          const iv2 = setInterval(() => {
            if (j < t2.length) { setLine2(t2.slice(0, j + 1)); j++ }
            else { clearInterval(iv2); setDone(true) }
          }, 60)
        }, 400)
      }
    }, 60)
    return () => clearInterval(iv1)
  }, [])

  /* ── Card highlight interval (1800ms, 1s on then off) ── */
  useEffect(() => {
    const interval = setInterval(() => {
      /* Clear previous highlight */
      if (activeHl.current !== null) {
        const prev = cardRefs.current[activeHl.current]
        if (prev) {
          prev.style.border    = "1px solid #1f1f1f"
          prev.style.boxShadow = "none"
          prev.style.opacity   = "0.15"
        }
      }
      /* Pick new random card */
      const idx = Math.floor(Math.random() * 14)
      activeHl.current = idx
      const el = cardRefs.current[idx]
      if (el) {
        el.style.border    = "1px solid #d00000"
        el.style.boxShadow = "0 0 14px rgba(208,0,0,0.4)"
        el.style.opacity   = "0.28"
        const captured = idx
        setTimeout(() => {
          if (activeHl.current === captured) {
            const same = cardRefs.current[captured]
            if (same) {
              same.style.border    = "1px solid #1f1f1f"
              same.style.boxShadow = "none"
              same.style.opacity   = "0.15"
            }
            activeHl.current = null
          }
        }, 1000)
      }
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  /* ── Step 01 card cycle ── */
  useEffect(() => {
    const t = setInterval(() => setActiveCard(c => (c + 1) % 4), 1600)
    return () => clearInterval(t)
  }, [])

  /* ── Step 02 roadmap animation ── */
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

  /* ── Step 03 community animation ── */
  useEffect(() => {
    const run = () => {
      setAvatarCount(0); setCommunityCardCount(0)
      for (let i = 1; i <= 8; i++) setTimeout(() => setAvatarCount(i), i * 250)
      setTimeout(() => setCommunityCardCount(1), 8 * 250 + 400)
      setTimeout(() => setCommunityCardCount(2), 8 * 250 + 1000)
      setTimeout(() => setCommunityCardCount(3), 8 * 250 + 1600)
    }
    run()
    const t = setInterval(run, 9000)
    return () => clearInterval(t)
  }, [])

  /* ── Welcome popup ── */
  useEffect(() => {
    if (!localStorage.getItem("vaulte_welcome_seen")) {
      const t = setTimeout(() => setShowWelcome(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  /* ── Member count (real, poll every 30s) ── */
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { count } = await supabase.from("profiles").select("id", { count: "exact", head: true })
        if (count) setMemberCount(count)
      } catch {}
    }
    fetchCount()
    const t = setInterval(fetchCount, 30000)
    return () => clearInterval(t)
  }, [])

  /* ── Community posts for floating card ── */
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await supabase
          .from("community_posts")
          .select("niche, content, created_at, profiles!user_id(first_name, last_name)")
          .order("created_at", { ascending: false })
          .limit(3)
        if (data && data.length > 0) setCommunityPosts(data)
      } catch {}
    }
    fetchPosts()
  }, [])

  /* ── Activity ticker (real data, poll every 60s) ── */
  useEffect(() => {
    const fetchTicker = async () => {
      try {
        const [{ data: posts }, { data: completions }] = await Promise.all([
          supabase
            .from("community_posts")
            .select("niche, created_at, profiles!user_id(first_name, last_name)")
            .order("created_at", { ascending: false })
            .limit(10),
          supabase
            .from("roadmap_progress")
            .select("niche, step_index, profiles!user_id(first_name, last_name)")
            .eq("completed", true)
            .order("updated_at", { ascending: false })
            .limit(5),
        ])
        const items = []
        if (posts) posts.forEach(p => {
          const name = p.profiles ? `${p.profiles.first_name || ""} ${(p.profiles.last_name?.[0] || "")}.`.trim() : "A member"
          items.push({ msg: `${name} just posted in ${p.niche}` })
        })
        if (completions) completions.forEach(c => {
          const name = c.profiles ? `${c.profiles.first_name || ""} ${(c.profiles.last_name?.[0] || "")}.`.trim() : "A member"
          items.push({ msg: `${name} just completed Step ${(c.step_index || 0) + 1} in ${c.niche}` })
        })
        if (items.length > 0) setTickerItems(items)
      } catch {}
    }
    fetchTicker()
    const t = setInterval(fetchTicker, 60000)
    return () => clearInterval(t)
  }, [])

  const scrollToHIW = () => {
    const el = hiw.current || document.getElementById("how-it-works")
    el?.scrollIntoView({ behavior: "smooth" })
  }

  const tickerDouble = [...tickerItems, ...tickerItems]

  return (
    <div className="dot-bg" style={{ minHeight: "100vh", width: "100vw", maxWidth: "100%", fontFamily: "'Inter', sans-serif", color: "white", overflowX: "hidden" }}>

      {showWelcome && <WelcomePopup onClose={() => setShowWelcome(false)} />}
      <Navbar />
      <NeonDivider />

      {/* ── Activity Ticker ── */}
      <div style={{
        background: "#080808",
        borderBottom: "1px solid #1a1a1a",
        height: "36px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
      }}>
        <div className="ticker-track" style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
          {tickerDouble.map((item, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "8px", paddingRight: "60px", fontSize: "11px", color: "#555", fontWeight: 600 }}>
              <span className="ticker-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00cc66", display: "inline-block", flexShrink: 0 }} />
              {item.msg}
            </span>
          ))}
        </div>
      </div>
      <NeonDivider />

      {/* ── Hero (680px fixed height) ── */}
      <div style={{ position: "relative", height: "680px", overflow: "hidden", width: "100%" }}>

        {/* SVG dot matrix background */}
        <svg
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%", zIndex: 0 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="hero-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#d00000" fillOpacity="0.08" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-dots)" />
        </svg>

        {/* Scanline */}
        <div className="hero-scanline" />

        {/* ── 14 floating background cards ── */}
        <div className="hero-bg-cards">
          {HERO_CARD_DATA.map((data, i) => {
            const pos = CARD_POSITIONS[i]
            return (
              <div
                key={i}
                ref={el => { cardRefs.current[i] = el }}
                style={{
                  position: "absolute",
                  top: pos.top,
                  ...(pos.left  !== undefined && { left:  pos.left  }),
                  ...(pos.right !== undefined && { right: pos.right }),
                  width: "158px",
                  background: "#111",
                  border: "1px solid #1f1f1f",
                  borderRadius: "12px",
                  padding: "11px",
                  opacity: 0.15,
                  zIndex: 1,
                  pointerEvents: "none",
                  userSelect: "none",
                  animation: `${CARD_ANIMS[i]} ease-in-out infinite`,
                  transition: "border 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease",
                }}
              >
                <HeroCard data={data} />
              </div>
            )
          })}
        </div>

        {/* ── Hero center content ── */}
        <div
          className="m-hero"
          style={{
            position: "absolute",
            top: 0, right: 0, bottom: 0, left: 0,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 24px",
          }}
        >
          {/* Badge */}
          <div style={{ display: "inline-block", background: "#1a0000", color: "#d00000", border: "1px solid #3a0000", padding: "5px 14px", borderRadius: "99px", fontSize: "12px", fontWeight: 700, marginBottom: "24px", letterSpacing: "0.18em" }}>
            AI MENTORS FOR EVERY NICHE
          </div>

          {/* Heading (typewriter) */}
          <div
            className="m-hero-title"
            style={{ fontSize: "64px", fontWeight: 900, letterSpacing: "-3px", lineHeight: "1.08", marginBottom: "22px", minHeight: "142px" }}
          >
            <div style={{ color: "white" }}>
              {line1}<span style={{ color: "#d00000", animation: !showLine2 ? "blink 1s infinite" : "none", opacity: !showLine2 ? 1 : 0 }}>|</span>
            </div>
            {showLine2 && (
              <div style={{ color: "#d00000" }}>
                {line2}<span style={{ color: "#d00000", animation: !done ? "blink 1s infinite" : "none", opacity: !done ? 1 : 0 }}>|</span>
              </div>
            )}
          </div>

          {/* Subtitle */}
          <div className="m-hero-sub" style={{ fontSize: "16px", color: "#555", marginBottom: "34px", lineHeight: "1.8", maxWidth: "500px" }}>
            Skip 100 hours of YouTube. Get a niche AI mentor, a real roadmap, and a community that&apos;s already done it.
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginBottom: "24px" }}>
            <Link
              to="/explore"
              style={{ display: "inline-block", background: "#d00000", color: "white", textDecoration: "none", padding: "16px 36px", borderRadius: "8px", fontSize: "15px", fontWeight: 900, whiteSpace: "nowrap", transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Get started free →
            </Link>
            <button
              onClick={scrollToHIW}
              style={{ background: "transparent", color: "#aaa", border: "1px solid #333", padding: "16px 36px", borderRadius: "8px", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap", transition: "border-color 0.2s, color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#555"; e.currentTarget.style.color = "white" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#aaa"  }}
            >
              See how it works ↓
            </button>
          </div>

          {/* Stacked avatars + member count */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex" }}>
              {STACKED_INITS.map((init, i) => (
                <div key={i} style={{
                  width: "30px", height: "30px", borderRadius: "50%",
                  background: "#1a0000", border: "2px solid #d00000",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "9px", fontWeight: 900, color: "#d00000",
                  marginLeft: i > 0 ? "-8px" : "0",
                  position: "relative", zIndex: 5 - i,
                }}>
                  {init}
                </div>
              ))}
            </div>
            <div style={{ fontSize: "13px", color: "#555" }}>
              <span style={{ color: "white", fontWeight: 800 }}>{memberCount.toLocaleString()}</span> people already on their path
            </div>
          </div>
        </div>
      </div>
      <NeonDivider />

      {/* ── Marquee / Pick your niche ── */}
      <div style={{ width: "100%", padding: "60px 0 72px" }}>
        <p className="m-marquee-label" style={{ fontSize: "11px", color: "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "28px", paddingLeft: "80px" }}>Pick your niche</p>
        <div style={{ overflow: "hidden", width: "100%", WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)", maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}>
          <div style={{ display: "flex", gap: "16px", width: "max-content", animation: "marquee 32s linear infinite" }}>
            {[...niches, ...niches].map((n, i) => (
              <div key={i} style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: "16px", padding: "26px 28px", width: "290px", flexShrink: 0, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "30px", marginBottom: "14px" }}>{n.icon}</div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "white", marginBottom: "10px" }}>{n.name}</div>
                <div style={{ fontSize: "12px", color: "#555", lineHeight: "1.7", marginBottom: "20px", flex: 1 }}>{n.desc}</div>
                <Link to="/explore" style={{ alignSelf: "flex-start", background: "#d00000", color: "white", textDecoration: "none", padding: "7px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: 700 }}>Enter →</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <NeonDivider />

      {/* ── How It Works ── */}
      <div id="how-it-works" ref={hiw} style={{ width: "100%", padding: "100px 0 0" }}>
        <div className="m-hiw-header" style={{ textAlign: "center", marginBottom: "80px", padding: "0 80px" }}>
          <div style={{ display: "inline-block", background: "#1a0000", color: "#d00000", border: "1px solid #3a0000", padding: "5px 14px", borderRadius: "99px", fontSize: "11px", fontWeight: 700, marginBottom: "24px", letterSpacing: "0.1em" }}>HOW IT WORKS</div>
          <div className="m-hiw-heading" style={{ fontSize: "48px", fontWeight: 900, lineHeight: "1.08", letterSpacing: "-2px" }}>
            <div style={{ color: "white" }}>Three steps.</div>
            <div style={{ color: "#d00000" }}>That&apos;s all it takes.</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>

          {/* Step 01 */}
          <div className="m-step" style={{ position: "relative", overflow: "hidden", padding: "64px 80px" }}>
            <Num n="01" />
            <CenterWord word="NICHE" size={180} />
            <div className="m-step-inner" style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", gap: "80px", maxWidth: "1200px", margin: "0 auto" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#d00000", letterSpacing: "0.15em", marginBottom: "18px" }}>STEP 01</div>
                <div className="m-step-title" style={{ fontSize: "52px", fontWeight: 900, lineHeight: "1.1", letterSpacing: "-3px", marginBottom: "20px" }}>
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
                        <span style={{ color: "white", fontSize: "12px", fontWeight: 900 }}>✓</span>
                      </div>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "4px" }}>{b.title}</div>
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
                      <div style={{ fontSize: "14px", fontWeight: 900, color: activeCard === i ? "white" : "#888" }}>{n.name}</div>
                      <div style={{ fontSize: "11px", color: "#444", marginTop: "4px" }}>{n.sub}</div>
                    </div>
                  ))}
                </div>
                <button style={{ width: "100%", background: "#d00000", color: "white", border: "none", padding: "14px", borderRadius: "10px", fontSize: "14px", fontWeight: 900, cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>
                  Enter {previewNiches[activeCard].name} →
                </button>
              </div>
            </div>
          </div>

          <NeonDivider />

          {/* Step 02 */}
          <div className="m-step" style={{ position: "relative", overflow: "hidden", padding: "56px 80px" }}>
            <Num n="02" />
            <CenterWord word="ROADMAP" size={160} />
            <div className="m-step-inner" style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", flexDirection: "row-reverse", gap: "80px", maxWidth: "1200px", margin: "0 auto" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#d00000", letterSpacing: "0.15em", marginBottom: "18px" }}>STEP 02</div>
                <div className="m-step-title" style={{ fontSize: "52px", fontWeight: 900, lineHeight: "1.1", letterSpacing: "-3px", marginBottom: "20px" }}>
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
                        <div style={{ fontSize: "14px", fontWeight: 700, color: on ? (node.glow ? "#d00000" : "white") : "#2a2a2a" }}>{node.label}</div>
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

          <NeonDivider />

          {/* Step 03 */}
          <div className="m-step" style={{ position: "relative", overflow: "hidden", padding: "56px 80px" }}>
            <Num n="03" />
            <CenterWord word="COMMUNITY" size={140} />
            <div className="m-step-inner" style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "80px", maxWidth: "1200px", margin: "0 auto" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#d00000", letterSpacing: "0.15em", marginBottom: "18px" }}>STEP 03</div>
                <div className="m-step-title" style={{ fontSize: "52px", fontWeight: 900, lineHeight: "1.1", letterSpacing: "-3px", marginBottom: "20px" }}>
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
                    <div key={i} style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#1a0000", border: "2px solid #d00000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 800, color: "#d00000", opacity: avatarCount > i ? 1 : 0, transform: avatarCount > i ? "scale(1)" : "scale(0.4)", transition: "all 0.3s ease" }}>
                      {a.init}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {activityCards.map((card, i) => (
                    <div key={i} style={{ background: "#0d0d0d", border: "1px solid #1f1f1f", borderRadius: "10px", padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: "12px", opacity: communityCardCount > i ? 1 : 0, transform: communityCardCount > i ? "translateY(0)" : "translateY(14px)", transition: "all 0.45s ease" }}>
                      <div style={{ width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0, background: "#1a0000", border: "2px solid #d00000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, color: "#d00000" }}>{card.init}</div>
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "white", marginBottom: "4px" }}>{card.name}</div>
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

      <NeonDivider />
      <Footer />
      <MessageBubble />
    </div>
  )
}
