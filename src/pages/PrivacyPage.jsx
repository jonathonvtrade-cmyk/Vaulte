import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const NeonDivider = () => (
  <div style={{ width: "100%", height: "1px", background: "#d00000", boxShadow: "0 0 10px rgba(208,0,0,0.7), 0 0 20px rgba(208,0,0,0.3)" }} />
)

const sections = [
  {
    title: "Information We Collect",
    body: [
      "When you create a Vaulte account, we collect your name, email address, and password. We also collect profile information you voluntarily provide such as a biography, social links, and avatar photo.",
      "We automatically collect usage data including pages visited, features used, AI messages sent, roadmap progress, and community activity. This data helps us improve the platform and personalise your experience.",
      "We may collect technical information such as your IP address, browser type, operating system, and device identifiers for security and analytics purposes.",
    ],
  },
  {
    title: "How We Use Your Information",
    body: [
      "We use your information to provide, maintain, and improve the Vaulte platform — including delivering AI mentor responses, tracking your roadmap progress, and personalising your experience.",
      "We may use your email address to send you important account notifications, platform updates, and optional marketing communications. You can opt out of marketing emails at any time from your profile settings.",
      "We analyse aggregated usage data to understand how users interact with the platform and to develop new features. This data is anonymised and never sold to third parties.",
    ],
  },
  {
    title: "Data Storage and Security",
    body: [
      "Your data is stored securely on Supabase infrastructure, which uses industry-standard encryption at rest and in transit. All connections to the platform are encrypted via HTTPS/TLS.",
      "We implement access controls to ensure only authorised personnel can access user data. Your password is never stored in plain text — it is hashed using bcrypt before storage.",
      "In the event of a data breach that affects your personal information, we will notify you via email within 72 hours of becoming aware of the incident.",
    ],
  },
  {
    title: "Cookies",
    body: [
      "Vaulte uses cookies and similar technologies to keep you logged in, remember your preferences, and analyse usage patterns. Session cookies are deleted when you close your browser; persistent cookies remain for up to 12 months.",
      "You can manage or disable cookies through your browser settings. Note that disabling certain cookies may affect the functionality of the platform, including your ability to stay logged in.",
    ],
  },
  {
    title: "Third Party Services",
    body: [
      "We use Supabase for authentication, database, and file storage. We use Anthropic's API to power AI mentor functionality. These providers process data on our behalf under their own privacy policies.",
      "We do not sell, rent, or trade your personal information to third parties for their marketing purposes. Any data shared with service providers is strictly for operating the platform.",
    ],
  },
  {
    title: "Your Rights",
    body: [
      "You have the right to access, correct, or delete your personal information at any time. You can update most of your profile information directly from the Profile page.",
      "You may request a complete export of your data or permanent account deletion by contacting us at support@vaulte.co. We will fulfil your request within 30 days.",
      "If you are located in the EU or UK, you have additional rights under GDPR including the right to data portability and the right to lodge a complaint with your local data protection authority.",
    ],
  },
  {
    title: "Contact Us",
    body: [
      "If you have any questions about this Privacy Policy or how we handle your data, please contact us at support@vaulte.co or through the Contact page on our website.",
      "We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on the platform.",
    ],
  },
]

export default function PrivacyPage() {
  return (
    <div className="dot-bg" style={{ minHeight: "100vh", width: "100vw", maxWidth: "100%", fontFamily: "'Inter', sans-serif", color: "white", overflowX: "hidden" }}>
      <Navbar />
      <NeonDivider />

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ display: "inline-block", background: "#1a0000", color: "#d00000", border: "1px solid #3a0000", padding: "5px 14px", borderRadius: "99px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "24px" }}>
          LEGAL
        </div>
        <h1 style={{ fontSize: "48px", fontWeight: 900, letterSpacing: "-2.5px", marginBottom: "12px", lineHeight: 1.1 }}>Privacy Policy</h1>
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
