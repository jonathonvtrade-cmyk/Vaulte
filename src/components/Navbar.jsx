import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"
import VerifiedBadge from "./VerifiedBadge"

const navLinks = [
  { label: "Explore",   to: "/explore"   },
  { label: "Roadmap",   to: "/roadmap"   },
  { label: "Community", to: "/community" },
  { label: "Pricing",   to: "/pricing"   },
]

function initials(first, last) {
  return ((first?.[0] || "") + (last?.[0] || "")).toUpperCase() || "?"
}

export default function Navbar() {
  const navigate              = useNavigate()
  const channelRef            = useRef(null)
  const [user,         setUser]         = useState(null)
  const [profile,      setProfile]      = useState(null)
  const [onlineCount,  setOnlineCount]  = useState(1)

  /* ── Auth + profile ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) fetchProfile(u.id)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) fetchProfile(u.id)
      else   setProfile(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  /* ── Supabase Realtime presence ── */
  useEffect(() => {
    const channel = supabase.channel("vaulte-online", {
      config: { presence: { key: Math.random().toString(36).slice(2) } },
    })

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState()
        setOnlineCount(Math.max(1, Object.keys(state).length))
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: Date.now() })
        }
      })

    channelRef.current = channel

    /* Re-read count every 5 s */
    const interval = setInterval(() => {
      const state = channel.presenceState()
      setOnlineCount(Math.max(1, Object.keys(state).length))
    }, 5000)

    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchProfile = async (uid) => {
    const { data } = await supabase
      .from("profiles")
      .select("first_name, last_name, plan, avatar_url, role")
      .eq("id", uid)
      .single()
    setProfile(data)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  const firstName  = profile?.first_name || user?.user_metadata?.first_name || ""
  const lastName   = profile?.last_name  || user?.user_metadata?.last_name  || ""
  const plan       = profile?.plan       ?? "free"
  const role       = profile?.role       ?? "user"
  const avatarUrl  = profile?.avatar_url ?? null
  const isVerified = role === "admin" || role === "founder"

  return (
    <div
      className="m-navbar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 60px",
        borderBottom: "1px solid #1a1a1a",
        background: "#0d0d0d",
        fontFamily: "'Inter', sans-serif",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* ── Logo ── */}
      <Link to="/" style={{ textDecoration: "none" }}>
        <div className="logo-flicker" style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "-1px", color: "white" }}>
          VAULT<span className="logo-neon-e" style={{ color: "#d00000" }}>E</span>
        </div>
      </Link>

      {/* ── Desktop nav ── */}
      <div className="m-nav-links" style={{ display: "flex", gap: "24px", fontSize: "13px", alignItems: "center" }}>

        {navLinks.map(({ label, to }) => (
          <Link key={label} to={to}
            style={{ color: "#666", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#d00000"}
            onMouseLeave={e => e.currentTarget.style.color = "#666"}
          >{label}</Link>
        ))}

        {/* Ask AI glow link */}
        <Link
          to="/mentor"
          className="ask-ai-link"
          style={{ color: "#0088ff", textDecoration: "none", fontWeight: 800, fontSize: "13px" }}
          onMouseEnter={e => e.currentTarget.style.color = "#44aaff"}
          onMouseLeave={e => e.currentTarget.style.color = "#0088ff"}
        >Ask AI</Link>

        {/* ── Live online counter ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginLeft: "4px" }}>
          <div style={{
            width: "7px", height: "7px", borderRadius: "50%", background: "#00cc66",
            animation: "online-dot 2s ease-in-out infinite",
          }} />
          <span style={{ fontSize: "12px", color: "#444", fontWeight: 600, whiteSpace: "nowrap" }}>
            {onlineCount} online
          </span>
        </div>

        {user ? (
          <>
            {/* Avatar + name */}
            <Link
              to="/profile"
              style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}
            >
              {/* Avatar circle */}
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid #d00000" }}
                />
              ) : (
                <div style={{
                  width: "30px", height: "30px", borderRadius: "50%",
                  background: "#1a0000", border: "1.5px solid #d00000",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "11px", fontWeight: 900, color: "#d00000",
                }}>
                  {initials(firstName, lastName)}
                </div>
              )}
              {/* Name */}
              <span style={{ color: "#aaa", fontSize: "13px", fontWeight: 700, transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "white"}
                onMouseLeave={e => e.currentTarget.style.color = "#aaa"}
              >Hey, {firstName || "there"}</span>
              {/* Verified badge */}
              {isVerified && <VerifiedBadge size={16} />}
            </Link>

            {/* Upgrade — free only */}
            {plan === "free" && (
              <Link to="/pricing"
                style={{ display: "inline-block", background: "#d00000", color: "white", padding: "7px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: 900, textDecoration: "none", transition: "opacity 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >Upgrade</Link>
            )}

            {/* Log out */}
            <button onClick={handleLogout}
              style={{ background: "transparent", border: "1px solid #333", padding: "7px 14px", borderRadius: "6px", color: "#aaa", fontSize: "13px", fontFamily: "'Inter', sans-serif", cursor: "pointer", transition: "border-color 0.2s, color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#d00000"; e.currentTarget.style.color = "white" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#333";    e.currentTarget.style.color = "#aaa"  }}
            >Log out</button>
          </>
        ) : (
          <>
            <Link to="/login"
              style={{ display: "inline-block", border: "1px solid #333", padding: "7px 16px", borderRadius: "6px", color: "#aaa", fontSize: "13px", textDecoration: "none", transition: "border-color 0.2s, color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#d00000"; e.currentTarget.style.color = "white" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#333";    e.currentTarget.style.color = "#aaa"  }}
            >Login</Link>
            <Link to="/signup"
              style={{ display: "inline-block", background: "#d00000", color: "white", padding: "7px 20px", borderRadius: "6px", fontSize: "13px", fontWeight: 800, textDecoration: "none", transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >Join free</Link>
          </>
        )}
      </div>

      {/* ── Mobile ── */}
      {user ? (
        <button className="m-nav-join" onClick={handleLogout}
          style={{ display: "none", background: "transparent", border: "1px solid #333", color: "#aaa", padding: "8px 14px", borderRadius: "6px", fontSize: "13px", fontFamily: "'Inter', sans-serif", cursor: "pointer" }}
        >Log out</button>
      ) : (
        <Link to="/signup" className="m-nav-join"
          style={{ display: "none", background: "#d00000", color: "white", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: 800, textDecoration: "none" }}
        >Join free</Link>
      )}
    </div>
  )
}
