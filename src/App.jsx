import { Routes, Route } from "react-router-dom"
import HomePage           from "./pages/HomePage"
import ExplorePage        from "./pages/ExplorePage"
import NichePage          from "./pages/NichePage"
import RoadmapPage        from "./pages/RoadmapPage"
import CommunityPage      from "./pages/CommunityPage"
import MentorPage         from "./pages/MentorPage"
import PricingPage        from "./pages/PricingPage"
import AboutPage          from "./pages/AboutPage"
import LoginPage          from "./pages/LoginPage"
import SignupPage         from "./pages/SignupPage"
import ProfilePage        from "./pages/ProfilePage"
import OnboardingPage     from "./pages/OnboardingPage"
import MessagesPage       from "./pages/MessagesPage"
import PrivacyPage        from "./pages/PrivacyPage"
import TermsPage          from "./pages/TermsPage"
import CookiesPage        from "./pages/CookiesPage"
import BlogPage           from "./pages/BlogPage"
import ContactPage        from "./pages/ContactPage"
import BannedPage         from "./pages/BannedPage"
import AdminPage          from "./pages/AdminPage"
import AdminAnnouncePage  from "./pages/AdminAnnouncePage"
import AdminUsersPage     from "./pages/AdminUsersPage"

export default function App() {
  return (
    <Routes>
      <Route path="/"                    element={<HomePage           />} />
      <Route path="/explore"             element={<ExplorePage        />} />
      <Route path="/niche/:nicheName"    element={<NichePage          />} />
      <Route path="/roadmap"             element={<RoadmapPage        />} />
      <Route path="/community"           element={<CommunityPage      />} />
      <Route path="/mentor"              element={<MentorPage         />} />
      <Route path="/pricing"             element={<PricingPage        />} />
      <Route path="/about"               element={<AboutPage          />} />
      <Route path="/login"               element={<LoginPage          />} />
      <Route path="/signup"              element={<SignupPage         />} />
      <Route path="/profile"             element={<ProfilePage        />} />
      <Route path="/onboarding"          element={<OnboardingPage     />} />
      <Route path="/messages"            element={<MessagesPage       />} />
      <Route path="/privacy"             element={<PrivacyPage        />} />
      <Route path="/terms"               element={<TermsPage          />} />
      <Route path="/cookies"             element={<CookiesPage        />} />
      <Route path="/blog"                element={<BlogPage           />} />
      <Route path="/contact"             element={<ContactPage        />} />
      <Route path="/banned"              element={<BannedPage         />} />
      <Route path="/admin"               element={<AdminPage          />} />
      <Route path="/admin/announce"      element={<AdminAnnouncePage  />} />
      <Route path="/admin/users"         element={<AdminUsersPage     />} />
    </Routes>
  )
}
