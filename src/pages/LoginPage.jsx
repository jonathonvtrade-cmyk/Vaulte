import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
import MessageBubble from "../components/MessageBubble"
import { supabase } from "../supabaseClient"

const inputStyle = {
  width: "100%", background: "#0d0d0d", border: "1px solid #1f1f1f", color: "white",
  padding: "14px 16px", borderRadius: "10px", fontSize: "14px", outline: "none",
  fontFamily: "'Inter', sans-serif", boxSizing: "border-box", transition: "border-color 0.2s",
}
const labelStyle = {
  fontSize: "11px", fontWeight: 700, color: "#555", display: "block",
  marginBottom: "8px", letterSpacing: "0.1em",
}

export default function LoginPage() {
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [error,    setError]    = useState("")
  const [loading,  setLoading]  = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else navigate("/")
  }

  return (
    <div className="page-enter dot-bg" style={{ minHeight: "100vh", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <Link to="/" style={{ textDecoration: "none", marginBottom: "36px" }}>
          <div style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-1.5px", color: "white" }}>
            VAULT<span style={{ color: "#d00000" }}>E</span>
          </div>
        </Link>

        <div style={{
          background: "#111", border: "1px solid #1f1f1f", borderTop: "3px solid #d00000",
          borderRadius: "20px", padding: "40px", width: "100%", maxWidth: "420px",
          animation: "card-shimmer 3s ease-in-out infinite",
        }}>
          <h1 style={{ fontSize: "26px", fontWeight: 900, letterSpacing: "-1px", color: "white", marginBottom: "6px" }}>Welcome back.</h1>
          <p style={{ fontSize: "14px", color: "#555", marginBottom: "32px" }}>Sign in to your Vaulte account.</p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={labelStyle}>EMAIL</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#d00000"} onBlur={e => e.target.style.borderColor = "#1f1f1f"} />
            </div>
            <div>
              <label style={labelStyle}>PASSWORD</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#d00000"} onBlur={e => e.target.style.borderColor = "#1f1f1f"} />
            </div>

            {error && (
              <div style={{ background: "#1a0000", border: "1px solid #3a0000", color: "#d00000", fontSize: "13px", padding: "12px 16px", borderRadius: "10px", lineHeight: "1.5" }}>{error}</div>
            )}

            <button type="submit" disabled={loading}
              style={{ background: "#d00000", color: "white", border: "none", padding: "16px", borderRadius: "10px", fontSize: "15px", fontWeight: 900, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Inter', sans-serif", opacity: loading ? 0.7 : 1, transition: "opacity 0.2s", marginTop: "4px" }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.85" }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = "1"    }}>
              {loading ? "Signing in…" : "Login →"}
            </button>
          </form>

          <p style={{ fontSize: "13px", color: "#444", textAlign: "center", marginTop: "28px" }}>
            Don&apos;t have an account?{" "}
            <Link to="/signup" style={{ color: "#d00000", textDecoration: "none", fontWeight: 700 }}>Sign up free</Link>
          </p>
        </div>
      </div>

      <Footer />
      <MessageBubble />
    </div>
  )
}
