import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { supabase } from "../supabaseClient"

const ADMIN_EMAIL = "jonathonv.trade@gmail.com"

const NeonDivider = () => (
  <div style={{ width: "100%", height: "1px", background: "#d00000", boxShadow: "0 0 10px rgba(208,0,0,0.7), 0 0 20px rgba(208,0,0,0.3)" }} />
)

const StatCard = ({ label, value, sub }) => (
  <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "16px", padding: "28px 24px" }}>
    <p style={{ fontSize: "11px", fontWeight: 700, color: "#444", letterSpacing: "0.1em", margin: "0 0 10px", textTransform: "uppercase" }}>{label}</p>
    <p style={{ fontSize: "36px", fontWeight: 900, letterSpacing: "-1.5px", color: "#d00000", margin: "0 0 4px" }}>{value ?? "—"}</p>
    {sub && <p style={{ fontSize: "12px", color: "#333", margin: 0 }}>{sub}</p>}
  </div>
)

export default function AdminPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})
  const [recentUsers, setRecentUsers] = useState([])
  const [recentPosts, setRecentPosts] = useState([])

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { navigate("/login"); return }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()
      if ((profile?.role !== "admin" && profile?.role !== "founder") || session.user.email !== ADMIN_EMAIL) { navigate("/"); return }
      await loadData()
      setLoading(false)
    }
    init()
  }, [navigate])

  const loadData = async () => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const [
      { count: totalUsers },
      { count: newThisWeek },
      { count: totalPosts },
      { count: totalAI },
      { count: totalSteps },
      { data: nicheRows },
      { data: latestUsers },
      { data: latestPosts },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", oneWeekAgo),
      supabase.from("community_posts").select("*", { count: "exact", head: true }),
      supabase.from("ai_messages").select("*", { count: "exact", head: true }),
      supabase.from("roadmap_progress").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("niche").not("niche", "is", null),
      supabase.from("profiles").select("id, first_name, last_name, email, niche, plan, role, created_at").order("created_at", { ascending: false }).limit(10),
      supabase.from("community_posts").select("id, content, created_at, profiles(first_name, last_name)").order("created_at", { ascending: false }).limit(10),
    ])

    // Tally most popular niche
    let nicheCounts = {}
    for (const row of (nicheRows || [])) {
      if (row.niche) nicheCounts[row.niche] = (nicheCounts[row.niche] || 0) + 1
    }
    const topNiche = Object.entries(nicheCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—"

    setStats({ totalUsers, newThisWeek, totalPosts, totalAI, totalSteps, topNiche })
    setRecentUsers(latestUsers || [])
    setRecentPosts(latestPosts || [])
  }

  if (loading) return (
    <div className="dot-bg" style={{ minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#444" }}>Loading admin panel…</p>
    </div>
  )

  const tdStyle = { padding: "12px 16px", fontSize: "13px", color: "#777", borderBottom: "1px solid #111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px" }
  const thStyle = { padding: "10px 16px", fontSize: "11px", fontWeight: 700, color: "#444", letterSpacing: "0.08em", textAlign: "left", borderBottom: "1px solid #1a1a1a", textTransform: "uppercase" }

  return (
    <div className="dot-bg" style={{ minHeight: "100vh", width: "100vw", maxWidth: "100%", fontFamily: "'Inter', sans-serif", color: "white", overflowX: "hidden" }}>
      <Navbar />
      <NeonDivider />

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 40px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "48px" }}>
          <div>
            <div style={{ display: "inline-block", background: "#1a0000", color: "#d00000", border: "1px solid #3a0000", padding: "5px 14px", borderRadius: "99px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "16px" }}>
              ADMIN
            </div>
            <h1 style={{ fontSize: "40px", fontWeight: 900, letterSpacing: "-2px", margin: 0 }}>Analytics Dashboard</h1>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link to="/admin/users" style={{ background: "#111", color: "#d00000", border: "1px solid #1f1f1f", textDecoration: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 700 }}>
              Manage Users →
            </Link>
            <Link to="/admin/announce" style={{ background: "#d00000", color: "white", textDecoration: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 700 }}>
              Send Announcement →
            </Link>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "48px" }}>
          <StatCard label="Total Users" value={stats.totalUsers} />
          <StatCard label="New This Week" value={stats.newThisWeek} />
          <StatCard label="Total Posts" value={stats.totalPosts} />
          <StatCard label="AI Messages" value={stats.totalAI ?? "—"} />
          <StatCard label="Steps Completed" value={stats.totalSteps ?? "—"} />
          <StatCard label="Top Niche" value={stats.topNiche} />
        </div>

        {/* Recent signups */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Recent Signups</p>
            <Link to="/admin/users" style={{ fontSize: "12px", color: "#d00000", textDecoration: "none", fontWeight: 700 }}>View all →</Link>
          </div>
          <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "16px", overflow: "hidden", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "560px" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Niche</th>
                  <th style={thStyle}>Plan</th>
                  <th style={thStyle}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.length === 0 && (
                  <tr><td colSpan={5} style={{ ...tdStyle, textAlign: "center", padding: "24px" }}>No users yet.</td></tr>
                )}
                {recentUsers.map(u => (
                  <tr key={u.id}>
                    <td style={tdStyle}>{u.first_name} {u.last_name}</td>
                    <td style={tdStyle}>{u.email || "—"}</td>
                    <td style={tdStyle}>{u.niche || "—"}</td>
                    <td style={tdStyle}>
                      <span style={{ background: u.plan === "pro" ? "#1a0000" : "#111", color: u.plan === "pro" ? "#d00000" : "#555", border: `1px solid ${u.plan === "pro" ? "#3a0000" : "#1a1a1a"}`, padding: "2px 8px", borderRadius: "99px", fontSize: "11px", fontWeight: 700 }}>
                        {u.plan?.toUpperCase() || "FREE"}
                      </span>
                    </td>
                    <td style={tdStyle}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent posts */}
        <div>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>Recent Community Posts</p>
          <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "16px", overflow: "hidden", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "480px" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Author</th>
                  <th style={{ ...thStyle, width: "55%" }}>Post</th>
                  <th style={thStyle}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.length === 0 && (
                  <tr><td colSpan={3} style={{ ...tdStyle, textAlign: "center", padding: "24px" }}>No posts yet.</td></tr>
                )}
                {recentPosts.map(p => (
                  <tr key={p.id}>
                    <td style={tdStyle}>{p.profiles?.first_name} {p.profiles?.last_name}</td>
                    <td style={{ ...tdStyle, maxWidth: "380px" }}>{p.content?.slice(0, 120)}{p.content?.length > 120 ? "…" : ""}</td>
                    <td style={tdStyle}>{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <NeonDivider />
      <Footer />
    </div>
  )
}
