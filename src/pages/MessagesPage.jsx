import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import MessageBubble from "../components/MessageBubble"
import { supabase } from "../supabaseClient"

const NICHES = ["Trading", "Dropshipping", "Freelancing", "Content Creation", "Affiliate Marketing", "AI Tools"]

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

function Avatar({ name, avatarUrl, size = 40 }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
      />
    )
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: avatarColor(name),
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: Math.round(size * 0.35), fontWeight: 800, color: "white",
    }}>
      {initials(name)}
    </div>
  )
}

export default function MessagesPage() {
  const navigate  = useNavigate()
  const [user,         setUser]         = useState(null)
  const [userProfile,  setUserProfile]  = useState(null)
  const [messages,     setMessages]     = useState([])
  const [selectedMsg,  setSelectedMsg]  = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [showCompose,  setShowCompose]  = useState(false)

  /* Compose fields */
  const [toSearch,      setToSearch]      = useState("")
  const [toUser,        setToUser]        = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [subject,       setSubject]       = useState("")
  const [niche,         setNiche]         = useState(NICHES[0])
  const [body,          setBody]          = useState("")
  const [sending,       setSending]       = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) { navigate("/login"); return }
      setUser(session.user)
      await Promise.all([
        fetchProfile(session.user.id),
        fetchMessages(session.user.id),
      ])
      setLoading(false)
    })
  }, []) // eslint-disable-line

  const fetchProfile = async (uid) => {
    const { data } = await supabase.from("profiles").select("first_name, last_name, avatar_url").eq("id", uid).single()
    setUserProfile(data)
  }

  const fetchMessages = async (uid) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${uid},receiver_id.eq.${uid}`)
      .order("read",       { ascending: true  })
      .order("created_at", { ascending: false })
    setMessages(data || [])
  }

  const markAsRead = async (msgId) => {
    await supabase.from("messages").update({ read: true }).eq("id", msgId)
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, read: true } : m))
  }

  const handleSelectMsg = (msg) => {
    setSelectedMsg(msg)
    if (!msg.read && msg.receiver_id === user?.id) markAsRead(msg.id)
  }

  const searchUsers = async (query) => {
    if (!query.trim()) { setSearchResults([]); return }
    const { data } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, avatar_url")
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
      .neq("id", user?.id)
      .limit(5)
    setSearchResults(data || [])
  }

  const sendMessage = async () => {
    if (!toUser || !subject.trim() || !body.trim() || sending) return
    setSending(true)
    const myName  = `${userProfile?.first_name || ""} ${userProfile?.last_name || ""}`.trim() || "User"
    const theirName = `${toUser.first_name || ""} ${toUser.last_name || ""}`.trim() || "User"
    const { data, error } = await supabase.from("messages").insert({
      sender_id:     user.id,
      receiver_id:   toUser.id,
      sender_name:   myName,
      receiver_name: theirName,
      subject:       subject.trim(),
      niche,
      content:       body.trim(),
      read:          false,
    }).select().single()
    setSending(false)
    if (!error && data) {
      setMessages(prev => [data, ...prev])
      setShowCompose(false)
      setToUser(null); setToSearch(""); setSubject(""); setBody(""); setSearchResults([])
    }
  }

  if (loading) {
    return (
      <div className="dot-bg" style={{ minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
        <Navbar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 66px)", color: "#333", fontSize: "14px" }}>Loading…</div>
      </div>
    )
  }

  const myName = `${userProfile?.first_name || ""} ${userProfile?.last_name || ""}`.trim() || "Me"

  /* inline style helpers */
  const inputStyle = {
    width: "100%", background: "#0d0d0d", border: "1px solid #1f1f1f",
    borderRadius: "8px", padding: "10px 14px", color: "white",
    fontSize: "13px", outline: "none", fontFamily: "'Inter', sans-serif",
    boxSizing: "border-box",
  }
  const labelStyle = { fontSize: "11px", color: "#444", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.08em" }

  return (
    <div className="page-enter dot-bg" style={{ minHeight: "100vh", width: "100vw", maxWidth: "100%", fontFamily: "'Inter', sans-serif", color: "white", overflowX: "hidden" }}>
      <Navbar />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 40px 80px", display: "flex", gap: "24px", minHeight: "calc(100vh - 260px)" }}>

        {/* ── Inbox list ── */}
        <div style={{ width: "340px", flexShrink: 0, background: "#111", border: "1px solid #1f1f1f", borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column" }}>

          {/* Header */}
          <div style={{ padding: "20px", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "16px", fontWeight: 900, letterSpacing: "-0.5px" }}>Inbox</div>
            <button
              onClick={() => setShowCompose(true)}
              style={{ background: "#d00000", color: "white", border: "none", padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 800, cursor: "pointer", fontFamily: "'Inter', sans-serif" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >+ New</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {messages.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "#333", fontSize: "13px", lineHeight: "1.7" }}>
                No messages yet.<br />Send one to get started!
              </div>
            ) : (
              messages.map(msg => {
                const isSender  = msg.sender_id === user?.id
                const otherName = isSender ? (msg.receiver_name || "User") : (msg.sender_name || "User")
                const isUnread  = !msg.read && !isSender
                const isSel     = selectedMsg?.id === msg.id
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMsg(msg)}
                    style={{
                      padding: "14px 18px", borderBottom: "1px solid #1a1a1a",
                      cursor: "pointer",
                      background: isSel ? "#1a0000" : isUnread ? "#0d0000" : "transparent",
                      borderLeft: `3px solid ${isSel ? "#d00000" : "transparent"}`,
                      transition: "background 0.2s",
                      display: "flex", gap: "10px", alignItems: "flex-start",
                    }}
                    onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = "#141414" }}
                    onMouseLeave={e => { e.currentTarget.style.background = isSel ? "#1a0000" : isUnread ? "#0d0000" : "transparent" }}
                  >
                    <Avatar name={otherName} size={36} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "130px" }}>
                          {otherName}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                          {isUnread && <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#d00000" }} />}
                          <span style={{ fontSize: "10px", color: "#333" }}>{timeAgo(msg.created_at)}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: isUnread ? 700 : 500, color: isUnread ? "#aaa" : "#555", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {msg.subject}
                      </div>
                      <div style={{ fontSize: "11px", color: "#444", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {isSender ? "You: " : ""}{msg.content}
                      </div>
                      {msg.niche && (
                        <span style={{ display: "inline-block", marginTop: "4px", fontSize: "10px", background: "#1a0000", color: "#d00000", border: "1px solid #3a0000", padding: "1px 6px", borderRadius: "99px" }}>
                          {msg.niche}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* ── Conversation panel ── */}
        <div style={{ flex: 1, background: "#111", border: "1px solid #1f1f1f", borderRadius: "16px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {selectedMsg ? (
            <>
              {/* Header */}
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #1a1a1a" }}>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "white", marginBottom: "6px" }}>{selectedMsg.subject}</div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {selectedMsg.niche && (
                    <span style={{ fontSize: "11px", background: "#1a0000", color: "#d00000", border: "1px solid #3a0000", padding: "2px 8px", borderRadius: "99px" }}>
                      {selectedMsg.niche}
                    </span>
                  )}
                  <span style={{ fontSize: "11px", color: "#333" }}>{new Date(selectedMsg.created_at).toLocaleString()}</span>
                </div>
              </div>

              {/* Message body */}
              <div style={{ flex: 1, padding: "28px", overflowY: "auto" }}>
                <div style={{ display: "flex", gap: "14px" }}>
                  <Avatar
                    name={selectedMsg.sender_id === user?.id ? myName : (selectedMsg.sender_name || "User")}
                    size={44}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "12px" }}>
                      {selectedMsg.sender_id === user?.id ? "You" : (selectedMsg.sender_name || "User")}
                      <span style={{ fontSize: "12px", color: "#333", fontWeight: 400, marginLeft: "10px" }}>to {selectedMsg.receiver_id === user?.id ? "you" : (selectedMsg.receiver_name || "User")}</span>
                    </div>
                    <div style={{ fontSize: "14px", color: "#bbb", lineHeight: "1.7", background: "#0d0d0d", padding: "18px 20px", borderRadius: "12px", border: "1px solid #1a1a1a" }}>
                      {selectedMsg.content}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
              <div style={{ fontSize: "40px" }}>💬</div>
              <div style={{ fontSize: "14px", color: "#444" }}>Select a message to read it</div>
              <button
                onClick={() => setShowCompose(true)}
                style={{ marginTop: "8px", background: "#d00000", color: "white", border: "none", padding: "10px 24px", borderRadius: "8px", fontSize: "13px", fontWeight: 800, cursor: "pointer", fontFamily: "'Inter', sans-serif" }}
              >+ New Message</button>
            </div>
          )}
        </div>
      </div>

      {/* ── Compose modal ── */}
      {showCompose && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={e => { if (e.target === e.currentTarget) setShowCompose(false) }}
        >
          <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: "20px", padding: "32px", width: "480px", animation: "modal-in 0.25s ease" }}>
            <div style={{ fontSize: "18px", fontWeight: 900, marginBottom: "24px" }}>New Message</div>

            {/* To */}
            <div style={{ marginBottom: "16px", position: "relative" }}>
              <div style={labelStyle}>To</div>
              {toUser ? (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#0d0d0d", border: "1px solid #d00000", borderRadius: "8px", padding: "10px 14px" }}>
                  <Avatar name={`${toUser.first_name} ${toUser.last_name}`} avatarUrl={toUser.avatar_url} size={28} />
                  <span style={{ fontSize: "13px", color: "white", fontWeight: 700 }}>{toUser.first_name} {toUser.last_name}</span>
                  <button onClick={() => setToUser(null)} style={{ marginLeft: "auto", background: "transparent", border: "none", color: "#555", cursor: "pointer", fontSize: "18px", lineHeight: 1 }}>×</button>
                </div>
              ) : (
                <div style={{ position: "relative" }}>
                  <input
                    value={toSearch}
                    onChange={e => { setToSearch(e.target.value); searchUsers(e.target.value) }}
                    placeholder="Search by name…"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#d00000"}
                    onBlur={e => e.target.style.borderColor = "#1f1f1f"}
                  />
                  {searchResults.length > 0 && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#0d0d0d", border: "1px solid #1f1f1f", borderRadius: "8px", overflow: "hidden", zIndex: 10 }}>
                      {searchResults.map(u => (
                        <div
                          key={u.id}
                          onClick={() => { setToUser(u); setToSearch(""); setSearchResults([]) }}
                          style={{ padding: "10px 14px", cursor: "pointer", display: "flex", gap: "10px", alignItems: "center", transition: "background 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#1a1a1a"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <Avatar name={`${u.first_name} ${u.last_name}`} avatarUrl={u.avatar_url} size={28} />
                          <span style={{ fontSize: "13px", color: "white" }}>{u.first_name} {u.last_name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Subject */}
            <div style={{ marginBottom: "16px" }}>
              <div style={labelStyle}>Subject</div>
              <input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="What's this about?"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#d00000"}
                onBlur={e => e.target.style.borderColor = "#1f1f1f"}
              />
            </div>

            {/* Niche */}
            <div style={{ marginBottom: "16px" }}>
              <div style={labelStyle}>Niche tag</div>
              <select
                value={niche}
                onChange={e => setNiche(e.target.value)}
                style={{ ...inputStyle, color: "#aaa" }}
              >
                {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            {/* Body */}
            <div style={{ marginBottom: "24px" }}>
              <div style={labelStyle}>Message</div>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Write your message…"
                style={{ ...inputStyle, resize: "vertical", minHeight: "100px", lineHeight: "1.6" }}
                onFocus={e => e.target.style.borderColor = "#d00000"}
                onBlur={e => e.target.style.borderColor = "#1f1f1f"}
              />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowCompose(false)}
                style={{ background: "transparent", border: "1px solid #333", color: "#aaa", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}
              >Cancel</button>
              <button
                onClick={sendMessage}
                disabled={!toUser || !subject.trim() || !body.trim() || sending}
                style={{
                  background: (!toUser || !subject.trim() || !body.trim()) ? "#330000" : "#d00000",
                  color: "white", border: "none", padding: "10px 28px", borderRadius: "8px",
                  fontSize: "13px", fontWeight: 800,
                  cursor: (!toUser || !subject.trim() || !body.trim()) ? "not-allowed" : "pointer",
                  fontFamily: "'Inter', sans-serif",
                  opacity: (!toUser || !subject.trim() || !body.trim()) ? 0.5 : 1,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => { if (toUser && subject.trim() && body.trim()) e.currentTarget.style.opacity = "0.85" }}
                onMouseLeave={e => { e.currentTarget.style.opacity = (!toUser || !subject.trim() || !body.trim()) ? "0.5" : "1" }}
              >
                {sending ? "Sending…" : "Send →"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <MessageBubble />
    </div>
  )
}
