import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { supabase } from "../supabaseClient"

const ADMIN_EMAIL = "jonathonv.trade@gmail.com"

const NeonDivider = () => (
  <div style={{ width: "100%", height: "1px", background: "#d00000", boxShadow: "0 0 10px rgba(208,0,0,0.7), 0 0 20px rgba(208,0,0,0.3)" }} />
)

export default function AdminAnnouncePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [announcements, setAnnouncements] = useState([])
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { navigate("/login"); return }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()
      if ((profile?.role !== "admin" && profile?.role !== "founder") || session.user.email !== ADMIN_EMAIL) { navigate("/"); return }
      setUserId(session.user.id)
      await fetchAnnouncements()
      setLoading(false)
    }
    init()
  }, [navigate])

  const fetchAnnouncements = async () => {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false }).limit(20)
    setAnnouncements(data || [])
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setError(""); setSending(true); setSent(false)
    const { error: err } = await supabase.from("announcements").insert({ content: content.trim(), created_by: userId })
    if (err) {
      setError("Failed to send announcement. Try again.")
    } else {
      setSent(true)
      setContent("")
      await fetchAnnouncements()
    }
    setSending(false)
  }

  const handleDelete = async (id) => {
    await supabase.from("announcements").delete().eq("id", id)
    setAnnouncements(prev => prev.filter(a => a.id !== id))
  }

  if (loading) return (
    <div className="dot-bg" style={{ minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#444" }}>Loading…</p>
    </div>
  )

  const inputStyle = {
    width: "100%", background: "#0d0d0d", border: "1px solid #1f1f1f", color: "white",
    padding: "12px 16px", borderRadius: "10px", fontSize: "14px", outline: "none",
    fontFamily: "'Inter', sans-serif", boxSizing: "border-box",
    resize: "vertical", minHeight: "110px", lineHeight: "1.6",
  }

  return (
    <div className="dot-bg" style={{ minHeight: "100vh", width: "100vw", maxWidth: "100%", fontFamily: "'Inter', sans-serif", color: "white", overflowX: "hidden" }}>
      <Navbar />
      <NeonDivider />

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "60px 40px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px", flexWrap: "wrap" }}>
          <Link to="/admin" style={{ fontSize: "13px", color: "#444", textDecoration: "none", fontWeight: 600 }}>← Admin</Link>
        </div>
        <div style={{ display: "inline-block", background: "#1a0000", color: "#d00000", border: "1px solid #3a0000", padding: "5px 14px", borderRadius: "99px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "16px" }}>
          ADMIN
        </div>
        <h1 style={{ fontSize: "36px", fontWeight: 900, letterSpacing: "-1.8px", marginBottom: "8px" }}>Send Announcement</h1>
        <p style={{ fontSize: "14px", color: "#444", marginBottom: "40px", lineHeight: "1.7" }}>
          Announcements appear as a dismissible banner at the top of the platform for all users. They expire after 7 days.
        </p>

        {/* Compose */}
        <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "56px" }}>
          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "#555", display: "block", marginBottom: "8px", letterSpacing: "0.1em" }}>ANNOUNCEMENT</label>
            <textarea
              required
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="What do you want to tell your users?"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#d00000"}
              onBlur={e => e.target.style.borderColor = "#1f1f1f"}
            />
          </div>

          {error && <div style={{ background: "#1a0000", border: "1px solid #3a0000", color: "#d00000", fontSize: "13px", padding: "12px 16px", borderRadius: "10px" }}>{error}</div>}
          {sent  && <div style={{ background: "#001a0d", border: "1px solid #003322", color: "#00cc66", fontSize: "13px", padding: "12px 16px", borderRadius: "10px" }}>✅ Announcement sent successfully.</div>}

          <button
            type="submit"
            disabled={sending || !content.trim()}
            style={{ background: "#d00000", color: "white", border: "none", padding: "14px", borderRadius: "10px", fontSize: "14px", fontWeight: 900, cursor: sending ? "not-allowed" : "pointer", fontFamily: "'Inter', sans-serif", opacity: sending || !content.trim() ? 0.6 : 1 }}
          >
            {sending ? "Sending…" : "Send announcement →"}
          </button>
        </form>

        {/* Past announcements */}
        <NeonDivider />
        <p style={{ fontSize: "11px", fontWeight: 700, color: "#444", letterSpacing: "0.1em", textTransform: "uppercase", margin: "32px 0 20px" }}>Past Announcements</p>

        {announcements.length === 0 && (
          <p style={{ fontSize: "14px", color: "#333" }}>No announcements yet.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {announcements.map(a => (
            <div key={a.id} style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "14px", color: "#777", lineHeight: "1.7", margin: "0 0 8px" }}>{a.content}</p>
                <p style={{ fontSize: "11px", color: "#333", margin: 0 }}>{new Date(a.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              <button
                onClick={() => handleDelete(a.id)}
                style={{ background: "none", border: "1px solid #1f1f1f", color: "#555", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", cursor: "pointer", fontFamily: "'Inter', sans-serif", flexShrink: 0 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#d00000"; e.currentTarget.style.color = "#d00000" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1f1f1f"; e.currentTarget.style.color = "#555" }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <NeonDivider />
      <Footer />
    </div>
  )
}
