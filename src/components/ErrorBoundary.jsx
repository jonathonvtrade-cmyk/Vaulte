import { Component } from "react"

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error("[Vaulte ErrorBoundary]", error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          background: "#0d0d0d",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Inter', sans-serif",
          color: "white",
          padding: "40px 20px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "-1.2px", marginBottom: "24px" }}>
            VAULT<span style={{ color: "#d00000" }}>E</span>
          </div>
          <div style={{
            background: "#111",
            border: "1px solid #1f1f1f",
            borderTop: "3px solid #d00000",
            borderRadius: "20px",
            padding: "40px",
            maxWidth: "480px",
            width: "100%",
          }}>
            <div style={{ fontSize: "32px", marginBottom: "16px" }}>⚠️</div>
            <h2 style={{ fontSize: "20px", fontWeight: 900, marginBottom: "10px", letterSpacing: "-0.5px" }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.7", marginBottom: "28px" }}>
              The page hit an unexpected error. Try refreshing — if the problem persists, clear your browser cache.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: "#d00000",
                color: "white",
                border: "none",
                padding: "12px 28px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 900,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Reload page
            </button>
            {this.state.error && (
              <details style={{ marginTop: "24px", textAlign: "left" }}>
                <summary style={{ fontSize: "12px", color: "#333", cursor: "pointer", marginBottom: "8px" }}>
                  Technical details
                </summary>
                <pre style={{
                  fontSize: "11px",
                  color: "#555",
                  background: "#0d0d0d",
                  padding: "12px",
                  borderRadius: "8px",
                  overflow: "auto",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
