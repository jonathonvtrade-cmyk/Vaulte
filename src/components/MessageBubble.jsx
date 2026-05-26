import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"

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

export default function MessageBubble() {
  const navigate = useNavigate()
  const [user,     setUser]     = useState(null)
  const [unread,   setUnread]   = useState([])
  const [open,     setOpen]     = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) fetchUnread(u.id)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) fetchUnread(u.id)
      else   { setUser(null); setUnread([]) }
    })
    return () => subscription.unsubscribe()
  }, [])

  const fetchUnread = async (uid) => {
    const { data } = await supabase
      .from("messages")
      .select("id, subject, content, sender_name, created_at")
      .eq("receiver_id", uid)
      .eq("read", false)
      .order("created_at", { ascending: false })
      .limit(3)
    setUnread(data || [])
  }

  if (!user) return null

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, fontFamily: "'Inter', sans-serif" }}>

      {/* ── Popup panel ── */}
      {open && (
        <div style={{
          position: "absolute", bottom: "64px", right: 0, width: "280px",
          background: "#111", border: "1px solid #1f1f1f", borderRadius: "16px",
          padding: "16px", animation: "modal-in 0.2s ease",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#444", letterSpacing: "0.1em", marginBottom: "12px" }}>
            MESSAGES{unread.length > 0 && <span style={{ color: "#d00000", marginLeft: "6px" }}>({unread.length} unread)</span>}
          </div>

          {unread.length === 0 ? (
            <div style={{ fontSize: "13px", color: "#555", textAlign: "center", padding: "20px 0" }}>
              No unread messages
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {unread.map(msg => (
                <div
                  key={msg.id}
                  onClick={() => { setOpen(false); navigate("/messages") }}
                  style={{
                    display: "flex", gap: "10px", cursor: "pointer",
                    padding: "8px", borderRadius: "8px", transition: "background 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#1a1a1a"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{
                    width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0,
                    background: "#d00000", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "11px", fontWeight: 800, color: "white",
                  }}>
                    {initials(msg.sender_name || "?")}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "white", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {msg.subject}
                    </div>
                    <div style={{ fontSize: "11px", color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {msg.content}
                    </div>
                    <div style={{ fontSize: "10px", color: "#333", marginTop: "2px" }}>
                      {timeAgo(msg.created_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div
            onClick={() => { setOpen(false); navigate("/messages") }}
            style={{
              textAlign: "center", marginTop: "12px", paddingTop: "10px",
              borderTop: "1px solid #1a1a1a",
              fontSize: "12px", color: "#d00000", cursor: "pointer", fontWeight: 700,
              transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#ff4444"}
            onMouseLeave={e => e.currentTarget.style.color = "#d00000"}
          >
            View all messages →
          </div>
        </div>
      )}

      {/* ── Floating button ── */}
      <button
        onClick={() => setOpen(p => !p)}
        className="float-bubble"
        style={{
          width: "48px", height: "48px", borderRadius: "50%",
          background: "#d00000", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", boxShadow: "0 4px 20px rgba(208,0,0,0.45)",
        }}
        aria-label="Messages"
      >
        {/* Chat SVG */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {/* Unread count badge */}
        {unread.length > 0 && (
          <div style={{
            position: "absolute", top: "-4px", right: "-4px",
            width: "18px", height: "18px", borderRadius: "50%",
            background: "white", color: "#d00000",
            fontSize: "10px", fontWeight: 900,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1.5px solid #d00000",
          }}>
            {unread.length}
          </div>
        )}
      </button>
    </div>
  )
}
