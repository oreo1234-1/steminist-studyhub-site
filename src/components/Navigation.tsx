import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();

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

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="text-2xl font-bold">
            STEMinist Study Hub
          </Link>
          
          <div className="hidden md:flex space-x-1">
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