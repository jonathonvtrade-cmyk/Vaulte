import { useState, useEffect, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import MessageBubble from "../components/MessageBubble"
import VerifiedBadge from "../components/VerifiedBadge"
import { supabase } from "../supabaseClient"

const ADMIN_EMAIL = "jonathonv.trade@gmail.com"

const nicheList  = ["Trading","Dropshipping","Freelancing","Content Creation","Affiliate Marketing","AI Tools"]
const nicheIcons = { Trading:"📈", Dropshipping:"📦", Freelancing:"💻", "Content Creation":"🎬", "Affiliate Marketing":"💰", "AI Tools":"🤖" }
const TOTAL_STEPS = 10

const PLATFORMS = ["Instagram","TikTok","Twitter","YouTube","GitHub","Other"]
const PLATFORM_ICONS = { Instagram:"📷", TikTok:"🎵", Twitter:"🐦", YouTube:"▶️", GitHub:"💻", Other:"🔗" }

const sidebarSections = ["Overview","My Roadmap","AI Mentor","Community","Messages","About","Settings","Billing"]

function Toggle({ checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)} style={{
      width:"44px",height:"24px",borderRadius:"99px",position:"relative",cursor:"pointer",
      background: checked ? "#d00000" : "#1a1a1a",
      border:`1.5px solid ${checked?"#d00000":"#2a2a2a"}`,
      transition:"all 0.25s ease",flexShrink:0,
    }}>
      <div style={{
        position:"absolute",top:"2px",
        left: checked ? "22px" : "2px",
        width:"16px",height:"16px",borderRadius:"50%",
        background:"white",transition:"left 0.25s ease",
      }} />
    </div>
  )
}

export default function ProfilePage() {
  const navigate     = useNavigate()
  const fileRef      = useRef(null)

  /* ── Core state ── */
  const [user,          setUser]          = useState(null)
  const [profile,       setProfile]       = useState(null)
  const [progress,      setProgress]      = useState({})
  const [settings,      setSettings]      = useState({ email_notifications:true, roadmap_reminders:true, public_profile:true })
  const [todayMsgs,     setTodayMsgs]     = useState(0)
  const [totalMsgs,     setTotalMsgs]     = useState(0)
  const [communityCount,setCommunityCount] = useState(0)
  const [activeSection, setActiveSection] = useState("Overview")
  const [barVisible,    setBarVisible]    = useState(false)
  const [loading,       setLoading]       = useState(true)

  /* Roadmap section */
  const [selectedNiche, setSelectedNiche] = useState("Trading")
  const [nicheProgress, setNicheProgress] = useState({})

  /* Community section */
  const [communityPosts, setCommunityPosts] = useState([])

  /* About / edit section */
  const [editMode,       setEditMode]      = useState(false)
  const [editBio,        setEditBio]       = useState("")
  const [editSocials,    setEditSocials]   = useState([{ platform:"Instagram", username:"" },{ platform:"TikTok", username:"" },{ platform:"Twitter", username:"" }])
  const [saveLoading,    setSaveLoading]   = useState(false)
  const [uploading,      setUploading]     = useState(false)
  const [photoPreview,   setPhotoPreview]  = useState(null)

  /* Name edit */
  const [editingName,    setEditingName]   = useState(false)
  const [editFirstName,  setEditFirstName] = useState("")
  const [editLastName,   setEditLastName]  = useState("")
  const [nameSaving,     setNameSaving]    = useState(false)

  /* Admin panel */
  const [showAnnounce,    setShowAnnounce]    = useState(false)
  const [announceText,    setAnnounceText]    = useState("")
  const [sendingAnnounce, setSendingAnnounce] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) { navigate("/login"); return }
      const u = session.user
      setUser(u)
      await Promise.all([
        fetchProfile(u.id),
        fetchAllProgress(u.id),
        fetchSettings(u.id),
        fetchMessageStats(u.id),
        fetchCommunityCount(u.id),
      ])
      setLoading(false)
      setTimeout(() => setBarVisible(true), 150)
    })
  }, []) // eslint-disable-line

  /* ── Fetchers ── */
  const fetchProfile = async (uid) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).single()
    setProfile(data)
    if (data?.bio)     setEditBio(data.bio)
    if (data?.socials) setEditSocials(data.socials.length === 3 ? data.socials : [
      ...data.socials,
      ...Array(3 - data.socials.length).fill({ platform:"Instagram", username:"" })
    ])
  }

  const fetchAllProgress = async (uid) => {
    const { data: rows } = await supabase.from("roadmap_progress").select("niche,step_index,completed").eq("user_id",uid)
    if (!rows) return
    const map = {}
    rows.forEach(r => { if(!map[r.niche]) map[r.niche]=0; if(r.completed) map[r.niche]++ })
    setProgress(map)
  }

  const fetchNicheDetail = async (uid, niche) => {
    const { data: rows } = await supabase.from("roadmap_progress").select("step_index,completed").eq("user_id",uid).eq("niche",niche)
    if (!rows) return
    const map = {}
    rows.forEach(r => { map[r.step_index] = r.completed })
    setNicheProgress(map)
  }

  const fetchSettings = async (uid) => {
    const { data } = await supabase.from("user_settings").select("*").eq("user_id",uid).single()
    if (data) setSettings({ email_notifications:data.email_notifications, roadmap_reminders:data.roadmap_reminders, public_profile:data.public_profile })
  }

  const fetchMessageStats = async (uid) => {
    const today = new Date().toISOString().slice(0,10)
    const { data: rows } = await supabase.from("message_counts").select("date,count").eq("user_id",uid)
    if (rows) {
      setTotalMsgs(rows.reduce((s,r)=>s+(r.count||0),0))
      setTodayMsgs(rows.find(r=>r.date===today)?.count??0)
    }
  }

  const fetchCommunityCount = async (uid) => {
    const { count } = await supabase.from("community_posts").select("id",{count:"exact"}).eq("user_id",uid)
    setCommunityCount(count??0)
  }

  const fetchCommunityPosts = async (uid) => {
    const { data } = await supabase.from("community_posts").select("niche,content,created_at").eq("user_id",uid).order("created_at",{ascending:false}).limit(10)
    setCommunityPosts(data??[])
  }

  /* ── Save actions ── */
  const saveSetting = async (key, val) => {
    if (!user) return
    const updated = { ...settings, [key]:val }
    setSettings(updated)
    await supabase.from("user_settings").upsert({ user_id:user.id, ...updated, updated_at:new Date().toISOString() },{ onConflict:"user_id" })
  }

  const saveAbout = async () => {
    if (!user) return
    setSaveLoading(true)
    const cleanSocials = editSocials.filter(s => s.username.trim())
    await supabase.from("profiles").update({ bio:editBio.trim(), socials:cleanSocials }).eq("id",user.id)
    setProfile(prev => ({ ...prev, bio:editBio.trim(), socials:cleanSocials }))
    setSaveLoading(false)
    setEditMode(false)
  }

  const uploadPhoto = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    // Validate type and size (max 2 MB)
    const allowed = ["image/jpeg","image/jpg","image/png","image/gif","image/webp"]
    if (!allowed.includes(file.type)) { alert("Please upload a JPG, PNG, GIF or WebP image."); return }
    if (file.size > 2 * 1024 * 1024) { alert("Image must be 2 MB or smaller."); return }
    // Show preview immediately
    const previewUrl = URL.createObjectURL(file)
    setPhotoPreview(previewUrl)
    setUploading(true)
    // Path inside the "avatars" bucket (no "avatars/" prefix — that IS the bucket name)
    const ext  = file.name.split(".").pop().toLowerCase()
    const path = `${user.id}/avatar.${ext}`
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert:true, contentType: file.type })
    if (!error) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path)
      const url = data.publicUrl + `?t=${Date.now()}` // cache-bust
      await supabase.from("profiles").update({ avatar_url:url }).eq("id",user.id)
      setProfile(prev => ({ ...prev, avatar_url:url }))
    } else {
      // Upload failed — clear preview
      setPhotoPreview(null)
      console.error("Avatar upload error:", error)
    }
    setUploading(false)
  }

  const saveName = async () => {
    if (!user || !editFirstName.trim()) return
    setNameSaving(true)
    await supabase.from("profiles").update({
      first_name: editFirstName.trim(),
      last_name:  editLastName.trim(),
      last_name_changed_at: new Date().toISOString(),
    }).eq("id", user.id)
    setProfile(prev => ({ ...prev, first_name: editFirstName.trim(), last_name: editLastName.trim(), last_name_changed_at: new Date().toISOString() }))
    setNameSaving(false)
    setEditingName(false)
  }

  const sendAnnouncement = async () => {
    if (!announceText.trim() || sendingAnnounce) return
    setSendingAnnounce(true)
    await supabase.from("announcements").insert({ content:announceText.trim(), created_by:user.id })
    setSendingAnnounce(false)
    setAnnounceText("")
    setShowAnnounce(false)
  }

  const handleSectionChange = (section) => {
    if (section === "My Roadmap") { navigate("/roadmap");    return }
    if (section === "AI Mentor")  { navigate("/mentor");     return }
    if (section === "Community")  { navigate("/community");  return }
    if (section === "Messages")   { navigate("/messages");   return }
    if (section === "Billing")    { navigate("/pricing");    return }
    setActiveSection(section)
  }

  const handleLogout = async () => { await supabase.auth.signOut(); navigate("/") }
  const deleteAccount = async () => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return
    await supabase.auth.signOut(); navigate("/")
  }

  if (loading) {
    return (
      <div className="dot-bg" style={{ minHeight:"100vh", fontFamily:"'Inter',sans-serif", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ color:"#333", fontSize:"14px" }}>Loading…</div>
      </div>
    )
  }

  /* ── Computed values ── */
  const firstName    = profile?.first_name || user?.user_metadata?.first_name || "User"
  const lastName     = profile?.last_name  || user?.user_metadata?.last_name  || ""
  const inits        = (firstName[0]+(lastName[0]||"")).toUpperCase()
  const plan         = profile?.plan   ?? "free"
  const role         = profile?.role   ?? "user"
  const avatarUrl    = profile?.avatar_url ?? null
  const isAdmin      = (role==="admin" || role==="founder") && user?.email === ADMIN_EMAIL
  const isVerified   = isAdmin
  const memberSince  = profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-US",{month:"long",year:"numeric"}) : "—"
  const daysActive   = profile?.created_at ? Math.max(1,Math.floor((Date.now()-new Date(profile.created_at))/86400000)) : 0
  const stepsCompleted = Object.values(progress).reduce((s,c)=>s+c,0)
  const activeNiches   = nicheList.filter(n=>(progress[n]??0)>0)
  const isPro          = plan==="pro"||plan==="team"

  /* Auto niche tags */
  const onboardingNiches = profile?.onboarding_answers?.mentors ?? []
  const displayNiches    = isAdmin ? nicheList : isPro ? activeNiches : onboardingNiches.slice(0,2)
  const totalSteps       = nicheList.length * TOTAL_STEPS
  const progressPercent  = totalSteps > 0 ? Math.round((stepsCompleted/totalSteps)*100) : 0

  const autoTags = [
    daysActive>7 ? { label:"🔥 Streak", color:"#ff6600", bg:"#1a0d00", border:"#4d2000" } : null,
    isPro        ? { label:"⭐ Pro",     color:"#d00000", bg:"#1a0000", border:"#3a0000" } : null,
    progressPercent>50 ? { label:"📈 Top 50%", color:"#00aa55", bg:"#001a0d", border:"#003322" } : null,
  ].filter(Boolean)

  /* ── Section renderers ── */
  const renderOverview = () => (
    <div>
      <h2 style={{ fontSize:"24px", fontWeight:900, letterSpacing:"-1px", marginBottom:"32px" }}>Overview</h2>

      {/* Admin panel */}
      {isAdmin && (
        <div style={{ background:"#001a00", border:"1px solid #003300", borderRadius:"16px", padding:"24px", marginBottom:"32px" }}>
          <div style={{ fontSize:"11px", fontWeight:700, color:"#00ff41", letterSpacing:"0.12em", marginBottom:"16px" }}>⚡ ADMIN PANEL</div>
          <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
            <Link to="/admin" style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"#d00000", color:"white", textDecoration:"none", padding:"10px 18px", borderRadius:"8px", fontSize:"13px", fontWeight:800, transition:"opacity 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.opacity="0.85"}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}
            >📊 Analytics</Link>
            <Link to="/admin/announce" style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"#d00000", color:"white", textDecoration:"none", padding:"10px 18px", borderRadius:"8px", fontSize:"13px", fontWeight:800, transition:"opacity 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.opacity="0.85"}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}
            >📢 Announce</Link>
            <Link to="/admin/users" style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"#d00000", color:"white", textDecoration:"none", padding:"10px 18px", borderRadius:"8px", fontSize:"13px", fontWeight:800, transition:"opacity 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.opacity="0.85"}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}
            >👥 Users</Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px", marginBottom:"40px" }}>
        {[
          { label:"Days active",      value:daysActive     },
          { label:"AI messages sent", value:totalMsgs      },
          { label:"Steps completed",  value:stepsCompleted },
          { label:"Community posts",  value:communityCount },
        ].map(s => (
          <div key={s.label} style={{ background:"#111", border:"1px solid #1f1f1f", borderRadius:"14px", padding:"20px" }}>
            <div style={{ fontSize:"32px", fontWeight:900, color:"white", letterSpacing:"-1.5px" }}>{s.value}</div>
            <div style={{ fontSize:"11px", color:"#444", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginTop:"4px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Niche progress */}
      <h3 style={{ fontSize:"11px", fontWeight:800, color:"#888", letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:"20px" }}>Niche Progress</h3>
      <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
        {nicheList.map(niche => {
          const done = progress[niche]??0
          const pct  = Math.round((done/TOTAL_STEPS)*100)
          return (
            <Link key={niche} to={`/niche/${encodeURIComponent(niche)}`} style={{ textDecoration:"none" }}>
              <div style={{ background:"#111", border:"1px solid #1f1f1f", borderRadius:"12px", padding:"16px 20px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
                  <span style={{ fontSize:"14px", fontWeight:700, color:"white" }}>{nicheIcons[niche]} {niche}</span>
                  <span style={{ fontSize:"12px", color:pct>0?"#d00000":"#444", fontWeight:700 }}>{pct}%</span>
                </div>
                <div style={{ background:"#1a1a1a", borderRadius:"99px", height:"4px", overflow:"hidden" }}>
                  <div style={{ height:"100%", background:"#d00000", borderRadius:"99px", width:barVisible?`${pct}%`:"0%", transition:"width 0.9s ease 0.1s" }} />
                </div>
                <div style={{ fontSize:"11px", color:"#333", marginTop:"6px" }}>{done}/{TOTAL_STEPS} steps</div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )

  const renderRoadmap = () => {
    const nicheStepData = {
      Trading:["Learn market concepts","Asset classes","Brokerage setup","Paper trading","Technical analysis","Risk management","Trading strategy","Real money trading","Performance review","Scale capital"],
      Dropshipping:["Choose niche","Product research","Shopify setup","Find suppliers","Product listings","Payment setup","First ad campaign","Analyse ads","Customer service","Scale winners"],
      Freelancing:["Define service","Build portfolio","Set up profiles","Set pricing","Send proposals","First project","Get reviews","Raise rates","Build pipeline","Scale with systems"],
      "Content Creation":["Choose niche","Pick platform","Equipment setup","First 10 pieces","Study analytics","Posting schedule","Community engagement","Apply for monetisation","First brand deal","Expand platforms"],
      "Affiliate Marketing":["Choose niche","Find programs","Create platform","20 pieces content","Drive traffic","Install tracking","Optimise content","Build email list","Negotiate rates","Scale traffic"],
      "AI Tools":["ChatGPT mastery","AI tool categories","First AI workflow","AI content","Automate task","Package prompts","Build AI product","Offer AI service","Track new releases","Scale AI income"],
    }
    const steps = nicheStepData[selectedNiche] || []
    return (
      <div>
        <h2 style={{ fontSize:"24px", fontWeight:900, letterSpacing:"-1px", marginBottom:"24px" }}>My Roadmap</h2>
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"28px" }}>
          {nicheList.map(n => (
            <button key={n} onClick={()=>{ setSelectedNiche(n); fetchNicheDetail(user.id,n) }} style={{
              padding:"6px 14px", borderRadius:"99px", fontSize:"12px", fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif",
              background:selectedNiche===n?"#1a0000":"#111", border:`1px solid ${selectedNiche===n?"#d00000":"#1f1f1f"}`,
              color:selectedNiche===n?"#d00000":"#555",
            }}>{nicheIcons[n]} {n}</button>
          ))}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
          {steps.map((step,i) => {
            const done = !!nicheProgress[i]
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:"12px", background:"#111", border:`1px solid ${done?"#d00000":"#1f1f1f"}`, borderRadius:"10px", padding:"12px 16px" }}>
                <div style={{ width:"20px", height:"20px", borderRadius:"6px", background:done?"#d00000":"#1a1a1a", border:`1.5px solid ${done?"#d00000":"#2a2a2a"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {done && <span style={{ color:"white", fontSize:"10px", fontWeight:900 }}>✓</span>}
                </div>
                <span style={{ fontSize:"13px", fontWeight:600, color:done?"#d00000":"#888", textDecoration:done?"line-through":"none" }}>{step}</span>
                <span style={{ marginLeft:"auto", fontSize:"11px", color:"#333" }}>Step {i+1}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderAIMentor = () => (
    <div>
      <h2 style={{ fontSize:"24px", fontWeight:900, letterSpacing:"-1px", marginBottom:"12px" }}>AI Mentor</h2>
      <p style={{ fontSize:"14px", color:"#555", marginBottom:"32px" }}>Jump into any niche and chat with your dedicated AI mentor.</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"14px" }}>
        {nicheList.map(n => (
          <Link key={n} to={`/niche/${encodeURIComponent(n)}`} style={{ textDecoration:"none" }}>
            <div style={{ background:"#111", border:"1px solid #1f1f1f", borderRadius:"14px", padding:"24px 20px", textAlign:"center", transition:"border-color 0.2s, transform 0.2s" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor="#d00000"; e.currentTarget.style.transform="translateY(-3px)" }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="#1f1f1f"; e.currentTarget.style.transform="translateY(0)" }}>
              <div style={{ fontSize:"32px", marginBottom:"10px" }}>{nicheIcons[n]}</div>
              <div style={{ fontSize:"13px", fontWeight:700, color:"white", marginBottom:"6px" }}>{n}</div>
              <div style={{ fontSize:"11px", color:"#d00000", fontWeight:700 }}>Chat →</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )

  const renderCommunity = () => (
    <div>
      <h2 style={{ fontSize:"24px", fontWeight:900, letterSpacing:"-1px", marginBottom:"12px" }}>Community Activity</h2>
      <p style={{ fontSize:"14px", color:"#555", marginBottom:"24px" }}>Your recent posts across all niches.</p>
      {communityPosts.length===0
        ? <p style={{ color:"#333", fontSize:"14px" }}>You haven&apos;t posted yet. Head to a niche page to join the conversation.</p>
        : communityPosts.map((post,i) => (
          <div key={i} style={{ background:"#111", border:"1px solid #1f1f1f", borderRadius:"12px", padding:"16px", marginBottom:"10px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
              <span style={{ fontSize:"11px", color:"#d00000", fontWeight:700 }}>{post.niche}</span>
              <span style={{ fontSize:"11px", color:"#333" }}>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            <p style={{ fontSize:"13px", color:"#888", lineHeight:"1.6", margin:0 }}>{post.content}</p>
          </div>
        ))}
    </div>
  )

  const renderAbout = () => {
    const bio     = profile?.bio     || ""
    const socials = profile?.socials || []
    return (
      <div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"28px" }}>
          <h2 style={{ fontSize:"24px", fontWeight:900, letterSpacing:"-1px" }}>About</h2>
          {!editMode ? (
            <button onClick={()=>setEditMode(true)} style={{ background:"transparent", border:"1px solid #333", color:"#aaa", padding:"8px 16px", borderRadius:"8px", fontSize:"13px", cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.2s" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor="#d00000"; e.currentTarget.style.color="white" }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="#333"; e.currentTarget.style.color="#aaa" }}
            >Edit</button>
          ) : (
            <div style={{ display:"flex", gap:"8px" }}>
              <button onClick={()=>setEditMode(false)} style={{ background:"transparent", border:"1px solid #333", color:"#aaa", padding:"8px 14px", borderRadius:"8px", fontSize:"12px", cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>Cancel</button>
              <button onClick={saveAbout} disabled={saveLoading} style={{ background:"#d00000", color:"white", border:"none", padding:"8px 18px", borderRadius:"8px", fontSize:"12px", fontWeight:800, cursor:"pointer", fontFamily:"'Inter',sans-serif", opacity:saveLoading?0.6:1 }}>
                {saveLoading?"Saving…":"Save"}
              </button>
            </div>
          )}
        </div>

        {/* Bio */}
        <div style={{ background:"#111", border:"1px solid #1f1f1f", borderRadius:"14px", padding:"24px", marginBottom:"20px" }}>
          <div style={{ fontSize:"11px", fontWeight:700, color:"#444", letterSpacing:"0.1em", marginBottom:"14px" }}>BIO</div>
          {editMode ? (
            <>
              <textarea
                value={editBio}
                onChange={e=>setEditBio(e.target.value.slice(0,200))}
                placeholder="Write a short bio about yourself…"
                style={{ width:"100%", background:"#0d0d0d", border:"1px solid #1f1f1f", color:"white", padding:"12px 14px", borderRadius:"8px", fontSize:"13px", outline:"none", fontFamily:"'Inter',sans-serif", boxSizing:"border-box", resize:"vertical", minHeight:"80px", lineHeight:"1.6" }}
                onFocus={e=>e.target.style.borderColor="#d00000"}
                onBlur={e=>e.target.style.borderColor="#1f1f1f"}
              />
              <div style={{ fontSize:"11px", color:"#333", marginTop:"6px", textAlign:"right" }}>{editBio.length}/200</div>
            </>
          ) : (
            <p style={{ fontSize:"14px", color:bio?"#888":"#444", lineHeight:"1.7", margin:0, fontStyle:bio?"normal":"italic" }}>
              {bio || "No bio yet."}
            </p>
          )}
        </div>

        {/* Socials */}
        <div style={{ background:"#111", border:"1px solid #1f1f1f", borderRadius:"14px", padding:"24px" }}>
          <div style={{ fontSize:"11px", fontWeight:700, color:"#444", letterSpacing:"0.1em", marginBottom:"16px" }}>SOCIALS</div>
          {editMode ? (
            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
              {editSocials.map((s,i) => (
                <div key={i} style={{ display:"flex", gap:"10px" }}>
                  <select
                    value={s.platform}
                    onChange={e=>{ const ns=[...editSocials]; ns[i]={...ns[i],platform:e.target.value}; setEditSocials(ns) }}
                    style={{ background:"#0d0d0d", border:"1px solid #1f1f1f", color:"#aaa", padding:"10px 12px", borderRadius:"8px", fontSize:"13px", fontFamily:"'Inter',sans-serif", outline:"none", flexShrink:0 }}
                  >
                    {PLATFORMS.map(p=><option key={p} value={p}>{p}</option>)}
                  </select>
                  <input
                    value={s.username}
                    onChange={e=>{ const ns=[...editSocials]; ns[i]={...ns[i],username:e.target.value}; setEditSocials(ns) }}
                    placeholder="Username or link"
                    style={{ flex:1, background:"#0d0d0d", border:"1px solid #1f1f1f", color:"white", padding:"10px 14px", borderRadius:"8px", fontSize:"13px", outline:"none", fontFamily:"'Inter',sans-serif" }}
                    onFocus={e=>e.target.style.borderColor="#d00000"}
                    onBlur={e=>e.target.style.borderColor="#1f1f1f"}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {socials.filter(s=>s.username).length===0 ? (
                <p style={{ fontSize:"14px", color:"#444", fontStyle:"italic", margin:0 }}>No socials added yet.</p>
              ) : (
                socials.filter(s=>s.username).map((s,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                    <span style={{ fontSize:"16px" }}>{PLATFORM_ICONS[s.platform]||"🔗"}</span>
                    <div>
                      <div style={{ fontSize:"11px", color:"#444", fontWeight:700 }}>{s.platform}</div>
                      <div style={{ fontSize:"13px", color:"#888" }}>@{s.username}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderSettings = () => (
    <div>
      <h2 style={{ fontSize:"24px", fontWeight:900, letterSpacing:"-1px", marginBottom:"32px" }}>Settings</h2>
      <div style={{ display:"flex", flexDirection:"column", gap:"16px", maxWidth:"500px" }}>
        {[
          { key:"email_notifications", label:"Email notifications", desc:"Get updates about your roadmap and community" },
          { key:"roadmap_reminders",   label:"Roadmap reminders",   desc:"Weekly reminders to check your next steps"   },
          { key:"public_profile",      label:"Public profile",      desc:"Let others see your niche progress"          },
        ].map(({ key, label, desc }) => (
          <div key={key} style={{ background:"#111", border:"1px solid #1f1f1f", borderRadius:"14px", padding:"20px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"20px" }}>
            <div>
              <div style={{ fontSize:"14px", fontWeight:700, color:"white", marginBottom:"4px" }}>{label}</div>
              <div style={{ fontSize:"12px", color:"#444" }}>{desc}</div>
            </div>
            <Toggle checked={settings[key]} onChange={val=>saveSetting(key,val)} />
          </div>
        ))}
      </div>
      <div style={{ marginTop:"48px", borderTop:"1px solid #1a1a1a", paddingTop:"32px" }}>
        <h3 style={{ fontSize:"14px", fontWeight:700, color:"#333", marginBottom:"16px", textTransform:"uppercase", letterSpacing:"0.1em" }}>Danger Zone</h3>
        <button onClick={deleteAccount} style={{ background:"transparent", border:"1px solid #3a0000", color:"#d00000", padding:"10px 20px", borderRadius:"8px", fontSize:"13px", fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>
          Delete account
        </button>
      </div>
    </div>
  )

  const renderBilling = () => (
    <div>
      <h2 style={{ fontSize:"24px", fontWeight:900, letterSpacing:"-1px", marginBottom:"32px" }}>Billing</h2>
      <div style={{ background:"#111", border:"1px solid #1f1f1f", borderRadius:"16px", padding:"28px", maxWidth:"500px", marginBottom:"24px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:"12px", color:"#555", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"6px" }}>Current plan</div>
            <div style={{ fontSize:"26px", fontWeight:900, color:"white", letterSpacing:"-1px" }}>{plan.charAt(0).toUpperCase()+plan.slice(1)}</div>
          </div>
          <div style={{ background:isPro?"#1a0000":"#111", border:`1px solid ${isPro?"#d00000":"#2a2a2a"}`, color:isPro?"#d00000":"#444", padding:"6px 14px", borderRadius:"99px", fontSize:"12px", fontWeight:700 }}>
            {plan==="free"?"Free forever":"Active"}
          </div>
        </div>
        {plan==="free" && (
          <div style={{ marginTop:"20px", paddingTop:"20px", borderTop:"1px solid #1a1a1a" }}>
            <div style={{ fontSize:"13px", color:"#555", marginBottom:"4px" }}>AI messages today</div>
            <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
              <div style={{ flex:1, background:"#1a1a1a", borderRadius:"99px", height:"6px" }}>
                <div style={{ height:"100%", background:"#d00000", borderRadius:"99px", width:`${Math.min(100,(todayMsgs/5)*100)}%`, transition:"width 0.6s ease" }} />
              </div>
              <span style={{ fontSize:"13px", fontWeight:700, color:"#d00000", whiteSpace:"nowrap" }}>{todayMsgs} / 5 used</span>
            </div>
          </div>
        )}
      </div>
      {plan==="free" && (
        <Link to="/pricing" style={{ display:"inline-block", background:"#d00000", color:"white", textDecoration:"none", padding:"14px 28px", borderRadius:"10px", fontSize:"14px", fontWeight:900, transition:"opacity 0.2s" }}
          onMouseEnter={e=>e.currentTarget.style.opacity="0.85"}
          onMouseLeave={e=>e.currentTarget.style.opacity="1"}
        >Upgrade to Pro →</Link>
      )}
    </div>
  )

  const sectionRenderers = {
    Overview:       renderOverview,
    "My Roadmap":   renderRoadmap,
    "AI Mentor":    renderAIMentor,
    Community:      renderCommunity,
    About:          renderAbout,
    Settings:       renderSettings,
    Billing:        renderBilling,
  }

  return (
    <div className="page-enter dot-bg" style={{ minHeight:"100vh", width:"100vw", maxWidth:"100%", fontFamily:"'Inter',sans-serif", color:"white", overflowX:"hidden" }}>
      <Navbar />

      <div style={{ display:"flex", minHeight:"calc(100vh - 66px)" }}>

        {/* ── Sidebar ── */}
        <div style={{ width:"256px", flexShrink:0, background:"#080808", borderRight:"1px solid #1f1f1f", display:"flex", flexDirection:"column", padding:"32px 0" }}>

          {/* Avatar */}
          <div style={{ textAlign:"center", padding:"0 24px 28px", borderBottom:"1px solid #1a1a1a", marginBottom:"20px" }}>
            <div style={{ position:"relative", width:"72px", height:"72px", margin:"0 auto 14px" }}>
              {/* Spinning rings */}
              <div style={{ position:"absolute", inset:"-5px", borderRadius:"50%", border:"2px solid transparent", borderTopColor:"#d00000", borderRightColor:"#d00000", animation:"spin-cw 2.5s linear infinite" }} />
              <div style={{ position:"absolute", inset:"-9px", borderRadius:"50%", border:"2px solid transparent", borderBottomColor:"#3a0000", borderLeftColor:"#3a0000", animation:"spin-ccw 3.5s linear infinite" }} />

              {/* Photo or initials */}
              {(photoPreview || avatarUrl) ? (
                <img
                  src={photoPreview || avatarUrl}
                  alt="avatar"
                  style={{ width:"72px", height:"72px", borderRadius:"50%", objectFit:"cover", border:"2px solid #d00000", opacity: uploading ? 0.5 : 1, transition:"opacity 0.2s" }}
                />
              ) : (
                <div style={{ width:"72px", height:"72px", borderRadius:"50%", background:"#1a0000", border:"2px solid #d00000", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", fontWeight:900, color:"#d00000" }}>
                  {inits}
                </div>
              )}

              {/* Upload button */}
              <button
                onClick={()=>fileRef.current?.click()}
                disabled={uploading}
                style={{ position:"absolute", bottom:0, right:0, width:"24px", height:"24px", borderRadius:"50%", background: uploading ? "#555" : "#d00000", border:"2px solid #080808", cursor: uploading ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px" }}
                title="Upload photo — JPG PNG GIF max 2MB"
              >
                {uploading ? "⏳" : "📷"}
              </button>
              <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" style={{ display:"none" }} onChange={uploadPhoto} />
            </div>

            {/* Upload label */}
            <div style={{ fontSize:"9px", color:"#333", marginBottom:"8px", letterSpacing:"0.06em" }}>
              Upload a profile photo — JPG PNG GIF max 2MB
            </div>

            {/* Name + badges */}
            {editingName ? (
              <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:"6px", marginBottom:"8px" }}>
                <input
                  value={editFirstName}
                  onChange={e=>setEditFirstName(e.target.value)}
                  placeholder="First name"
                  style={{ background:"#0d0d0d", border:"1px solid #d00000", color:"white", padding:"7px 10px", borderRadius:"6px", fontSize:"12px", outline:"none", fontFamily:"'Inter',sans-serif", textAlign:"center" }}
                />
                <input
                  value={editLastName}
                  onChange={e=>setEditLastName(e.target.value)}
                  placeholder="Last name"
                  style={{ background:"#0d0d0d", border:"1px solid #1f1f1f", color:"white", padding:"7px 10px", borderRadius:"6px", fontSize:"12px", outline:"none", fontFamily:"'Inter',sans-serif", textAlign:"center" }}
                />
                <div style={{ display:"flex", gap:"6px", justifyContent:"center" }}>
                  <button onClick={()=>setEditingName(false)} style={{ background:"transparent", border:"1px solid #333", color:"#555", padding:"5px 10px", borderRadius:"6px", fontSize:"11px", cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>Cancel</button>
                  <button onClick={saveName} disabled={nameSaving} style={{ background:"#d00000", color:"white", border:"none", padding:"5px 12px", borderRadius:"6px", fontSize:"11px", fontWeight:800, cursor:"pointer", fontFamily:"'Inter',sans-serif", opacity:nameSaving?0.6:1 }}>
                    {nameSaving?"Saving…":"Save"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"6px", marginBottom:"3px", flexWrap:"wrap" }}>
                  <span style={{ fontSize:"15px", fontWeight:800, color:"white" }}>{firstName} {lastName}</span>
                  {isVerified && <VerifiedBadge size={16} />}
                </div>
                {/* Name change eligibility */}
                {(() => {
                  const lastChanged = profile?.last_name_changed_at
                  const daysSince = lastChanged ? Math.floor((Date.now() - new Date(lastChanged)) / 86400000) : 999
                  const canChange = daysSince >= 365
                  const daysLeft  = 365 - daysSince
                  return (
                    <div style={{ marginBottom:"4px" }}>
                      {canChange ? (
                        <button
                          onClick={()=>{ setEditFirstName(firstName); setEditLastName(lastName); setEditingName(true) }}
                          style={{ background:"transparent", border:"1px solid #222", color:"#444", padding:"3px 10px", borderRadius:"99px", fontSize:"10px", cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.2s" }}
                          onMouseEnter={e=>{ e.currentTarget.style.borderColor="#d00000"; e.currentTarget.style.color="#d00000" }}
                          onMouseLeave={e=>{ e.currentTarget.style.borderColor="#222";    e.currentTarget.style.color="#444"   }}
                        >
                          Edit name
                        </button>
                      ) : (
                        <div style={{ fontSize:"10px", color:"#333" }}>
                          Name change in {daysLeft}d
                        </div>
                      )}
                    </div>
                  )
                })()}
              </>
            )}

            {/* Founder tag */}
            {isAdmin && (
              <div className="founder-tag" style={{ display:"inline-block", fontSize:"9px", fontWeight:800, padding:"3px 10px", borderRadius:"99px", letterSpacing:"0.1em", marginBottom:"6px" }}>
                FOUNDER
              </div>
            )}

            <div style={{ fontSize:"11px", color:"#444" }}>{user?.email}</div>
            <div style={{ fontSize:"10px", color:"#333", marginTop:"4px" }}>Member since {memberSince}</div>

            {/* Niche tags */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:"4px", justifyContent:"center", marginTop:"10px" }}>
              {displayNiches.map(n => (
                <span key={n} style={{ background:"#1a0000", border:"1px solid #3a0000", color:"#d00000", fontSize:"9px", fontWeight:700, padding:"2px 7px", borderRadius:"99px" }}>
                  {nicheIcons[n]} {n}
                </span>
              ))}
              {autoTags.map(tag => (
                <span key={tag.label} style={{ background:tag.bg, border:`1px solid ${tag.border}`, color:tag.color, fontSize:"9px", fontWeight:700, padding:"2px 7px", borderRadius:"99px" }}>
                  {tag.label}
                </span>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div style={{ flex:1, padding:"0 12px" }}>
            {sidebarSections.map(section => (
              <button key={section} onClick={()=>handleSectionChange(section)} style={{
                width:"100%", textAlign:"left", background:activeSection===section?"#1a0000":"transparent",
                border:"none", borderRadius:"10px", padding:"11px 14px",
                color:activeSection===section?"#d00000":"#555",
                fontSize:"13px", fontWeight:activeSection===section?800:600,
                cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.15s ease", marginBottom:"2px",
              }}
                onMouseEnter={e=>{ if(activeSection!==section) e.currentTarget.style.color="#888" }}
                onMouseLeave={e=>{ if(activeSection!==section) e.currentTarget.style.color="#555" }}
              >{section}</button>
            ))}
          </div>

          {/* Upgrade card */}
          {plan==="free" && (
            <div style={{ margin:"20px 12px 16px", background:"#1a0000", border:"1px solid #3a0000", borderRadius:"14px", padding:"16px" }}>
              <div style={{ fontSize:"12px", fontWeight:800, color:"#d00000", marginBottom:"6px" }}>Unlock everything</div>
              <div style={{ fontSize:"11px", color:"#555", lineHeight:"1.6", marginBottom:"12px" }}>Unlimited AI messages, full roadmap, all niches.</div>
              <Link to="/pricing" style={{ display:"block", textAlign:"center", background:"#d00000", color:"white", textDecoration:"none", padding:"8px", borderRadius:"8px", fontSize:"12px", fontWeight:800 }}>
                Upgrade →
              </Link>
            </div>
          )}

          {/* Logout */}
          <div style={{ padding:"0 12px" }}>
            <button onClick={handleLogout} style={{
              width:"100%", textAlign:"left", background:"transparent", border:"none",
              padding:"11px 14px", color:"#333", fontSize:"13px", fontWeight:600,
              cursor:"pointer", fontFamily:"'Inter',sans-serif", borderRadius:"10px", transition:"color 0.15s ease",
            }}
              onMouseEnter={e=>e.currentTarget.style.color="#d00000"}
              onMouseLeave={e=>e.currentTarget.style.color="#333"}
            >Log out</button>
          </div>
        </div>

        {/* ── Main content ── */}
        <div style={{ flex:1, padding:"48px 56px", overflowY:"auto" }}>
          {(sectionRenderers[activeSection] || renderOverview)()}
        </div>
      </div>

      {/* ── Announce modal ── */}
      {showAnnounce && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}
          onClick={e=>{ if(e.target===e.currentTarget) setShowAnnounce(false) }}>
          <div style={{ background:"#111", border:"1px solid #003300", borderRadius:"20px", padding:"32px", width:"440px", animation:"modal-in 0.25s ease" }}>
            <div style={{ fontSize:"18px", fontWeight:900, marginBottom:"6px" }}>📢 Platform Announcement</div>
            <div style={{ fontSize:"13px", color:"#555", marginBottom:"20px" }}>This message will be visible to all users.</div>
            <textarea
              value={announceText}
              onChange={e=>setAnnounceText(e.target.value)}
              placeholder="Write your announcement…"
              style={{ width:"100%", background:"#0d0d0d", border:"1px solid #1f1f1f", color:"white", padding:"14px", borderRadius:"10px", fontSize:"14px", outline:"none", fontFamily:"'Inter',sans-serif", boxSizing:"border-box", resize:"vertical", minHeight:"120px", lineHeight:"1.6" }}
              onFocus={e=>e.target.style.borderColor="#00ff41"}
              onBlur={e=>e.target.style.borderColor="#1f1f1f"}
            />
            <div style={{ display:"flex", gap:"10px", justifyContent:"flex-end", marginTop:"16px" }}>
              <button onClick={()=>setShowAnnounce(false)} style={{ background:"transparent", border:"1px solid #333", color:"#aaa", padding:"10px 20px", borderRadius:"8px", fontSize:"13px", cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>Cancel</button>
              <button onClick={sendAnnouncement} disabled={!announceText.trim()||sendingAnnounce} style={{ background:"#00aa33", color:"white", border:"none", padding:"10px 24px", borderRadius:"8px", fontSize:"13px", fontWeight:800, cursor:"pointer", fontFamily:"'Inter',sans-serif", opacity:!announceText.trim()?0.5:1 }}>
                {sendingAnnounce?"Sending…":"Send Announcement"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <MessageBubble />
    </div>
  )
}
