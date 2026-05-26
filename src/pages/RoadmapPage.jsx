import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import MessageBubble from "../components/MessageBubble"
import { supabase } from "../supabaseClient"

/* ── Step data ── */
const nicheSteps = {
  Trading: [
    { title: "Understand market basics & key terminology",      desc: "Learn what stocks, forex, crypto markets are, how they work, what drives price, and the vocabulary every trader needs before placing a single trade." },
    { title: "Learn technical analysis & chart reading",        desc: "Study support/resistance, trend lines, moving averages and how to read a price chart so you can identify patterns that repeat across all markets." },
    { title: "Study candlestick patterns & indicators",         desc: "Master the most important candlestick formations and layering indicators like RSI, MACD and Bollinger Bands to confirm entries and exits." },
    { title: "Master risk management & position sizing",        desc: "Understand the 1-2% rule, stop-loss placement and how to size positions so a losing streak never wipes your account." },
    { title: "Build your first trading strategy",              desc: "Combine your analysis skills into a rules-based strategy with defined entry criteria, exit rules and risk parameters you can test." },
    { title: "Paper trade for a full 30 days",                 desc: "Execute your strategy with simulated money on a real platform. Track every trade in a journal and measure win rate, risk/reward and drawdown." },
    { title: "Study different order types & execution",        desc: "Learn market, limit, stop and stop-limit orders and when to use each to get better fills and avoid slippage." },
    { title: "Master trading psychology & discipline",         desc: "Identify your emotional triggers, build pre-trade routines and learn how professional traders stay disciplined when the market moves against them." },
    { title: "Set up your professional trading journal",       desc: "Create a system to record every trade with screenshots, reasoning, outcome and lessons learned. Your journal is your edge over time." },
    { title: "Go live with real capital",                      desc: "Start with a small amount you can afford to lose, follow your strategy strictly and scale up only after proving consistency for 60+ days." },
  ],
  Dropshipping: [
    { title: "Choose your niche market",                       desc: "Research product categories with strong demand, manageable competition and healthy margins. Passion matters but profit potential matters more." },
    { title: "Find a winning product",                         desc: "Use tools like Minea, AdSpy or TikTok organic to validate products that are already selling. Look for strong visual appeal and problem-solving products." },
    { title: "Set up your Shopify store",                      desc: "Build a clean, high-converting store with a professional theme, compelling product pages, trust badges, and a smooth checkout experience." },
    { title: "Write high-converting product descriptions",     desc: "Focus on benefits not features, address objections, use social proof and create urgency. Your copy is your salesperson." },
    { title: "Set your pricing & profit margin strategy",      desc: "Calculate landed cost including product, shipping and ads, then price for 2-3x markup minimum. Build in room for testing ad creative." },
    { title: "Run your first paid ad campaign",               desc: "Launch a $20-50/day Facebook or TikTok campaign to your best product. Test 3-5 creatives and 2-3 audiences. Kill losers fast, scale winners." },
    { title: "Optimise your fulfilment workflow",              desc: "Connect your supplier, automate order processing, set clear delivery expectations and have a customer service SOP ready from day one." },
    { title: "Analyse data and optimise your funnel",          desc: "Read your ad metrics, identify the weakest link in your funnel — whether that's CTR, conversion rate or AOV — and fix one thing at a time." },
    { title: "Scale with paid traffic and lookalikes",        desc: "Once you have a profitable campaign, increase budget by 20% every 48-72 hours, create lookalike audiences and expand to new creatives." },
    { title: "Build your brand identity for longevity",       desc: "Transition from a general store to a branded experience — custom packaging, email flows, repeat customer strategy and owned social channels." },
  ],
  Freelancing: [
    { title: "Choose your core skill & service offering",      desc: "Pick one skill you can do well today — design, copywriting, video editing, web dev, social media management. Niche down to a specific service." },
    { title: "Define your target client & niche",             desc: "The riches are in the niches. Decide who you serve — real estate agents, SaaS startups, e-commerce brands. Speak their language, solve their exact problem." },
    { title: "Build your portfolio from scratch",             desc: "Create 3-5 spec pieces if you have no client work. Reach out to local businesses for discounted work. Your portfolio is your best sales tool." },
    { title: "Set your rates and pricing structure",          desc: "Research market rates, start slightly below to win your first clients, then raise prices every 3 clients. Move to project pricing over hourly as fast as possible." },
    { title: "Write your first outreach messages",            desc: "Craft a personalised, concise cold message that leads with value, references their specific business, and makes a low-friction offer. Volume + quality = clients." },
    { title: "Land your first paying client",                 desc: "Send 20+ outreach messages per day across LinkedIn, email and relevant communities. Follow up twice. Every no gets you closer to yes." },
    { title: "Deliver exceptional work and get a testimonial", desc: "Over-communicate during the project, deliver before deadline and ask for a detailed testimonial immediately after. Referrals come from delight." },
    { title: "Build systems to handle multiple clients",      desc: "Create templates for proposals, contracts, onboarding and reporting. Use project management tools. Your systems are what let you scale without burning out." },
    { title: "Raise your rates and fire low-value clients",   desc: "Every 60-90 days review your client list. Raise rates with existing clients who value you and replace low-paying clients with better ones." },
    { title: "Create a scalable service or productized offer", desc: "Package your service into a fixed-scope, fixed-price productized offer or build an agency model to scale beyond your personal hours." },
  ],
  "Content Creation": [
    { title: "Define your niche and content angle",           desc: "The creator economy rewards specificity. Pick one topic you can talk about for years, find your unique angle and make it obvious from your first piece of content." },
    { title: "Choose your primary platform",                  desc: "Pick one platform and go all-in — YouTube for long form, TikTok or Reels for short form, Twitter/X for written, LinkedIn for B2B. Master one before expanding." },
    { title: "Study the algorithm and content formats",       desc: "Understand what gets pushed on your platform, what formats perform, how to write hooks and thumbnails, and what your target audience already watches." },
    { title: "Create your first 10 pieces of content",       desc: "Don't wait until it's perfect. Publish consistently, study what gets traction and what doesn't. Your 10th piece will be 10x better than your first." },
    { title: "Develop your brand aesthetic and voice",       desc: "Consistent visual style, tone, colours, thumbnail templates and intro style make you instantly recognisable. Brand consistency compounds over time." },
    { title: "Grow to your first 1,000 followers",           desc: "Focus on collaboration, engagement in your niche community, post frequency and optimising your best-performing formats to replicate success." },
    { title: "Build an email list or owned audience",        desc: "Social platforms can disappear. Start collecting emails from day one with a freebie or lead magnet. Your list is an asset you own forever." },
    { title: "Introduce your first monetisation stream",     desc: "Brand deals, affiliate links, digital products, memberships — pick the one that fits your audience size and relationship and add it at 5,000+ followers." },
    { title: "Batch content and build a system",             desc: "The biggest creators batch shoot 30 videos in one day. Build a production system — scripting, recording, editing, scheduling — that lets you stay consistent." },
    { title: "Scale with a team or tools",                   desc: "Hire an editor, automate distribution, repurpose long form into short clips. Your job becomes ideation and strategy as the creator, not every task." },
  ],
  "Affiliate Marketing": [
    { title: "Understand the affiliate marketing model",      desc: "Learn how affiliate marketing works end-to-end — merchant, affiliate network, tracking links, cookies, commissions and payouts. Know your business model deeply." },
    { title: "Choose your niche and affiliate programs",     desc: "Pick a profitable niche you can create content around and find high-quality affiliate programs — Amazon, ClickBank, ShareASale, or direct partner programs with good commissions." },
    { title: "Build your content platform",                  desc: "Choose your channel — blog, YouTube, email newsletter or social media. Your content platform is the engine that drives free organic traffic to your affiliate links." },
    { title: "Create your first pieces of content",         desc: "Publish product reviews, comparison articles, 'best of' listicles and problem-solving content that naturally incorporates your affiliate links in context." },
    { title: "Learn SEO or content distribution basics",    desc: "Understand keyword research, on-page SEO and link building — or master the algorithm on your chosen platform. Traffic is the lifeblood of affiliate revenue." },
    { title: "Build your first email list",                 desc: "A targeted email list lets you promote products directly to people who already trust you. Set up a simple lead magnet and email sequence from week one." },
    { title: "Track and analyse your performance",          desc: "Monitor click-through rates, conversion rates and earnings per click for every piece of content. Data tells you what's working so you can do more of it." },
    { title: "Optimise your top converting content",        desc: "Find your 20% of content driving 80% of revenue and double down — improve the copy, add comparison tables, update information and add stronger CTAs." },
    { title: "Diversify across multiple affiliate programs", desc: "Never depend on a single program. Spread your income across 3-5 affiliate partnerships so a rate cut or program closure doesn't tank your earnings." },
    { title: "Scale with paid traffic or outsourcing",      desc: "Once organic is profitable, test paid traffic to your best converting funnels, or hire writers to multiply your content output and compound your traffic." },
  ],
  "AI Tools": [
    { title: "Understand the AI tools landscape",            desc: "Get familiar with the major AI categories — LLMs, image generators, voice tools, automation platforms — and understand which problems each category solves." },
    { title: "Master prompt engineering fundamentals",       desc: "Learn how to write effective prompts with context, role assignment, output format instructions and iteration. Prompting is the core skill of the AI era." },
    { title: "Identify problems AI can solve in your workflow", desc: "Audit your current work or business for time-consuming, repetitive tasks that AI tools can automate or dramatically accelerate. Find your highest-leverage wins first." },
    { title: "Build your first AI-powered workflow",        desc: "Pick one workflow and fully automate it using tools like Make, Zapier, or direct API integrations. Fully built workflows compound — each one frees time for the next." },
    { title: "Learn to build with the Claude or GPT API",  desc: "Move beyond ChatGPT prompts into building actual applications — chatbots, content pipelines, data processors — using API calls, system prompts and structured outputs." },
    { title: "Create and sell an AI-powered product",       desc: "Package your skills into a productized service, SaaS tool or digital product. The market is exploding for AI-built solutions that solve specific business problems." },
    { title: "Automate content creation at scale",          desc: "Use AI to generate first drafts, repurpose content across formats, write email sequences, social posts and ad copy — then apply your judgement to make it excellent." },
    { title: "Build AI agents for complex tasks",           desc: "Learn to chain AI tools together into autonomous agents that can research, plan, execute and iterate on multi-step tasks with minimal human input." },
    { title: "Stay ahead of the curve",                     desc: "The AI landscape changes weekly. Build systems to track new tools, test them quickly and integrate the genuinely useful ones. Ruthlessly cut the hype." },
    { title: "Monetise your AI expertise",                  desc: "Consult, build, teach, or create content about AI. The gap between people who understand AI and businesses trying to adopt it is a massive and growing opportunity." },
  ],
}

const nicheList = Object.keys(nicheSteps)
const nicheIcons = { Trading: "📈", Dropshipping: "📦", Freelancing: "💻", "Content Creation": "🎬", "Affiliate Marketing": "💰", "AI Tools": "🤖" }

export default function RoadmapPage() {
  const navigate = useNavigate()
  const [user,           setUser]          = useState(null)
  const [loading,        setLoading]       = useState(true)
  const [selectedNiche,  setSelectedNiche] = useState("Trading")
  const [progress,       setProgress]      = useState({})   // { "Trading": [0,2,4], ... }
  const [completing,     setCompleting]    = useState(false)
  const [profile,        setProfile]       = useState(null)
  const [stats,          setStats]         = useState({ daysActive: 0, messages: 0, stepsCompleted: 0 })

  /* ── Auth guard ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/login"); return }
      setUser(session.user)
      fetchAll(session.user.id)
    })
  }, [])

  const fetchAll = async (uid) => {
    const [{ data: prof }, { data: prog }, { data: mc }] = await Promise.all([
      supabase.from("profiles").select("first_name, plan").eq("id", uid).single(),
      supabase.from("roadmap_progress").select("niche, step_index").eq("user_id", uid).eq("completed", true),
      supabase.from("message_counts").select("count").eq("user_id", uid),
    ])
    setProfile(prof)

    // Group completed step indexes by niche
    const grouped = {}
    nicheList.forEach(n => { grouped[n] = [] })
    ;(prog || []).forEach(row => {
      if (grouped[row.niche]) grouped[row.niche].push(row.step_index)
    })
    setProgress(grouped)

    const totalSteps = (prog || []).length
    const totalMsgs  = (mc || []).reduce((s, r) => s + (r.count || 0), 0)
    setStats({ daysActive: 1, messages: totalMsgs, stepsCompleted: totalSteps })
    setLoading(false)
  }

  const markComplete = async (stepIndex) => {
    if (!user || completing) return
    setCompleting(true)
    await supabase.from("roadmap_progress").upsert({
      user_id:    user.id,
      niche:      selectedNiche,
      step_index: stepIndex,
      completed:  true,
    }, { onConflict: "user_id,niche,step_index" })

    setProgress(prev => ({
      ...prev,
      [selectedNiche]: [...new Set([...(prev[selectedNiche] || []), stepIndex])],
    }))
    setStats(prev => ({ ...prev, stepsCompleted: prev.stepsCompleted + 1 }))
    setCompleting(false)
  }

  const completedForNiche = (n) => (progress[n] || [])
  const steps             = nicheSteps[selectedNiche] || []
  const done              = completedForNiche(selectedNiche)
  const nextStep          = steps.findIndex((_, i) => !done.includes(i))
  const pct               = steps.length ? Math.round((done.length / steps.length) * 100) : 0

  const totalDone  = Object.values(progress).flat().length
  const totalAll   = nicheList.length * 10

  if (loading) return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#333", fontSize: "14px" }}>Loading your roadmap…</div>
    </div>
  )

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

      <div style={{ display: "flex", minHeight: "calc(100vh - 67px)" }}>

        {/* ── Left sidebar ── */}
        <aside style={{
          width: "280px",
          flexShrink: 0,
          borderRight: "1px solid #1a1a1a",
          padding: "32px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          overflowY: "auto",
        }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#333", letterSpacing: "0.12em", marginBottom: "12px" }}>
            YOUR NICHES
          </div>

          {nicheList.map(n => {
            const d   = completedForNiche(n)
            const p   = Math.round((d.length / 10) * 100)
            const sel = selectedNiche === n
            return (
              <button
                key={n}
                onClick={() => setSelectedNiche(n)}
                style={{
                  background:   sel ? "#1a0000" : "#111",
                  border:       `1px solid ${sel ? "#3a0000" : "#1f1f1f"}`,
                  borderRadius: "12px",
                  padding:      "14px 16px",
                  cursor:       "pointer",
                  textAlign:    "left",
                  marginBottom: "4px",
                  transition:   "border-color 0.2s, background 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "18px" }}>{nicheIcons[n]}</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: sel ? "#d00000" : "#aaa" }}>{n}</span>
                  <span style={{ marginLeft: "auto", fontSize: "11px", color: "#333", fontWeight: 600 }}>{p}%</span>
                </div>
                <div style={{ height: "3px", background: "#1a1a1a", borderRadius: "99px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${p}%`,
                    background: "#d00000",
                    borderRadius: "99px",
                    transition: "width 0.6s ease",
                  }} />
                </div>
              </button>
            )
          })}

          {/* Stats grid */}
          <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {[
              { label: "STEPS DONE",    value: totalDone },
              { label: "TOTAL",         value: `${Math.round((totalDone / totalAll) * 100)}%` },
              { label: "AI MESSAGES",   value: stats.messages },
              { label: "ACTIVE DAYS",   value: stats.daysActive },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "20px", fontWeight: 900, color: "white", letterSpacing: "-1px" }}>{value}</div>
                <div style={{ fontSize: "9px", fontWeight: 700, color: "#333", letterSpacing: "0.1em", marginTop: "2px" }}>{label}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Main content ── */}
        <main style={{ flex: 1, padding: "48px 60px 80px", overflowY: "auto", position: "relative" }}>

          <div style={{ position: "relative", zIndex: 1 }}>

            {/* Header */}
            <div style={{ marginBottom: "36px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#d00000", letterSpacing: "0.1em", marginBottom: "10px" }}>
                {nicheIcons[selectedNiche]} {selectedNiche.toUpperCase()}
              </div>
              <h1 style={{ fontSize: "38px", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.1, color: "white", marginBottom: "6px" }}>
                Your path to <span style={{ color: "#d00000" }}>the goal.</span>
              </h1>
              <p style={{ fontSize: "14px", color: "#444" }}>
                Step {Math.min(nextStep + 1, steps.length)} of {steps.length} — {pct}% complete
              </p>
            </div>

            {/* Progress bar */}
            <div style={{ height: "4px", background: "#1a1a1a", borderRadius: "99px", marginBottom: "48px", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${pct}%`,
                background: "linear-gradient(90deg, #d00000, #ff3333)",
                borderRadius: "99px",
                transition: "width 0.8s ease",
                boxShadow: "0 0 12px rgba(208,0,0,0.5)",
              }} />
            </div>

            {/* Active step card */}
            {nextStep !== -1 ? (
              <div style={{
                background: "#111",
                border: "1.5px solid #3a0000",
                borderRadius: "20px",
                padding: "36px",
                marginBottom: "32px",
                boxShadow: "0 0 40px rgba(208,0,0,0.12)",
                position: "relative",
                overflow: "hidden",
              }}>
                {/* Glow pulse */}
                <div style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0,
                  height: "1px",
                  background: "linear-gradient(90deg, transparent, #d00000, transparent)",
                  opacity: 0.6,
                }} />

                <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                  {/* Step circle */}
                  <div style={{
                    width: "48px",
                    height: "48px",
                    flexShrink: 0,
                    background: "#d00000",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    fontWeight: 900,
                    color: "white",
                    boxShadow: "0 0 16px rgba(208,0,0,0.4)",
                  }}>
                    {nextStep + 1}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#d00000", letterSpacing: "0.1em", marginBottom: "8px" }}>
                      CURRENT STEP
                    </div>
                    <div style={{ fontSize: "22px", fontWeight: 800, color: "white", letterSpacing: "-0.5px", marginBottom: "14px", lineHeight: 1.3 }}>
                      {steps[nextStep]?.title}
                    </div>
                    <div style={{ fontSize: "14px", color: "#666", lineHeight: "1.8", marginBottom: "28px" }}>
                      {steps[nextStep]?.desc}
                    </div>

                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      <button
                        onClick={() => markComplete(nextStep)}
                        disabled={completing}
                        style={{
                          background: completing ? "#330000" : "#d00000",
                          color: "white",
                          border: "none",
                          padding: "12px 28px",
                          borderRadius: "10px",
                          fontSize: "13px",
                          fontWeight: 800,
                          cursor: completing ? "not-allowed" : "pointer",
                          fontFamily: "'Inter', sans-serif",
                          transition: "opacity 0.2s",
                          opacity: completing ? 0.7 : 1,
                        }}
                        onMouseEnter={e => { if (!completing) e.currentTarget.style.opacity = "0.85" }}
                        onMouseLeave={e => { if (!completing) e.currentTarget.style.opacity = "1" }}
                      >
                        {completing ? "Saving…" : "✓ Mark as complete"}
                      </button>
                      <Link
                        to="/mentor"
                        style={{
                          display: "inline-block",
                          background: "transparent",
                          border: "1px solid #0088ff44",
                          color: "#0088ff",
                          padding: "12px 24px",
                          borderRadius: "10px",
                          fontSize: "13px",
                          fontWeight: 700,
                          textDecoration: "none",
                          transition: "border-color 0.2s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "#0088ff"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "#0088ff44"}
                      >
                        Ask AI mentor →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                background: "#111",
                border: "1.5px solid #1a3a00",
                borderRadius: "20px",
                padding: "36px",
                marginBottom: "32px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎉</div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "white", marginBottom: "8px" }}>Niche complete!</div>
                <div style={{ fontSize: "14px", color: "#555" }}>You've finished all 10 steps for {selectedNiche}. Pick another niche to keep growing.</div>
              </div>
            )}

            {/* Completed steps */}
            {done.length > 0 && (
              <>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#333", letterSpacing: "0.1em", marginBottom: "16px" }}>
                  COMPLETED — {done.length} of {steps.length}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "32px" }}>
                  {done.sort((a,b) => a - b).map(i => (
                    <div key={i} style={{
                      background: "#111",
                      border: "1px solid #1a1a1a",
                      borderRadius: "12px",
                      padding: "16px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}>
                      <div style={{
                        width: "28px",
                        height: "28px",
                        flexShrink: 0,
                        background: "#0d1a0d",
                        border: "1px solid #1a3a1a",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        color: "#00aa55",
                        fontWeight: 900,
                      }}>✓</div>
                      <span style={{ fontSize: "12px", color: "#555", lineHeight: 1.4, textDecoration: "line-through" }}>
                        {steps[i]?.title}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Next locked step preview */}
            {nextStep !== -1 && nextStep + 1 < steps.length && (
              <>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#333", letterSpacing: "0.1em", marginBottom: "16px" }}>
                  UP NEXT
                </div>
                <div style={{
                  background: "#111",
                  border: "1px solid #1a1a1a",
                  borderRadius: "12px",
                  padding: "20px",
                  filter: "blur(2px)",
                  opacity: 0.4,
                  pointerEvents: "none",
                  userSelect: "none",
                  position: "relative",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "32px", height: "32px", background: "#1a1a1a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: "#333", fontWeight: 900 }}>
                      {nextStep + 2}
                    </div>
                    <span style={{ fontSize: "14px", color: "#555" }}>{steps[nextStep + 1]?.title}</span>
                  </div>
                </div>
                <div style={{ textAlign: "center", marginTop: "8px", fontSize: "12px", color: "#333" }}>
                  🔒 Complete the current step to unlock
                </div>
              </>
            )}

            {/* Steps remaining */}
            <div style={{ marginTop: "40px", padding: "16px 20px", background: "#111", border: "1px solid #1a1a1a", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px", color: "#444" }}>
                {steps.length - done.length} step{steps.length - done.length !== 1 ? "s" : ""} remaining in {selectedNiche}
              </span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#d00000" }}>{pct}% done</span>
            </div>
          </div>
        </main>
      </div>
      <Footer />
      <MessageBubble />
    </div>
  )
}
