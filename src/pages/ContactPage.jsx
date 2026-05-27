import { useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { supabase } from "../supabaseClient"

const NeonDivider = () => (
  <div style={{ width: "100%", height: "1px", background: "#d00000", boxShadow: "0 0 10px rgba(208,0,0,0.7), 0 0 20px rgba(208,0,0,0.3)" }} />
)

const inputStyle = {
  width: "100%", background: "#0d0d0d", border: "1px solid #1f1f1f", color: "white",
  padding: "12px 16px", borderRadius: "10px", fontSize: "14px", outline: "none",
  fontFamily: "'Inter', sans-serif", boxSizing: "border-box", transition: "border-color 0.2s",
}
const labelStyle = {
  fontSize: "11px", fontWeight: 700, color: "#555", display: "block",
  marginBottom: "8px", letterSpacing: "0.1em",
}

export default function ContactPage() {
  const [name,    setName]    = useState("")
  const [email,   setEmail]   = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(""); setSending(true)
    try {
      const { error: err } = await supabase.from("contact_submissions").insert({
        name: name.trim(), email: email.trim(),
        subject: subject.trim(), message: message.trim(),
      })
      if (err) throw err
      setSuccess(true)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    }
    setSending(false)
  }

  return (
    <div className="dot-bg" style={{ minHeight: "100vh", width: "100vw", maxWidth: "100%", fontFamily: "'Inter', sans-serif", color: "white", overflowX: "hidden" }}>
      <Navbar />
      <NeonDivider />

      <div style={{ maxWidth: "580px", margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ display: "inline-block", background: "#1a0000", color: "#d00000", border: "1px solid #3a0000", padding: "5px 14px", borderRadius: "99px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "24px" }}>
          CONTACT
        </div>
        <h1 style={{ fontSize: "42px", fontWeight: 900, letterSpacing: "-2px", marginBottom: "12px", lineHeight: 1.1 }}>
          Get in touch.
        </h1>
        <p style={{ fontSize: "15px", color: "#555", marginBottom: "48px", lineHeight: "1.7" }}>
          Have a question or need support? We&apos;re here to help.
        </p>

        {success ? (
          <div style={{ background: "#001a0d", border: "1px solid #003322", borderRadius: "16px", padding: "36px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>✅</div>
            <h2 style={{ fontSize: "22px", fontWeight: 900, marginBottom: "10px" }}>Message sent!</h2>
            <p style={{ fontSize: "14px", color: "#555", marginBottom: "24px" }}>
              We&apos;ll get back to you as soon as possible.
            </p>
            <Link to="/" style={{ display: "inline-block", background: "#d00000", color: "white", textDecoration: "none", padding: "12px 28px", borderRadius: "8px", fontSize: "14px", fontWeight: 800 }}>
              Back to home →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelStyle}>NAME</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Jake K." style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#d00000"} onBlur={e => e.target.style.borderColor = "#1f1f1f"} />
              </div>
              <div>
                <label style={labelStyle}>EMAIL</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#d00000"} onBlur={e => e.target.style.borderColor = "#1f1f1f"} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>SUBJECT</label>
              <input type="text" required value={subject} onChange={e => setSubject(e.target.value)} placeholder="How can we help?" style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#d00000"} onBlur={e => e.target.style.borderColor = "#1f1f1f"} />
            </div>
            <div>
              <label style={labelStyle}>MESSAGE</label>
              <textarea required value={message} onChange={e => setMessage(e.target.value)} placeholder="Tell us what's going on…"
                style={{ ...inputStyle, resize: "vertical", minHeight: "130px", lineHeight: "1.6" }}
                onFocus={e => e.target.style.borderColor = "#d00000"} onBlur={e => e.target.style.borderColor = "#1f1f1f"} />
            </div>

            {error && (
              <div style={{ background: "#1a0000", border: "1px solid #3a0000", color: "#d00000", fontSize: "13px", padding: "12px 16px", borderRadius: "10px" }}>{error}</div>
            )}

            <button type="submit" disabled={sending} style={{ background: "#d00000", color: "white", border: "none", padding: "16px", borderRadius: "10px", fontSize: "15px", fontWeight: 900, cursor: sending ? "not-allowed" : "pointer", fontFamily: "'Inter', sans-serif", opacity: sending ? 0.7 : 1, transition: "opacity 0.2s" }}>
              {sending ? "Sending…" : "Send message →"}
            </button>
          </form>
        )}
      </div>

      <NeonDivider />
      <Footer />
    </div>
  )
}
