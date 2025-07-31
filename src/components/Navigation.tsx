import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User, Heart } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/mentors", label: "Mentors" },
    { path: "/workshops", label: "Workshops" },
    { path: "/study-materials", label: "Study Materials" },
    { path: "/ai-tools", label: "AI Tools" },
    { path: "/community", label: "Community" },
    { path: "/gamification", label: "Progress" },
    { path: "/about", label: "About" },
    { path: "/opportunities", label: "Opportunities" },
    { path: "/impact", label: "Impact" },
    { path: "/contact", label: "Contact" },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/8f8193e3-0898-424f-8592-ce16830b43ed.png" 
              alt="STEMinist Study Hub Logo" 
              className="h-12 w-auto"
            />
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                asChild
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className={location.pathname === item.path ? "" : "text-primary-foreground hover:bg-primary-foreground/10"}
              >
                <Link to={item.path}>{item.label}</Link>
              </Button>
            ))}
            
            {user ? (
              <div className="flex items-center gap-2 ml-4">
                <Button
                  asChild
                  variant="ghost"
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link to="/dashboard">
                    <User className="h-4 w-4 mr-1" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                asChild
                variant="secondary"
                className="ml-4 bg-accent hover:bg-accent/90 text-white"
              >
                <Link to="/auth">Join Us! 💖</Link>
              </Button>
            )}
          </div>

          <div className="md:hidden">
            <Button variant="ghost" className="text-primary-foreground">
              Menu
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;