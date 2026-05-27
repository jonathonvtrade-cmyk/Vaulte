import { useEffect, useState, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { supabase } from "../supabaseClient"

const ADMIN_EMAIL = "jonathon8604@gmail.com"

const NeonDivider = () => (
  <div style={{ width: "100%", height: "1px", background: "#d00000", boxShadow: "0 0 10px rgba(208,0,0,0.7), 0 0 20px rgba(208,0,0,0.3)" }} />
)

export default function AdminUsersPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [acting, setActing] = useState(null)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { navigate("/login"); return }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()
      if ((profile?.role !== "admin" && profile?.role !== "founder") || session.user.email !== ADMIN_EMAIL) { navigate("/"); return }
      await fetchUsers()
      setLoading(false)
    }
    init()
  }, [navigate])

  const fetchUsers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, niche, plan, role, banned, created_at")
      .order("created_at", { ascending: false })
    setUsers(data || [])
  }

  const handleAction = async (userId, action) => {
    if (acting === userId) return
    setActing(userId)
    let update = {}
    if (action === "ban")    update = { banned: true }
    if (action === "unban")  update = { banned: false }
    if (action === "pro")    update = { plan: "pro" }
    if (action === "free")   update = { plan: "free" }
    if (action === "admin")  update = { role: "admin" }
    if (action === "user")   update = { role: "user" }
    await supabase.from("profiles").update(update).eq("id", userId)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...update } : u))
    setActing(null)
  }

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    return (
      (u.first_name + " " + u.last_name).toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.niche || "").toLowerCase().includes(q) ||
      (u.role || "").toLowerCase().includes(q)
    )
  })

  if (loading) return (
    <div className="dot-bg" style={{ minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#444" }}>Loading users…</p>
    </div>
  )

  const tdStyle = { padding: "12px 16px", fontSize: "13px", color: "#777", borderBottom: "1px solid #111", verticalAlign: "middle" }
  const thStyle = { padding: "10px 16px", fontSize: "11px", fontWeight: 700, color: "#444", letterSpacing: "0.08em", textAlign: "left", borderBottom: "1px solid #1a1a1a", textTransform: "uppercase", whiteSpace: "nowrap" }

  const ActionBtn = ({ label, color, onClick, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: "none", border: `1px solid ${color}`, color, padding: "4px 10px",
        borderRadius: "6px", fontSize: "11px", fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "'Inter', sans-serif", opacity: disabled ? 0.5 : 1, whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  )

  return (
    <div className="dot-bg" style={{ minHeight: "100vh", width: "100vw", maxWidth: "100%", fontFamily: "'Inter', sans-serif", color: "white", overflowX: "hidden" }}>
      <Navbar />
      <NeonDivider />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 40px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "40px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <Link to="/admin" style={{ fontSize: "13px", color: "#444", textDecoration: "none", fontWeight: 600 }}>← Admin</Link>
            </div>
            <div style={{ display: "inline-block", background: "#1a0000", color: "#d00000", border: "1px solid #3a0000", padding: "5px 14px", borderRadius: "99px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "12px" }}>
              ADMIN
            </div>
            <h1 style={{ fontSize: "36px", fontWeight: 900, letterSpacing: "-1.8px", margin: 0 }}>
              Manage Users
              <span style={{ fontSize: "18px", fontWeight: 500, color: "#444", marginLeft: "12px", letterSpacing: 0 }}>
                ({users.length} total)
              </span>
            </h1>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: "24px" }}>
          <input
            type="text"
            placeholder="Search by name, email, niche or role…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", maxWidth: "400px", background: "#0d0d0d", border: "1px solid #1f1f1f",
              color: "white", padding: "10px 16px", borderRadius: "10px", fontSize: "14px",
              outline: "none", fontFamily: "'Inter', sans-serif", boxSizing: "border-box",
            }}
            onFocus={e => e.target.style.borderColor = "#d00000"}
            onBlur={e => e.target.style.borderColor = "#1f1f1f"}
          />
        </div>

        {/* Table */}
        <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "16px", overflow: "hidden", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "780px" }}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Niche</th>
                <th style={thStyle}>Plan</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Joined</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ ...tdStyle, textAlign: "center", padding: "28px" }}>No users found.</td></tr>
              )}
              {filtered.map(u => (
                <tr key={u.id} style={{ opacity: u.banned ? 0.5 : 1 }}>
                  <td style={tdStyle}>{u.first_name} {u.last_name}</td>
                  <td style={{ ...tdStyle, maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email || "—"}</td>
                  <td style={tdStyle}>{u.niche || "—"}</td>
                  <td style={tdStyle}>
                    <span style={{
                      background: u.plan === "pro" ? "#1a0000" : "#111",
                      color: u.plan === "pro" ? "#d00000" : "#555",
                      border: `1px solid ${u.plan === "pro" ? "#3a0000" : "#1a1a1a"}`,
                      padding: "2px 8px", borderRadius: "99px", fontSize: "11px", fontWeight: 700,
                    }}>
                      {(u.plan || "free").toUpperCase()}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      background: u.role === "admin" || u.role === "founder" ? "#0a1a0a" : "#111",
                      color: u.role === "admin" || u.role === "founder" ? "#00cc66" : "#555",
                      border: `1px solid ${u.role === "admin" || u.role === "founder" ? "#003322" : "#1a1a1a"}`,
                      padding: "2px 8px", borderRadius: "99px", fontSize: "11px", fontWeight: 700,
                    }}>
                      {(u.role || "user").toUpperCase()}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {u.banned
                      ? <span style={{ color: "#d00000", fontSize: "11px", fontWeight: 700 }}>BANNED</span>
                      : <span style={{ color: "#00cc66", fontSize: "11px", fontWeight: 700 }}>ACTIVE</span>
                    }
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {u.banned
                        ? <ActionBtn label="Unban" color="#00cc66" onClick={() => handleAction(u.id, "unban")} disabled={acting === u.id} />
                        : <ActionBtn label="Ban" color="#d00000" onClick={() => handleAction(u.id, "ban")} disabled={acting === u.id} />
                      }
                      {u.plan !== "pro"
                        ? <ActionBtn label="→ Pro" color="#d00000" onClick={() => handleAction(u.id, "pro")} disabled={acting === u.id} />
                        : <ActionBtn label="→ Free" color="#555" onClick={() => handleAction(u.id, "free")} disabled={acting === u.id} />
                      }
                      {u.role !== "admin" && u.role !== "founder"
                        ? <ActionBtn label="→ Admin" color="#d00000" onClick={() => handleAction(u.id, "admin")} disabled={acting === u.id} />
                        : u.role !== "founder"
                          ? <ActionBtn label="→ User" color="#555" onClick={() => handleAction(u.id, "user")} disabled={acting === u.id} />
                          : null
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NeonDivider />
      <Footer />
    </div>
  )
}
