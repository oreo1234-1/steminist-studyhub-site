import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import { AuthProvider } from "./hooks/useAuth";
import Home from "./pages/Home";
import Mentors from "./pages/Mentors";
import Workshops from "./pages/Workshops";
import StudyMaterials from "./pages/StudyMaterials";
import About from "./pages/About";
import Opportunities from "./pages/Opportunities";
import Impact from "./pages/Impact";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AIStudyTools from "./pages/AIStudyTools";
import CommunityForum from "./pages/CommunityForum";
import Gamification from "./pages/Gamification";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import StudyPods from "./pages/StudyPods";
import Events from "./pages/Events";
import Resources from "./pages/Resources";
import Leadership from "./pages/Leadership";
import Challenges from "./pages/Challenges";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
          <AuthProvider>
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/study-pods" element={<StudyPods />} />
              <Route path="/mentors" element={<Mentors />} />
              <Route path="/workshops" element={<Workshops />} />
              <Route path="/study-materials" element={<StudyMaterials />} />
              <Route path="/events" element={<Events />} />
              <Route path="/about" element={<About />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/impact" element={<Impact />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/ai-tools" element={<AIStudyTools />} />
              <Route path="/community" element={<CommunityForum />} />
              <Route path="/gamification" element={<Gamification />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/leadership" element={<Leadership />} />
              <Route path="/challenges" element={<Challenges />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
