import { useState, useEffect, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import MessageBubble from "../components/MessageBubble"
import { supabase } from "../supabaseClient"

const FREE_LIMIT = 5

const DOT_BG = `#0d0d0d url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23d00000' fill-opacity='0.12'/%3E%3C/svg%3E") repeat`

const MENTORS = [
  { id: "General",             name: "General Support",     icon: "💬", color: "#0088ff", isGeneral: true },
  { id: "Trading",             name: "Trading",             icon: "📈", color: "#d00000" },
  { id: "Dropshipping",        name: "Dropshipping",        icon: "📦", color: "#00aa55" },
  { id: "Freelancing",         name: "Freelancing",         icon: "💻", color: "#8855ff" },
  { id: "Content Creation",    name: "Content Creation",    icon: "🎬", color: "#ff8800" },
  { id: "Affiliate Marketing", name: "Affiliate Marketing", icon: "💰", color: "#00aaaa" },
  { id: "AI Tools",            name: "AI Tools",            icon: "🤖", color: "#aa55ff" },
]

export default function MentorPage() {
  const navigate  = useNavigate()
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  const [user,             setUser]             = useState(null)
  const [profile,          setProfile]          = useState(null)
  const [isPro,            setIsPro]            = useState(false)
  const [freeMentors,      setFreeMentors]      = useState(["Trading", "Freelancing"])
  const [selected,         setSelected]         = useState(MENTORS[0])
  const [messages,         setMessages]         = useState([])
  const [input,            setInput]            = useState("")
  const [loading,          setLoading]          = useState(false)
  const [todayCount,       setTodayCount]       = useState(0)
  const [showPaywall,      setShowPaywall]      = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  /* ── Auth guard ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/login"); return }
      setUser(session.user)
      fetchProfileAndSetup(session.user.id)
      fetchMessageCount(session.user.id)
    })
  }, [])

  /* Reset messages when switching mentor */
  useEffect(() => {
    setMessages([{
      role: "assistant",
      content: selected.isGeneral
        ? "Hey! I'm your General Support assistant for Vaulte. Ask me anything about the platform, how to navigate it, what mentors do, or how to get started. What can I help you with?"
        : `Hey! I'm your ${selected.name} mentor on Vaulte. I'm here to give you real, actionable guidance. What do you want to work on today?`,
    }])
  }, [selected.id])

  /* Scroll to bottom on new messages */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const fetchProfileAndSetup = async (uid) => {
    const { data } = await supabase.from("profiles").select("first_name, plan, onboarding_answers").eq("id", uid).single()
    setProfile(data)
    const pro = data?.plan === "pro" || data?.plan === "team"
    setIsPro(pro)
    if (!pro) {
      const picked = data?.onboarding_answers?.mentors
      setFreeMentors(Array.isArray(picked) && picked.length > 0 ? picked : ["Trading", "Freelancing"])
    }
  }

  const fetchMessageCount = async (uid) => {
    const today = new Date().toISOString().split("T")[0]
    const { data } = await supabase.from("message_counts").select("count").eq("user_id", uid).eq("date", today).single()
    setTodayCount(data?.count || 0)
  }

  const updateMessageCount = async (uid) => {
    const today = new Date().toISOString().split("T")[0]
    const { data: existing } = await supabase.from("message_counts").select("id, count").eq("user_id", uid).eq("date", today).single()
    if (existing) {
      await supabase.from("message_counts").update({ count: existing.count + 1 }).eq("id", existing.id)
      setTodayCount(existing.count + 1)
    } else {
      await supabase.from("message_counts").insert({ user_id: uid, date: today, count: 1 })
      setTodayCount(1)
    }
  }

  const saveChatMessage = async (uid, role, content) => {
    try {
      await supabase.from("chat_messages").insert({ user_id: uid, niche: selected.id, role, content })
    } catch (_) { /* non-critical */ }
  }

  const isLocked = (m) => !isPro && !m.isGeneral && !freeMentors.includes(m.id)

  const handleSelectMentor = (m) => {
    if (isLocked(m)) { setShowUpgradeModal(true); return }
    setSelected(m)
  }

  const sendMessage = async () => {
    if (!input.trim() || loading || !user) return
    if (!isPro && !selected.isGeneral && todayCount >= FREE_LIMIT) { setShowPaywall(true); return }

    const userMsg = { role: "user", content: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)
    await saveChatMessage(user.id, "user", userMsg.content)

    try {
      const history = [...messages.slice(1), userMsg].map(m => ({ role: m.role, content: m.content }))
      const res  = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, niche: selected.id }),
      })
      const json = await res.json()
      const aiMsg = { role: "assistant", content: json.content || "Sorry, I couldn't generate a response." }
      setMessages(prev => [...prev, aiMsg])
      await saveChatMessage(user.id, "assistant", aiMsg.content)
      if (!selected.isGeneral) updateMessageCount(user.id)
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }])
    }
    setLoading(false)
    inputRef.current?.focus()
  }

  const accentColor = selected.color

  return (
    <div className="page-enter dot-bg" style={{
      minHeight: "100vh",
      width: "100vw",
      maxWidth: "100%",
      fontFamily: "'Inter', sans-serif",
      color: "white",
      overflowX: "hidden",
    }}>
      <Navbar />

      <div style={{ display: "flex", height: "calc(100vh - 67px)" }}>

        {/* ── Left sidebar ── */}
        <aside style={{
          width: "260px",
          flexShrink: 0,
          background: "#111",
          borderRight: "1px solid #1a1a1a",
          padding: "24px 12px",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}>
          {/* OUR MENTORS header */}
          <div style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "#333",
            letterSpacing: "0.12em",
            marginBottom: "14px",
            padding: "0 8px",
          }}>
            OUR MENTORS
          </div>

          {/* General Support */}
          <button
            onClick={() => handleSelectMentor(MENTORS[0])}
            className="general-support-card"
            style={{
              width: "100%",
              background: selected.id === "General" ? "#001a33" : "#0d0d0d",
              border: `1px solid ${selected.id === "General" ? "#004499" : "#0088ff33"}`,
              borderRadius: "10px",
              padding: "12px",
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "4px",
              transition: "background 0.2s, border-color 0.2s",
            }}
          >
            <span style={{ fontSize: "20px", flexShrink: 0 }}>💬</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#0088ff" }}>General Support</div>
              <div style={{ fontSize: "10px", color: "#005599", marginTop: "2px" }}>Always free · Unlimited</div>
            </div>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0088ff", flexShrink: 0, opacity: 0.8 }} />
          </button>

          {/* Divider + NICHE MENTORS label */}
          <div style={{ position: "relative", margin: "16px 0 12px" }}>
            <div style={{ height: "1px", background: "#1a1a1a" }} />
            <span style={{
              position: "absolute",
              top: "50%",
              left: "8px",
              transform: "translateY(-50%)",
              background: "#111",
              fontSize: "9px",
              fontWeight: 700,
              color: "#333",
              letterSpacing: "0.12em",
              padding: "0 6px",
            }}>
              NICHE MENTORS
            </span>
          </div>

          {/* Niche mentor buttons */}
          {MENTORS.slice(1).map(m => {
            const sel    = selected.id === m.id
            const locked = isLocked(m)
            return (
              <button
                key={m.id}
                onClick={() => handleSelectMentor(m)}
                style={{
                  width: "100%",
                  background: sel ? "#1a0000" : "transparent",
                  border: `1px solid ${sel ? "#3a0000" : "transparent"}`,
                  borderRadius: "10px",
                  padding: "11px 12px",
                  cursor: locked ? "not-allowed" : "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "2px",
                  transition: "background 0.2s, border-color 0.2s",
                  opacity: locked ? 0.45 : 1,
                  filter: locked ? "blur(0.3px) grayscale(0.3)" : "none",
                }}
                onMouseEnter={e => { if (!sel && !locked) e.currentTarget.style.background = "#1a1a1a" }}
                onMouseLeave={e => { if (!sel && !locked) e.currentTarget.style.background = "transparent" }}
              >
                <span style={{ fontSize: "18px", flexShrink: 0 }}>{m.icon}</span>
                <span style={{ fontSize: "13px", fontWeight: sel ? 700 : 500, color: sel ? m.color : "#888", flex: 1 }}>
                  {m.name}
                </span>
                {locked ? (
                  <span style={{ fontSize: "12px", flexShrink: 0 }}>🔒</span>
                ) : (
                  <div style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#d00000",
                    flexShrink: 0,
                    animation: "pulse-dot 2s ease-in-out infinite",
                  }} />
                )}
              </button>
            )
          })}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Message count + upgrade */}
          <div style={{
            padding: "16px",
            background: "#0d0d0d",
            border: "1px solid #1a1a1a",
            borderRadius: "12px",
            marginTop: "16px",
          }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#333", letterSpacing: "0.1em", marginBottom: "10px" }}>
              TODAY'S MESSAGES
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <div style={{ flex: 1, height: "4px", background: "#1a1a1a", borderRadius: "99px", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${Math.min((todayCount / FREE_LIMIT) * 100, 100)}%`,
                  background: todayCount >= FREE_LIMIT ? "#d00000" : "#0088ff",
                  borderRadius: "99px",
                  transition: "width 0.4s ease",
                }} />
              </div>
              <span style={{ fontSize: "11px", color: "#555", fontWeight: 600, whiteSpace: "nowrap" }}>
                {todayCount}/{isPro ? "∞" : FREE_LIMIT}
              </span>
            </div>
            {!isPro && (
              <Link
                to="/pricing"
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "#1a0000",
                  border: "1px solid #3a0000",
                  color: "#d00000",
                  textDecoration: "none",
                  padding: "8px",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontWeight: 800,
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#2a0000"}
                onMouseLeave={e => e.currentTarget.style.background = "#1a0000"}
              >
                Upgrade for unlimited →
              </Link>
            )}
          </div>
        </aside>

        {/* ── Main chat area ── */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Chat header */}
          <div style={{
            padding: "20px 32px",
            borderBottom: "1px solid #1a1a1a",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            background: "#0d0d0d",
            flexShrink: 0,
          }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: `${accentColor}22`,
              border: `1.5px solid ${accentColor}55`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
            }}>
              {selected.icon}
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "white" }}>{selected.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00cc66" }} />
                <span style={{ fontSize: "11px", color: "#555" }}>Online — ready to help</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}>
            {messages.map((msg, i) => {
              const isUser = msg.role === "user"
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: isUser ? "flex-end" : "flex-start",
                    gap: "12px",
                    alignItems: "flex-end",
                  }}
                >
                  {!isUser && (
                    <div style={{
                      width: "32px",
                      height: "32px",
                      flexShrink: 0,
                      borderRadius: "50%",
                      background: `${accentColor}22`,
                      border: `1px solid ${accentColor}44`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                    }}>
                      {selected.icon}
                    </div>
                  )}
                  <div style={{
                    maxWidth: "70%",
                    background: isUser ? "#d00000" : "#111",
                    border: isUser ? "none" : "1px solid #1f1f1f",
                    borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    padding: "14px 18px",
                    fontSize: "14px",
                    color: isUser ? "white" : "#ccc",
                    lineHeight: "1.7",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}>
                    {msg.content}
                  </div>
                </div>
              )
            })}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
                <div style={{
                  width: "32px",
                  height: "32px",
                  flexShrink: 0,
                  borderRadius: "50%",
                  background: `${accentColor}22`,
                  border: `1px solid ${accentColor}44`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                }}>
                  {selected.icon}
                </div>
                <div style={{
                  background: "#111",
                  border: "1px solid #1f1f1f",
                  borderRadius: "18px 18px 18px 4px",
                  padding: "14px 20px",
                  display: "flex",
                  gap: "5px",
                  alignItems: "center",
                }}>
                  {[0, 1, 2].map(d => (
                    <div key={d} style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#555",
                      animation: `pulse-dot 1.2s ease-in-out ${d * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Note */}
          <div style={{
            textAlign: "center",
            fontSize: "11px",
            color: "#2a2a2a",
            padding: "0 32px 8px",
            flexShrink: 0,
          }}>
            General support answers platform questions. Switch to a niche mentor for focused expertise.
          </div>

          {/* Input */}
          <div style={{
            padding: "16px 32px 24px",
            borderTop: "1px solid #1a1a1a",
            background: "#0d0d0d",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                placeholder={`Message ${selected.name}…`}
                rows={1}
                style={{
                  flex: 1,
                  background: "#111",
                  border: "1px solid #1f1f1f",
                  color: "white",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  outline: "none",
                  fontFamily: "'Inter', sans-serif",
                  resize: "none",
                  lineHeight: "1.6",
                  maxHeight: "120px",
                  overflowY: "auto",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = accentColor + "66"}
                onBlur={e => e.target.style.borderColor = "#1f1f1f"}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                style={{
                  background: !input.trim() || loading ? "#1a1a1a" : accentColor,
                  color: !input.trim() || loading ? "#444" : "white",
                  border: "none",
                  padding: "14px 24px",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: 800,
                  cursor: !input.trim() || loading ? "not-allowed" : "pointer",
                  fontFamily: "'Inter', sans-serif",
                  flexShrink: 0,
                  transition: "background 0.2s, color 0.2s, opacity 0.2s",
                }}
                onMouseEnter={e => { if (input.trim() && !loading) e.currentTarget.style.opacity = "0.85" }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1" }}
              >
                Send →
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Daily limit paywall */}
      {showPaywall && (
        <div
          onClick={() => setShowPaywall(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: "#111", border: "1px solid #1f1f1f", borderTop: "3px solid #d00000", borderRadius: "20px", padding: "40px", maxWidth: "400px", width: "100%", textAlign: "center", animation: "modal-in 0.25s ease" }}
          >
            <div style={{ fontSize: "36px", marginBottom: "16px" }}>🔒</div>
            <h2 style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "-1px", color: "white", marginBottom: "8px" }}>Daily limit reached</h2>
            <p style={{ fontSize: "14px", color: "#555", marginBottom: "28px", lineHeight: "1.7" }}>You've used your {FREE_LIMIT} free niche messages today. Upgrade to Pro for unlimited access.</p>
            <Link to="/pricing" style={{ display: "block", background: "#d00000", color: "white", textDecoration: "none", padding: "14px", borderRadius: "10px", fontSize: "14px", fontWeight: 900, marginBottom: "12px", transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >Upgrade to Pro →</Link>
            <button onClick={() => setShowPaywall(false)} style={{ background: "transparent", border: "none", color: "#444", fontSize: "13px", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>Maybe later</button>
          </div>
        </div>
      )}

      {/* Locked mentor upgrade modal */}
      {showUpgradeModal && (
        <div
          onClick={() => setShowUpgradeModal(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: "#111", border: "1px solid #1f1f1f", borderTop: "3px solid #d00000", borderRadius: "20px", padding: "40px", maxWidth: "400px", width: "100%", textAlign: "center", animation: "modal-in 0.25s ease" }}
          >
            <div style={{ fontSize: "36px", marginBottom: "16px" }}>🔒</div>
            <h2 style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "-1px", color: "white", marginBottom: "8px" }}>Unlock all 6 mentors</h2>
            <p style={{ fontSize: "14px", color: "#555", marginBottom: "28px", lineHeight: "1.7" }}>Upgrade to Pro to access all 6 niche mentors with unlimited messages and full roadmap access.</p>
            <Link to="/pricing" style={{ display: "block", background: "#d00000", color: "white", textDecoration: "none", padding: "14px", borderRadius: "10px", fontSize: "14px", fontWeight: 900, marginBottom: "12px", transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >Upgrade to Pro →</Link>
            <button onClick={() => setShowUpgradeModal(false)} style={{ background: "transparent", border: "none", color: "#444", fontSize: "13px", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>Maybe later</button>
          </div>
        </div>
      )}

      <Footer />
      <MessageBubble />
    </div>
  )
}
