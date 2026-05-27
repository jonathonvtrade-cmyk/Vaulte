import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const NeonDivider = () => (
  <div style={{ width: "100%", height: "1px", background: "#d00000", boxShadow: "0 0 10px rgba(208,0,0,0.7), 0 0 20px rgba(208,0,0,0.3)" }} />
)

const sections = [
  {
    title: "Acceptance of Terms",
    body: [
      "By accessing or using the Vaulte platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using the platform.",
      "We reserve the right to update these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify you of significant changes via email.",
    ],
  },
  {
    title: "Use of Service",
    body: [
      "Vaulte grants you a limited, non-exclusive, non-transferable, revocable licence to access and use the platform for your personal, non-commercial use, subject to these Terms.",
      "You agree to use the platform only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the platform. You must be at least 16 years old to use Vaulte.",
      "We reserve the right to modify, suspend, or discontinue any part of the service at any time, with or without notice, without liability to you.",
    ],
  },
  {
    title: "User Accounts",
    body: [
      "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorised use of your account.",
      "You agree to provide accurate, current, and complete information when creating your account and to update it as necessary. Accounts created with false information may be terminated without notice.",
    ],
  },
  {
    title: "Prohibited Conduct",
    body: [
      "You may not use Vaulte to harass, threaten, or harm others; post spam, malware, or illegal content; attempt to gain unauthorised access to the platform or other users' accounts; or engage in any activity that disrupts the service.",
      "You may not use automated tools, bots, or scrapers to access the platform or collect data without prior written permission. Reverse engineering or attempting to extract the source code of the platform is strictly prohibited.",
      "Violation of these prohibitions may result in immediate account suspension or permanent ban without refund.",
    ],
  },
  {
    title: "Intellectual Property",
    body: [
      "All content, features, and functionality of the Vaulte platform — including text, graphics, logos, and software — are owned by or licensed to Vaulte and are protected by intellectual property laws.",
      "You retain ownership of content you post on the platform (community posts, messages, etc.) but grant Vaulte a non-exclusive, royalty-free licence to display and distribute that content within the platform.",
    ],
  },
  {
    title: "Limitation of Liability",
    body: [
      "Vaulte is provided on an 'as is' and 'as available' basis without warranties of any kind. We do not warrant that the service will be uninterrupted, error-free, or free of viruses or harmful components.",
      "To the fullest extent permitted by law, Vaulte shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the platform.",
    ],
  },
  {
    title: "Termination",
    body: [
      "You may close your account at any time from the Settings section of your Profile page. Upon termination, your access to the platform will cease and we may delete your data in accordance with our Privacy Policy.",
      "We reserve the right to suspend or terminate your account at any time for violation of these Terms, abusive behaviour, or any other reason we deem appropriate, with or without prior notice.",
    ],
  },
  {
    title: "Governing Law",
    body: [
      "These Terms shall be governed by and construed in accordance with applicable law. Any disputes arising under these Terms shall be resolved through binding arbitration, except where prohibited by law.",
    ],
  },
  {
    title: "Contact",
    body: [
      "If you have any questions about these Terms, please contact us at support@vaulte.co or through the Contact page on our website.",
    ],
  },
]

export default function TermsPage() {
  return (
    <div className="dot-bg" style={{ minHeight: "100vh", width: "100vw", maxWidth: "100%", fontFamily: "'Inter', sans-serif", color: "white", overflowX: "hidden" }}>
      <Navbar />
      <NeonDivider />

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ display: "inline-block", background: "#1a0000", color: "#d00000", border: "1px solid #3a0000", padding: "5px 14px", borderRadius: "99px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "24px" }}>
          LEGAL
        </div>
        <h1 style={{ fontSize: "48px", fontWeight: 900, letterSpacing: "-2.5px", marginBottom: "12px", lineHeight: 1.1 }}>Terms of Service</h1>
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
