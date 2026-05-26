import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
import MessageBubble from "../components/MessageBubble"
import { supabase } from "../supabaseClient"

const NICHES = [
  { id: "Trading",           icon: "📈", label: "Trading"           },
  { id: "Dropshipping",      icon: "📦", label: "Dropshipping"      },
  { id: "Freelancing",       icon: "💻", label: "Freelancing"       },
  { id: "Content Creation",  icon: "🎬", label: "Content Creation"  },
  { id: "Affiliate Marketing", icon: "💰", label: "Affiliate"       },
  { id: "AI Tools",          icon: "🤖", label: "AI Tools"          },
]

const QUESTIONS = [
  {
    id: "niche",
    q: "Which niche interests you most?",
    sub: "Pick the path you want to go deep on. You can always explore others later.",
    type: "niche",
  },
  {
    id: "experience",
    q: "What's your experience level?",
    sub: "Be honest — we'll match the roadmap to where you're at.",
    type: "options",
    options: [
      { id: "beginner",     label: "Complete beginner",  icon: "🌱", desc: "I'm just getting started." },
      { id: "some",         label: "Some experience",     icon: "📚", desc: "I know the basics." },
      { id: "intermediate", label: "Intermediate",        icon: "⚡", desc: "I've made some progress." },
      { id: "advanced",     label: "Advanced",            icon: "🔥", desc: "I'm ready to scale." },
    ],
  },
  {
    id: "challenge",
    q: "What's your biggest challenge right now?",
    sub: "We'll focus your AI mentor on solving this first.",
    type: "options",
    options: [
      { id: "info",        label: "Finding information",       icon: "🔍", desc: "Too much noise, not enough signal." },
      { id: "consistency", label: "Staying consistent",        icon: "🔄", desc: "I start but don't follow through." },
      { id: "start",       label: "Not knowing where to start", icon: "🗺️", desc: "I feel overwhelmed by options." },
      { id: "time",        label: "Managing my time",          icon: "⏰", desc: "I struggle to find time for this." },
    ],
  },
  {
    id: "mentors",
    q: "Pick your 2 free mentors.",
    sub: "Upgrade later to access all 6. Choose wisely.",
    type: "mentors",
  },
  {
    id: "goal",
    q: "What's your main goal in 90 days?",
    sub: "Set the target. Your roadmap will be built around this.",
    type: "options",
    options: [
      { id: "first_dollar", label: "Make my first dollar online", icon: "💵", desc: "Prove this is real." },
      { id: "replace_job",  label: "Replace my job income",       icon: "🏢", desc: "Build full financial freedom." },
      { id: "side_income",  label: "Build a side income",         icon: "📈", desc: "Stack extra income alongside work." },
      { id: "scale",        label: "Scale what I already have",   icon: "🚀", desc: "I'm already making money — go bigger." },
    ],
  },
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [step,      setStep]      = useState(0)
  const [answers,   setAnswers]   = useState({})
  const [user,      setUser]      = useState(null)
  const [saving,    setSaving]    = useState(false)
  const [checking,  setChecking]  = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { navigate("/login"); return }
      setUser(session.user)
      // If onboarding already done, skip to home
      const { data } = await supabase
        .from("profiles")
        .select("onboarding_complete")
        .eq("id", session.user.id)
        .single()
      if (data?.onboarding_complete) { navigate("/"); return }
      setChecking(false)
    })
  }, [])

  const current = QUESTIONS[step]
  const total   = QUESTIONS.length

  const selectOption = (qId, value) => {
    if (qId === "mentors") {
      const prev = answers.mentors || []
      if (prev.includes(value)) {
        setAnswers(a => ({ ...a, mentors: prev.filter(v => v !== value) }))
      } else if (prev.length < 2) {
        setAnswers(a => ({ ...a, mentors: [...prev, value] }))
      }
    } else {
      setAnswers(a => ({ ...a, [qId]: value }))
    }
  }

  const canNext = () => {
    if (current.type === "niche")   return !!answers.niche
    if (current.type === "mentors") return (answers.mentors || []).length === 2
    return !!answers[current.id]
  }

  const handleNext = () => {
    if (step < total - 1) {
      setStep(s => s + 1)
    } else {
      handleFinish()
    }
  }

  const handleFinish = async () => {
    if (!user || saving) return
    setSaving(true)
    await supabase.from("profiles").update({
      onboarding_complete: true,
      onboarding_answers:  answers,
    }).eq("id", user.id)
    navigate("/")
  }

  if (checking) return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#333", fontSize: "14px" }}>Loading…</div>
    </div>
  )

  return (
    <div className="dot-bg" style={{
      minHeight: "100vh",
      fontFamily: "'Inter', sans-serif",
      color: "white",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Centered content area */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}>
      {/* Logo */}
      <div style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "-1.2px", color: "white", marginBottom: "40px" }}>
        VAULT<span style={{ color: "#d00000" }}>E</span>
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "40px", alignItems: "center" }}>
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            style={{
              height: "6px",
              borderRadius: "99px",
              background: i <= step ? "#d00000" : "#1f1f1f",
              width: i === step ? "28px" : "18px",
              transition: "width 0.3s ease, background 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div
        key={step}
        style={{
          background: "#111",
          border: "1px solid #1f1f1f",
          borderRadius: "24px",
          padding: "48px 40px",
          width: "100%",
          maxWidth: "600px",
          animation: "pulse-glow 3.5s ease-in-out infinite, modal-in 0.3s ease",
        }}
      >
        {/* Step indicator */}
        <div style={{ fontSize: "11px", fontWeight: 700, color: "#333", letterSpacing: "0.12em", marginBottom: "12px" }}>
          STEP {step + 1} OF {total}
        </div>

        {/* Question */}
        <h2 style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-1px", color: "white", marginBottom: "8px", lineHeight: 1.2 }}>
          {current.q}
        </h2>
        <p style={{ fontSize: "14px", color: "#555", marginBottom: "32px", lineHeight: "1.6" }}>
          {current.sub}
        </p>

        {/* Niche picker */}
        {current.type === "niche" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            {NICHES.map(n => {
              const sel = answers.niche === n.id
              return (
                <button
                  key={n.id}
                  onClick={() => selectOption("niche", n.id)}
                  style={{
                    background: sel ? "#1a0000" : "#0d0d0d",
                    border: `1.5px solid ${sel ? "#d00000" : "#1f1f1f"}`,
                    borderRadius: "14px",
                    padding: "20px 12px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={e => { if (!sel) e.currentTarget.style.borderColor = "#333" }}
                  onMouseLeave={e => { if (!sel) e.currentTarget.style.borderColor = "#1f1f1f" }}
                >
                  <span style={{ fontSize: "28px" }}>{n.icon}</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: sel ? "#d00000" : "#888" }}>{n.label}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Option picker */}
        {current.type === "options" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {current.options.map(opt => {
              const sel = answers[current.id] === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => selectOption(current.id, opt.id)}
                  style={{
                    background: sel ? "#1a0000" : "#0d0d0d",
                    border: `1.5px solid ${sel ? "#d00000" : "#1f1f1f"}`,
                    borderRadius: "12px",
                    padding: "16px 20px",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={e => { if (!sel) e.currentTarget.style.borderColor = "#333" }}
                  onMouseLeave={e => { if (!sel) e.currentTarget.style.borderColor = "#1f1f1f" }}
                >
                  <span style={{ fontSize: "22px", flexShrink: 0 }}>{opt.icon}</span>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: sel ? "#d00000" : "white", marginBottom: "2px" }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: "12px", color: "#555" }}>{opt.desc}</div>
                  </div>
                  {sel && (
                    <div style={{ marginLeft: "auto", width: "20px", height: "20px", background: "#d00000", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "white", flexShrink: 0 }}>✓</div>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Mentor picker */}
        {current.type === "mentors" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {NICHES.map((n, i) => {
                const selected   = (answers.mentors || []).includes(n.id)
                const maxReached = (answers.mentors || []).length >= 2 && !selected
                const locked     = i >= 2 && maxReached

                return (
                  <button
                    key={n.id}
                    onClick={() => { if (!locked) selectOption("mentors", n.id) }}
                    style={{
                      background:  selected ? "#1a0000" : "#0d0d0d",
                      border:      `1.5px solid ${selected ? "#d00000" : "#1f1f1f"}`,
                      borderRadius: "12px",
                      padding:     "16px",
                      cursor:      locked ? "not-allowed" : "pointer",
                      display:     "flex",
                      alignItems:  "center",
                      gap:         "10px",
                      transition:  "border-color 0.2s, background 0.2s",
                      position:    "relative",
                      filter:      locked ? "blur(1px)" : "none",
                      opacity:     locked ? 0.4 : 1,
                    }}
                  >
                    <span style={{ fontSize: "22px" }}>{n.icon}</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: selected ? "#d00000" : "#888" }}>
                      {n.label}
                    </span>
                    {selected && (
                      <div style={{ marginLeft: "auto", width: "18px", height: "18px", background: "#d00000", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "white", flexShrink: 0 }}>✓</div>
                    )}
                    {locked && (
                      <div style={{ marginLeft: "auto", fontSize: "14px", flexShrink: 0 }}>🔒</div>
                    )}
                  </button>
                )
              })}
            </div>
            {(answers.mentors || []).length === 2 && (
              <div style={{ marginTop: "16px", padding: "12px 16px", background: "#1a0000", border: "1px solid #3a0000", borderRadius: "10px", fontSize: "12px", color: "#d00000", textAlign: "center" }}>
                Upgrade to Pro to unlock all 6 mentors →
              </div>
            )}
          </>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "36px" }}>
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            style={{
              background: "transparent",
              border: "1px solid #1f1f1f",
              color: step === 0 ? "#333" : "#aaa",
              padding: "12px 24px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: step === 0 ? "not-allowed" : "pointer",
              fontFamily: "'Inter', sans-serif",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { if (step !== 0) { e.currentTarget.style.borderColor = "#555"; e.currentTarget.style.color = "white" } }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1f1f1f"; e.currentTarget.style.color = step === 0 ? "#333" : "#aaa" }}
          >
            ← Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canNext() || saving}
            style={{
              background: canNext() && !saving ? "#d00000" : "#330000",
              color: "white",
              border: "none",
              padding: "12px 32px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 900,
              cursor: canNext() && !saving ? "pointer" : "not-allowed",
              fontFamily: "'Inter', sans-serif",
              opacity: canNext() && !saving ? 1 : 0.5,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => { if (canNext() && !saving) e.currentTarget.style.opacity = "0.85" }}
            onMouseLeave={e => { e.currentTarget.style.opacity = canNext() && !saving ? "1" : "0.5" }}
          >
            {saving ? "Saving…" : step === total - 1 ? "Let's go →" : "Next →"}
          </button>
        </div>
      </div>
      </div>
      <Footer />
      <MessageBubble />
    </div>
  )
}
