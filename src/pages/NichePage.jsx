import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import MessageBubble from "../components/MessageBubble"
import PaywallModal from "../components/PaywallModal"
import { supabase } from "../supabaseClient"

/* ── Static niche data ─────────────────────────────────── */
const nicheData = {
  Trading: {
    icon: "📈", gradient: "linear-gradient(135deg,#1a0000,#0d0d0d)", members: 2341,
    steps: [
      "Learn basic market concepts and terminology",
      "Understand different asset classes (stocks, forex, crypto)",
      "Set up your brokerage account",
      "Practice paper trading for 30 days",
      "Learn technical analysis fundamentals",
      "Master risk management — the 2% rule",
      "Develop your personal trading strategy",
      "Start trading with real money (small size)",
      "Track and review your performance weekly",
      "Scale your capital and refine your edge",
    ],
  },
  Dropshipping: {
    icon: "📦", gradient: "linear-gradient(135deg,#001a0a,#0d0d0d)", members: 1892,
    steps: [
      "Choose your product niche and target market",
      "Research winning products with strong margins",
      "Set up your Shopify store",
      "Find reliable suppliers (AliExpress or US-based)",
      "Create compelling product listings and copy",
      "Set up payment processing and shipping",
      "Launch your first paid ad campaign",
      "Analyse ad performance and optimise",
      "Handle customer service professionally",
      "Scale winning products and cut losers",
    ],
  },
  Freelancing: {
    icon: "💻", gradient: "linear-gradient(135deg,#0a001a,#0d0d0d)", members: 1654,
    steps: [
      "Define your core skill and service offering",
      "Build a portfolio with 3–5 strong samples",
      "Create profiles on Upwork, Fiverr, and LinkedIn",
      "Set your pricing structure (hourly vs project)",
      "Send your first 20 proposals",
      "Land and deliver your first paid project",
      "Get your first 5-star review",
      "Raise your rates after 5 clients",
      "Build a pipeline of recurring clients",
      "Scale with systems and subcontractors",
    ],
  },
  "Content Creation": {
    icon: "🎬", gradient: "linear-gradient(135deg,#1a0a00,#0d0d0d)", members: 1203,
    steps: [
      "Choose your content niche and target audience",
      "Pick your primary platform (YouTube, TikTok, Instagram)",
      "Set up your equipment and filming space",
      "Create and publish your first 10 pieces",
      "Study your analytics — what's working?",
      "Commit to a consistent posting schedule",
      "Engage with your community every day",
      "Apply for monetisation (YPP, etc.)",
      "Land your first brand deal or sponsorship",
      "Expand to secondary platforms and products",
    ],
  },
  "Affiliate Marketing": {
    icon: "💰", gradient: "linear-gradient(135deg,#001a1a,#0d0d0d)", members: 987,
    steps: [
      "Choose your affiliate niche and audience",
      "Find affiliate programs (Amazon, ClickBank, ShareASale)",
      "Create your content platform (blog, YouTube, or social)",
      "Produce 20 pieces of valuable content with links",
      "Drive traffic via SEO or social media",
      "Install tracking to measure clicks and conversions",
      "Optimise your top-performing content",
      "Build an email list for repeat traffic",
      "Negotiate higher commission rates",
      "Scale your best traffic source aggressively",
    ],
  },
  "AI Tools": {
    icon: "🤖", gradient: "linear-gradient(135deg,#1a001a,#0d0d0d)", members: 743,
    steps: [
      "Master ChatGPT and basic prompt engineering",
      "Learn the key AI tool categories (image, code, video)",
      "Build your first AI-powered workflow",
      "Create and sell content using AI tools",
      "Automate a repetitive task in your business",
      "Package your prompts or workflows as a product",
      "Build and sell an AI-powered tool or SaaS",
      "Offer AI automation as a service to businesses",
      "Stay updated with new model and tool releases",
      "Scale your AI income to replace your main income",
    ],
  },
}

const FREE_LIMIT = 5

export default function NichePage() {
  const { nicheName }  = useParams()
  const niche          = decodeURIComponent(nicheName)
  const data           = nicheData[niche]
  const navigate       = useNavigate()

  /* Auth */
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)

  /* Roadmap */
  const [completed, setCompleted] = useState({})   // { stepIndex: bool }
  const [stepsReady, setStepsReady] = useState(false)

  /* Chat */
  const [messages,     setMessages]     = useState([])
  const [input,        setInput]        = useState("")
  const [sending,      setSending]      = useState(false)
  const [todayCount,   setTodayCount]   = useState(0)
  const [showPaywall,  setShowPaywall]  = useState(false)
  const chatEndRef = useRef(null)

  /* Community */
  const [posts,       setPosts]       = useState([])
  const [postContent, setPostContent] = useState("")
  const [posting,     setPosting]     = useState(false)

  /* Mount fade */
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!data) { navigate("/explore"); return }
    setTimeout(() => setVisible(true), 40)

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        await Promise.all([fetchProgress(u.id), fetchTodayCount(u.id), fetchProfile(u.id)])
      }
      setStepsReady(true)
    })

    fetchPosts()
  }, [niche])  // eslint-disable-line

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  /* ── Supabase helpers ── */
  const fetchProfile = async (uid) => {
    const { data: p } = await supabase.from("profiles").select("first_name, plan").eq("id", uid).single()
    setProfile(p)
  }

  const fetchProgress = async (uid) => {
    const { data: rows } = await supabase
      .from("roadmap_progress")
      .select("step_index, completed")
      .eq("user_id", uid)
      .eq("niche", niche)
    if (rows) {
      const map = {}
      rows.forEach(r => { map[r.step_index] = r.completed })
      setCompleted(map)
    }
  }

  const fetchTodayCount = async (uid) => {
    const today = new Date().toISOString().slice(0, 10)
    const { data: row } = await supabase
      .from("message_counts")
      .select("count")
      .eq("user_id", uid)
      .eq("date", today)
      .single()
    setTodayCount(row?.count ?? 0)
  }

  const fetchPosts = async () => {
    const { data: rows } = await supabase
      .from("community_posts")
      .select("id, author_name, content, created_at")
      .eq("niche", niche)
      .order("created_at", { ascending: false })
      .limit(20)
    setPosts(rows ?? [])
  }

  const toggleStep = async (idx) => {
    if (!user) { navigate("/login"); return }
    const next = !completed[idx]
    setCompleted(prev => ({ ...prev, [idx]: next }))
    await supabase.from("roadmap_progress").upsert(
      { user_id: user.id, niche, step_index: idx, completed: next, updated_at: new Date().toISOString() },
      { onConflict: "user_id,niche,step_index" }
    )
  }

  const incrementCount = async () => {
    if (!user) return
    const today = new Date().toISOString().slice(0, 10)
    const next  = todayCount + 1
    setTodayCount(next)
    await supabase.from("message_counts").upsert(
      { user_id: user.id, date: today, count: next },
      { onConflict: "user_id,date" }
    )
  }

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || sending) return

    if (!user) { navigate("/login"); return }

    const isFree   = !profile || profile.plan === "free"
    const atLimit  = isFree && todayCount >= FREE_LIMIT
    if (atLimit) { setShowPaywall(true); return }

    const userMsg  = { role: "user", content: text }
    const history  = [...messages, userMsg]
    setMessages(history)
    setInput("")
    setSending(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, niche }),
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setMessages(prev => [...prev, { role: "assistant", content: json.content }])
      await incrementCount()
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ " + (err.message ?? "Something went wrong. Try again.") }])
    } finally {
      setSending(false)
    }
  }

  const submitPost = async () => {
    if (!user || !postContent.trim()) return
    setPosting(true)
    const authorName = [
      user.user_metadata?.first_name,
      user.user_metadata?.last_name,
    ].filter(Boolean).join(" ") || "Anonymous"

    const { data: newPost } = await supabase.from("community_posts").insert({
      user_id: user.id,
      niche,
      content: postContent.trim(),
      author_name: authorName,
    }).select().single()

    if (newPost) setPosts(prev => [newPost, ...prev])
    setPostContent("")
    setPosting(false)
  }

  if (!data) return null

  const totalSteps     = data.steps.length
  const completedCount = Object.values(completed).filter(Boolean).length
  const pct            = stepsReady ? Math.round((completedCount / totalSteps) * 100) : 0
  const isFree         = !profile || profile.plan === "free"
  const remaining      = Math.max(0, FREE_LIMIT - todayCount)

  return (
    <div className="page-enter dot-bg" style={{
      minHeight: "100vh", width: "100vw", maxWidth: "100%",
      fontFamily: "'Inter', sans-serif", color: "white", overflowX: "hidden",
      opacity: visible ? 1 : 0, transition: "opacity 0.3s ease",
    }}>
      <Navbar />

      {/* ── Hero ── */}
      <div style={{
        background: data.gradient,
        padding: "56px 80px 40px",
        borderBottom: "1px solid #1f1f1f",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
          <span style={{ fontSize: "52px" }}>{data.icon}</span>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#1a0000", border: "1px solid #3a0000", padding: "3px 10px", borderRadius: "99px" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#d00000", animation: "pulse-dot 1.6s ease-in-out infinite", display: "inline-block" }} />
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#d00000", letterSpacing: "0.08em" }}>AI MENTOR LIVE</span>
              </div>
            </div>
            <h1 style={{ fontSize: "44px", fontWeight: 900, letterSpacing: "-2px", color: "white", lineHeight: 1.05 }}>{niche}</h1>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
          {[
            { label: "Members",       value: data.members.toLocaleString() },
            { label: "Roadmap steps", value: totalSteps },
            { label: "Your progress", value: `${pct}%`  },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: "22px", fontWeight: 900, color: "white" }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "#555", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: "28px", background: "#1a1a1a", borderRadius: "99px", height: "6px", overflow: "hidden" }}>
          <div style={{
            height: "100%", background: "#d00000", borderRadius: "99px",
            width: `${pct}%`, transition: "width 0.8s ease",
          }} />
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ display: "flex", gap: 0, maxWidth: "100%", minHeight: "calc(100vh - 300px)" }}>

        {/* Left — Roadmap + Community */}
        <div style={{ flex: "0 0 44%", borderRight: "1px solid #1f1f1f", padding: "40px 48px", overflowY: "auto" }}>

          {/* Roadmap */}
          <div style={{ marginBottom: "56px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: "24px" }}>Your Roadmap</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {data.steps.map((step, i) => {
                const done = !!completed[i]
                const locked = isFree && i >= 3
                return (
                  <div key={i}
                    onClick={() => !locked && toggleStep(i)}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: "14px",
                      background: done ? "#0d0d0d" : "#111",
                      border: `1px solid ${done ? "#d00000" : "#1f1f1f"}`,
                      borderRadius: "12px", padding: "14px 16px",
                      cursor: locked ? "not-allowed" : "pointer",
                      opacity: locked ? 0.45 : 1,
                      transition: "all 0.2s ease",
                    }}>
                    <div style={{
                      width: "22px", height: "22px", borderRadius: "6px", flexShrink: 0,
                      background: done ? "#d00000" : "#1a1a1a",
                      border: `1.5px solid ${done ? "#d00000" : "#2a2a2a"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s ease",
                    }}>
                      {done && <span style={{ color: "white", fontSize: "11px", fontWeight: 900 }}>✓</span>}
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "#444", fontWeight: 700, marginBottom: "2px" }}>
                        STEP {String(i + 1).padStart(2, "0")} {locked ? "🔒" : ""}
                      </div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: done ? "#d00000" : "#bbb", textDecoration: done ? "line-through" : "none", lineHeight: "1.5" }}>
                        {step}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {isFree && (
              <div style={{ marginTop: "16px", background: "#1a0000", border: "1px solid #3a0000", borderRadius: "12px", padding: "14px 16px", fontSize: "13px", color: "#d00000" }}>
                🔒 Steps 4–10 are locked on the free plan.{" "}
                <Link to="/pricing" style={{ color: "#d00000", fontWeight: 700 }}>Upgrade to Pro →</Link>
              </div>
            )}
          </div>

          {/* Community */}
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: "20px" }}>Community</h2>
            {user && (
              <div style={{ marginBottom: "20px" }}>
                <textarea
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  placeholder={`Share a win, ask a question, or help someone in the ${niche} community…`}
                  rows={3}
                  style={{
                    width: "100%", background: "#111", border: "1px solid #1f1f1f",
                    color: "white", padding: "14px 16px", borderRadius: "10px",
                    fontSize: "13px", outline: "none", resize: "none",
                    fontFamily: "'Inter', sans-serif", boxSizing: "border-box",
                  }}
                  onFocus={e => e.target.style.borderColor = "#d00000"}
                  onBlur={e  => e.target.style.borderColor = "#1f1f1f"}
                />
                <button
                  onClick={submitPost}
                  disabled={!postContent.trim() || posting}
                  style={{
                    marginTop: "8px", background: "#d00000", color: "white", border: "none",
                    padding: "10px 22px", borderRadius: "8px", fontSize: "13px",
                    fontWeight: 800, cursor: "pointer", fontFamily: "'Inter', sans-serif",
                    opacity: !postContent.trim() || posting ? 0.5 : 1,
                  }}>
                  {posting ? "Posting…" : "Post →"}
                </button>
              </div>
            )}
            {!user && (
              <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: "12px", padding: "16px", marginBottom: "20px", fontSize: "13px", color: "#555" }}>
                <Link to="/login" style={{ color: "#d00000", fontWeight: 700 }}>Sign in</Link> to post in the community.
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {posts.length === 0 && (
                <p style={{ fontSize: "13px", color: "#333" }}>No posts yet. Be the first to share.</p>
              )}
              {posts.map(post => (
                <div key={post.id} style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: "12px", padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#1a0000", border: "1.5px solid #d00000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 800, color: "#d00000", flexShrink: 0 }}>
                      {(post.author_name || "?").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "white" }}>{post.author_name}</div>
                      <div style={{ fontSize: "10px", color: "#333" }}>{new Date(post.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: "13px", color: "#666", lineHeight: "1.6", margin: 0 }}>{post.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — AI Chat */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "calc(100vh - 66px)" }}>

          {/* Chat header */}
          <div style={{ padding: "24px 32px", borderBottom: "1px solid #1f1f1f", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 900, color: "white", letterSpacing: "-0.5px" }}>
                {data.icon} {niche} Mentor
              </div>
              <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>Ask anything about {niche.toLowerCase()}</div>
            </div>
            {isFree && (
              <div style={{ background: "#1a0000", border: "1px solid #3a0000", borderRadius: "8px", padding: "6px 12px", textAlign: "center" }}>
                <div style={{ fontSize: "16px", fontWeight: 900, color: "#d00000" }}>{remaining}/5</div>
                <div style={{ fontSize: "9px", color: "#555", letterSpacing: "0.05em" }}>FREE TODAY</div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {messages.length === 0 && (
              <div style={{ textAlign: "center", marginTop: "60px" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>{data.icon}</div>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "white", marginBottom: "8px" }}>Your {niche} mentor is ready.</p>
                <p style={{ fontSize: "13px", color: "#444", lineHeight: "1.7" }}>
                  Ask about your roadmap, strategy, tools, mindset — anything about {niche.toLowerCase()}.
                </p>
                {/* Starter prompts */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginTop: "20px" }}>
                  {["Where do I start?", "What's the biggest mistake beginners make?", "How long until I see results?"].map(q => (
                    <button key={q} onClick={() => setInput(q)} style={{
                      background: "#111", border: "1px solid #1f1f1f", color: "#666",
                      padding: "7px 14px", borderRadius: "99px", fontSize: "12px",
                      fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif",
                    }}>{q}</button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", gap: "10px", alignItems: "flex-start" }}>
                <div style={{
                  maxWidth: "75%",
                  background: m.role === "user" ? "#d00000" : "#111",
                  border: m.role === "user" ? "none" : "1px solid #1f1f1f",
                  color: "white",
                  padding: "12px 16px",
                  borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  fontSize: "14px",
                  lineHeight: "1.7",
                  whiteSpace: "pre-wrap",
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {sending && (
              <div style={{ display: "flex", gap: "6px", alignItems: "center", padding: "12px 16px", background: "#111", border: "1px solid #1f1f1f", borderRadius: "16px 16px 16px 4px", width: "fit-content" }}>
                {[0, 1, 2].map(d => (
                  <div key={d} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#d00000", animation: `blink 1.2s ease ${d * 0.2}s infinite` }} />
                ))}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          {!user ? (
            <div style={{ padding: "16px 32px", borderTop: "1px solid #1f1f1f", textAlign: "center" }}>
              <Link to="/login" style={{ color: "#d00000", fontWeight: 700, fontSize: "14px" }}>Sign in to chat with your AI mentor →</Link>
            </div>
          ) : (
            <div style={{ padding: "16px 32px", borderTop: "1px solid #1f1f1f", display: "flex", gap: "10px" }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder={isFree && todayCount >= FREE_LIMIT ? "Daily limit reached — upgrade for unlimited" : `Ask your ${niche} mentor…`}
                disabled={isFree && todayCount >= FREE_LIMIT}
                style={{
                  flex: 1, background: "#111", border: "1px solid #1f1f1f",
                  color: "white", padding: "12px 16px", borderRadius: "10px",
                  fontSize: "14px", outline: "none", fontFamily: "'Inter', sans-serif",
                  opacity: isFree && todayCount >= FREE_LIMIT ? 0.5 : 1,
                }}
                onFocus={e => e.target.style.borderColor = "#d00000"}
                onBlur={e  => e.target.style.borderColor = "#1f1f1f"}
              />
              <button
                onClick={sendMessage}
                disabled={sending || !input.trim() || (isFree && todayCount >= FREE_LIMIT)}
                style={{
                  background: "#d00000", color: "white", border: "none",
                  padding: "12px 22px", borderRadius: "10px", fontSize: "14px",
                  fontWeight: 900, cursor: "pointer", fontFamily: "'Inter', sans-serif",
                  opacity: sending || !input.trim() || (isFree && todayCount >= FREE_LIMIT) ? 0.5 : 1,
                }}>
                →
              </button>
            </div>
          )}
        </div>
      </div>

      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
      <Footer />
      <MessageBubble />
    </div>
  )
}
