import Navbar from "../components/Navbar"

export default function JoinPage() {
  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", width: "100vw", maxWidth: "100%", fontFamily: "'Inter', sans-serif", color: "white", overflowX: "hidden" }}>
      <Navbar />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 66px)" }}>
        <h1 style={{ fontSize: "52px", fontWeight: "900", letterSpacing: "-2.5px", color: "white" }}>
          Join free
        </h1>
      </div>
    </div>
  )
}
