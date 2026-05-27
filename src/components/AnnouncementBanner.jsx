import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

export default function AnnouncementBanner() {
  const [user,         setUser]         = useState(null)
  const [announcement, setAnnouncement] = useState(null)
  const [dismissed,    setDismissed]    = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); fetchAnnouncement() }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) { setUser(session.user); fetchAnnouncement() }
      else               { setUser(null); setAnnouncement(null) }
    })
    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line

  const fetchAnnouncement = async () => {
    try {
      const { data } = await supabase
        .from("announcements")
        .select("id, content, created_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()
      if (!data) return
      const age = Date.now() - new Date(data.created_at).getTime()
      if (age > 7 * 24 * 60 * 60 * 1000) return  // older than 7 days
      if (localStorage.getItem(`vaulte_dismissed_${data.id}`)) return
      setAnnouncement(data)
    } catch {}
  }

  const dismiss = () => {
    if (announcement) localStorage.setItem(`vaulte_dismissed_${announcement.id}`, "1")
    setDismissed(true)
  }

  if (!user || !announcement || dismissed) return null

  return (
    <div style={{
      background: "#1a0000",
      borderBottom: "1px solid #d00000",
      padding: "10px 60px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px",
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
        <span style={{ color: "#d00000", fontWeight: 800, fontSize: "11px", letterSpacing: "0.12em", flexShrink: 0 }}>
          📢 ANNOUNCEMENT
        </span>
        <span style={{ fontSize: "13px", color: "#ccc", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {announcement.content}
        </span>
      </div>
      <button
        onClick={dismiss}
        style={{ background: "transparent", border: "none", color: "#555", cursor: "pointer", fontSize: "20px", lineHeight: 1, padding: "0 4px", flexShrink: 0, fontFamily: "'Inter', sans-serif" }}
        onMouseEnter={e => e.currentTarget.style.color = "#d00000"}
        onMouseLeave={e => e.currentTarget.style.color = "#555"}
        aria-label="Dismiss announcement"
      >×</button>
    </div>
  )
}
