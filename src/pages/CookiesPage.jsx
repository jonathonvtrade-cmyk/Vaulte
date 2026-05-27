import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const NeonDivider = () => (
  <div style={{ width: "100%", height: "1px", background: "#d00000", boxShadow: "0 0 10px rgba(208,0,0,0.7), 0 0 20px rgba(208,0,0,0.3)" }} />
)

const sections = [
  {
    title: "What Are Cookies",
    body: [
      "Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently, to remember your preferences, and to provide information to website owners.",
      "Cookies can be 'session cookies' which are deleted when you close your browser, or 'persistent cookies' which remain on your device for a set period of time or until you delete them.",
    ],
  },
  {
    title: "How We Use Cookies",
    body: [
      "Vaulte uses cookies to keep you logged in between sessions, remember your display preferences, and ensure the platform works correctly across pages.",
      "We also use cookies to understand how users interact with Vaulte — for example, which features are used most often and how users navigate between sections. This helps us improve the platform over time.",
      "We do not use cookies to serve third-party advertising or to track you across other websites.",
    ],
  },
  {
    title: "Types of Cookies We Use",
    body: [
      "Essential cookies: These are required for the platform to function. They enable core features like authentication, session management, and security. These cannot be disabled without breaking the platform.",
      "Preference cookies: These store your settings and preferences such as your chosen niche, theme, and notification options so you don't have to re-enter them each visit.",
      "Analytics cookies: These collect anonymised data about how you use the platform — such as which pages you visit and how long you spend on them. This data is aggregated and never linked to you personally.",
    ],
  },
  {
    title: "Managing Cookies",
    body: [
      "You can control and manage cookies through your browser settings. Most browsers allow you to view, delete, and block cookies from specific websites or all websites.",
      "Please note that disabling essential cookies will prevent you from logging in and using core features of the Vaulte platform. Disabling preference or analytics cookies will not break the platform but may reduce the quality of your experience.",
      "For instructions on managing cookies in your specific browser, visit the browser's help documentation or a resource like www.allaboutcookies.org.",
    ],
  },
  {
    title: "Updates to This Policy",
    body: [
      "We may update this Cookie Policy from time to time to reflect changes in the platform or applicable law. We will notify you of significant changes via email or a prominent notice on the platform.",
      "If you have any questions about our use of cookies, please contact us at support@vaulte.co or through the Contact page on our website.",
    ],
  },
]

export default function CookiesPage() {
  return (
    <div className="dot-bg" style={{ minHeight: "100vh", width: "100vw", maxWidth: "100%", fontFamily: "'Inter', sans-serif", color: "white", overflowX: "hidden" }}>
      <Navbar />
      <NeonDivider />

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ display: "inline-block", background: "#1a0000", color: "#d00000", border: "1px solid #3a0000", padding: "5px 14px", borderRadius: "99px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "24px" }}>
          LEGAL
        </div>
        <h1 style={{ fontSize: "48px", fontWeight: 900, letterSpacing: "-2.5px", marginBottom: "12px", lineHeight: 1.1 }}>Cookie Policy</h1>
        <p style={{ fontSize: "13px", color: "#444", marginBottom: "56px" }}>Last updated: January 2025</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          {sections.map((s, i) => (
            <div key={i}>
              <NeonDivider />
              <h2 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px", margin: "32px 0 16px", color: "white" }}>{s.title}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {s.body.map((p, j) => (
                  <p key={j} style={{ fontSize: "15px", color: "#777", lineHeight: "1.8", margin: 0 }}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <NeonDivider />
      <Footer />
    </div>
  )
}
