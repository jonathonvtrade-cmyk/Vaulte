import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import MessageBubble from "../components/MessageBubble"
import VerifiedBadge from "../components/VerifiedBadge"
import { supabase } from "../supabaseClient"

const ADMIN_EMAIL = "jonathonv.trade@gmail.com"

const NICHES = ["All", "Trading", "Dropshipping", "Freelancing", "Content Creation", "Affiliate Marketing", "AI Tools"]
const POST_TYPES = ["WIN", "QUESTION", "TIP", "UPDATE"]

const TYPE_META = {
  WIN:      { color: "#d00000", bg: "#1a0000", border: "#3a0000", label: "🏆 WIN" },
  QUESTION: { color: "#0088ff", bg: "#001a33", border: "#003366", label: "❓ QUESTION" },
  TIP:      { color: "#00aa55", bg: "#001a0d", border: "#003322", label: "💡 TIP" },
  UPDATE:   { color: "#666",    bg: "#111",    border: "#1f1f1f", label: "📢 UPDATE" },
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function initials(name) {
  if (!name) return "?"
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
}

const AVATAR_COLORS = ["#d00000", "#0088ff", "#00aa55", "#8855ff", "#ff8800", "#00aaaa"]
function avatarColor(str) {
  let n = 0; for (const c of (str || "")) n += c.charCodeAt(0)
  return AVATAR_COLORS[n % AVATAR_COLORS.length]
}

export default function CommunityPage() {
  const navigate  = useNavigate()
  const [user,         setUser]         = useState(null)
  const [profile,      setProfile]      = useState(null)
  const [isAdmin,      setIsAdmin]      = useState(false)
  const [posts,        setPosts]        = useState([])
  const [filter,       setFilter]       = useState("All")
  const [postType,     setPostType]     = useState("WIN")
  const [content,      setContent]      = useState("")
  const [posting,      setPosting]      = useState(false)
  const [loading,      setLoading]      = useState(true)
  const [postNiche,    setPostNiche]    = useState("Trading")
  const [liking,       setLiking]       = useState(null)
  const [deleting,     setDeleting]     = useState(null)
  const textRef = useRef(null)

  /* ── Mock sidebar data ── */
  const weekStats = { members: 47, posts: 134, steps: 312, messages: 891 }
  const leaderboard = [
    { name: "Alex K.",   score: 2340, badge: "🥇" },
    { name: "Maya R.",   score: 1892, badge: "🥈" },
    { name: "Jordan T.", score: 1654, badge: "🥉" },
  ]

  /* ── Auth guard ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/login"); return }
      setUser(session.user)
      fetchProfile(session.user.id, session.user.email)
      fetchPosts()
    })
  }, [])

  useEffect(() => { fetchPosts() }, [filter])

  const fetchProfile = async (uid, email) => {
    const { data } = await supabase.from("profiles").select("first_name, last_name, plan, role").eq("id", uid).single()
    setProfile(data)
    if ((data?.role === "admin" || data?.role === "founder") && email === ADMIN_EMAIL) setIsAdmin(true)
  }

  const deletePost = async (postId) => {
    if (deleting === postId) return
    setDeleting(postId)
    await supabase.from("community_posts").delete().eq("id", postId)
    setPosts(prev => prev.filter(p => p.id !== postId))
    setDeleting(null)
  }

  const fetchPosts = async () => {
    setLoading(true)
    let q = supabase
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(40)
    if (filter !== "All") q = q.eq("niche", filter)
    const { data } = await q
    setPosts(data || [])
    setLoading(false)
  }

  const submitPost = async () => {
    if (!content.trim() || !user || posting) return
    setPosting(true)
    const firstName = profile?.first_name || user?.user_metadata?.first_name || ""
    const lastName  = profile?.last_name  || user?.user_metadata?.last_name  || ""
    const author    = `${firstName} ${lastName}`.trim() || "Anonymous"
    const { data, error } = await supabase.from("community_posts").insert({
      user_id:     user.id,
      niche:       postNiche,
      content:     content.trim(),
      author_name: author,
      post_type:   postType,
    }).select().single()
    setPosting(false)
    if (!error && data) {
      setPosts(prev => [data, ...prev])
      setContent("")
    }
  }

  const handleLike = async (postId) => {
    if (liking === postId) return
    setLiking(postId)
    await supabase.from("community_posts").update({ likes: (posts.find(p => p.id === postId)?.likes || 0) + 1 }).eq("id", postId)
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p))
    setLiking(null)
  }

  const filtered = filter === "All" ? posts : posts.filter(p => p.niche === filter)

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

      <div style={{ display: "flex", maxWidth: "1280px", margin: "0 auto", padding: "48px 40px 80px", gap: "32px" }}>

        {/* ── Main feed ── */}
        <div style={{ flex: 1, minWidth: 0, position: "relative" }}>

          {/* Header */}
          <div style={{ marginBottom: "36px", position: "relative", zIndex: 1 }}>
            <h1 style={{ fontSize: "42px", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.1, color: "white", marginBottom: "8px" }}>
              You're not <span style={{ color: "#d00000" }}>alone</span> in this.
            </h1>
            <p style={{ fontSize: "14px", color: "#444" }}>Share wins, ask questions, and learn from people doing the same thing.</p>
          </div>

          {/* Filter pills */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px", position: "relative", zIndex: 1 }}>
            {NICHES.map(n => (
              <button
                key={n}
                onClick={() => setFilter(n)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "99px",
                  border: `1px solid ${filter === n ? "#d00000" : "#1f1f1f"}`,
                  background: filter === n ? "#1a0000" : "#111",
                  color: filter === n ? "#d00000" : "#555",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  transition: "all 0.2s",
                }}
              >{n}</button>
            ))}
          </div>

          {/* Post composer */}
          <div style={{
            background: "#111",
            border: "1px solid #1f1f1f",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "24px",
            position: "relative",
            zIndex: 1,
          }}>
            {/* Type selector */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
              {POST_TYPES.map(t => {
                const m = TYPE_META[t]
                return (
                  <button
                    key={t}
                    onClick={() => setPostType(t)}
                    style={{
                      padding: "5px 14px",
                      borderRadius: "99px",
                      border: `1px solid ${postType === t ? m.border : "#1f1f1f"}`,
                      background: postType === t ? m.bg : "transparent",
                      color: postType === t ? m.color : "#444",
                      fontSize: "11px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                      transition: "all 0.2s",
                    }}
                  >{m.label}</button>
                )
              })}

              {/* Niche picker */}
              <select
                value={postNiche}
                onChange={e => setPostNiche(e.target.value)}
                style={{
                  marginLeft: "auto",
                  background: "#0d0d0d",
                  border: "1px solid #1f1f1f",
                  color: "#666",
                  padding: "5px 10px",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontFamily: "'Inter', sans-serif",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {NICHES.slice(1).map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <textarea
              ref={textRef}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Share a win, ask a question, or drop a tip..."
              onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitPost() }}
              style={{
                width: "100%",
                background: "#0d0d0d",
                border: "1px solid #1a1a1a",
                color: "white",
                padding: "14px 16px",
                borderRadius: "10px",
                fontSize: "14px",
                outline: "none",
                fontFamily: "'Inter', sans-serif",
                boxSizing: "border-box",
                resize: "vertical",
                minHeight: "90px",
                lineHeight: "1.6",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "#d00000"}
              onBlur={e => e.target.style.borderColor = "#1a1a1a"}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
              <button
                onClick={submitPost}
                disabled={!content.trim() || posting}
                style={{
                  background: posting || !content.trim() ? "#330000" : "#d00000",
                  color: "white",
                  border: "none",
                  padding: "10px 24px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 800,
                  cursor: !content.trim() || posting ? "not-allowed" : "pointer",
                  fontFamily: "'Inter', sans-serif",
                  opacity: !content.trim() ? 0.5 : 1,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => { if (content.trim() && !posting) e.currentTarget.style.opacity = "0.85" }}
                onMouseLeave={e => { e.currentTarget.style.opacity = !content.trim() ? "0.5" : "1" }}
              >
                {posting ? "Posting…" : "Post →"}
              </button>
            </div>
          </div>

          {/* Posts feed */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", position: "relative", zIndex: 1 }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "60px", color: "#333", fontSize: "14px" }}>Loading posts…</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", color: "#333", fontSize: "14px" }}>
                No posts yet{filter !== "All" ? ` in ${filter}` : ""}. Be the first!
              </div>
            ) : (
              filtered.map((post, i) => {
                const tm       = TYPE_META[post.post_type] || TYPE_META.UPDATE
                const isWin    = post.post_type === "WIN"
                return (
                  <div
                    key={post.id}
                    style={{
                      background: "#111",
                      border: `1px solid #1f1f1f`,
                      borderLeft: isWin ? `3px solid #d00000` : "1px solid #1f1f1f",
                      borderRadius: "14px",
                      padding: "20px",
                      opacity: 0,
                      animation: `slide-fade-in 0.35s ease ${Math.min(i, 8) * 50}ms forwards`,
                    }}
                  >
                    {/* Top row */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px", position: "relative" }}>
                      {/* Admin delete button */}
                      {isAdmin && (
                        <button
                          onClick={() => deletePost(post.id)}
                          disabled={deleting === post.id}
                          title="Delete post (admin)"
                          style={{
                            position: "absolute",
                            top: "-4px",
                            right: "-4px",
                            background: "transparent",
                            border: "1px solid #3a0000",
                            borderRadius: "6px",
                            color: deleting === post.id ? "#555" : "#d00000",
                            fontSize: "12px",
                            cursor: deleting === post.id ? "not-allowed" : "pointer",
                            padding: "2px 6px",
                            lineHeight: 1,
                            fontFamily: "'Inter', sans-serif",
                            transition: "background 0.2s, border-color 0.2s",
                            opacity: deleting === post.id ? 0.5 : 1,
                          }}
                          onMouseEnter={e => { if (deleting !== post.id) { e.currentTarget.style.background = "#1a0000"; e.currentTarget.style.borderColor = "#d00000" }}}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#3a0000" }}
                        >
                          {deleting === post.id ? "…" : "🗑"}
                        </button>
                      )}
                      {/* Avatar */}
                      <div style={{
                        width: "38px",
                        height: "38px",
                        flexShrink: 0,
                        borderRadius: "50%",
                        background: avatarColor(post.author_name),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        fontWeight: 800,
                        color: "white",
                      }}>
                        {initials(post.author_name)}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "white" }}>
                            {post.author_name || "Anonymous"}
                          </span>
                          {/* Show verified badge on current user's posts if they're admin */}
                          {post.user_id === user?.id && (profile?.role === "admin" || profile?.role === "founder") && user?.email === ADMIN_EMAIL && (
                            <VerifiedBadge size={15} />
                          )}
                          {/* Niche tag */}
                          <span style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            color: "#555",
                            background: "#0d0d0d",
                            border: "1px solid #1a1a1a",
                            padding: "2px 8px",
                            borderRadius: "99px",
                            letterSpacing: "0.06em",
                          }}>
                            {post.niche || "General"}
                          </span>
                          {/* Post type badge */}
                          <span style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            color: tm.color,
                            background: tm.bg,
                            border: `1px solid ${tm.border}`,
                            padding: "2px 10px",
                            borderRadius: "99px",
                            letterSpacing: "0.06em",
                          }}>
                            {tm.label}
                          </span>
                        </div>
                        <div style={{ fontSize: "11px", color: "#333", marginTop: "2px" }}>
                          {timeAgo(post.created_at)}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ fontSize: "14px", color: "#bbb", lineHeight: "1.7", marginBottom: "16px", whiteSpace: "pre-wrap" }}>
                      {post.content}
                    </div>

                    {/* Footer */}
                    <div style={{ display: "flex", gap: "16px" }}>
                      <button
                        onClick={() => handleLike(post.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#444",
                          fontSize: "12px",
                          cursor: "pointer",
                          fontFamily: "'Inter', sans-serif",
                          padding: "4px 0",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = "#d00000"}
                        onMouseLeave={e => e.currentTarget.style.color = "#444"}
                      >
                        ❤️ {post.likes || 0}
                      </button>
                      <span style={{ color: "#222", fontSize: "12px", display: "flex", alignItems: "center", gap: "5px" }}>
                        💬 0
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <aside style={{
          width: "280px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          position: "sticky",
          top: "90px",
          alignSelf: "flex-start",
        }}>
          {/* Active now */}
          <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: "14px", padding: "20px" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#333", letterSpacing: "0.12em", marginBottom: "14px" }}>ACTIVE NOW</div>
            {["Alex K.", "Maya R.", "Jordan T.", "Sam L."].map(name => (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{ position: "relative" }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: avatarColor(name),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "white",
                  }}>
                    {initials(name)}
                  </div>
                  <div style={{
                    position: "absolute",
                    bottom: "1px",
                    right: "1px",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#00cc66",
                    border: "1.5px solid #111",
                    animation: "pulse-dot 2s ease-in-out infinite",
                  }} />
                </div>
                <span style={{ fontSize: "12px", color: "#888" }}>{name}</span>
              </div>
            ))}
          </div>

          {/* This week stats */}
          <div style={{
            background: "#111",
            border: "1px solid #1f1f1f",
            borderRadius: "14px",
            padding: "20px",
            boxShadow: "0 0 20px rgba(208,0,0,0.06)",
          }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#333", letterSpacing: "0.12em", marginBottom: "16px" }}>THIS WEEK</div>
            {[
              { label: "New members",  value: weekStats.members,  color: "#d00000" },
              { label: "Posts",        value: weekStats.posts,    color: "#0088ff" },
              { label: "Steps done",   value: weekStats.steps,    color: "#00aa55" },
              { label: "AI messages",  value: weekStats.messages, color: "#8855ff" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "12px", color: "#555" }}>{label}</span>
                <span style={{ fontSize: "14px", fontWeight: 800, color }}>{value.toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Leaderboard */}
          <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: "14px", padding: "20px" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#333", letterSpacing: "0.12em", marginBottom: "16px" }}>TOP CONTRIBUTORS</div>
            {leaderboard.map((entry, i) => (
              <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: i < 2 ? "12px" : 0 }}>
                <span style={{ fontSize: "18px", width: "24px" }}>{entry.badge}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "white" }}>{entry.name}</div>
                  <div style={{ fontSize: "10px", color: "#444" }}>{entry.score.toLocaleString()} pts</div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
      <Footer />
      <MessageBubble />
    </div>
  )
}
