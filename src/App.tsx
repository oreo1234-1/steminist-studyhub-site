import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/study-materials" element={<StudyMaterials />} />
          <Route path="/about" element={<About />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ai-tools" element={<AIStudyTools />} />
          <Route path="/community" element={<CommunityForum />} />
          <Route path="/gamification" element={<Gamification />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
