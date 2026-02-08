import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User, Menu, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mainNavItems = [
    { path: "/features", label: "Features" },
    { path: "/study-pods", label: "Study Pods" },
    { path: "/mentors", label: "Mentorship" },
  ];

  const resourceItems = [
    { path: "/resources", label: "Resource Library" },
    { path: "/study-materials", label: "Study Materials" },
    { path: "/ai-tools", label: "AI Study Tools" },
    { path: "/workshops", label: "Workshops" },
    { path: "/opportunities", label: "Career Prep" },
  ];

  const communityItems = [
    { path: "/events", label: "Events" },
    { path: "/community", label: "Forum" },
    { path: "/challenges", label: "Challenges" },
    { path: "/gamification", label: "Progress" },
    { path: "/leadership", label: "Leadership" },
    { path: "/impact", label: "Impact" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img
              src="/lovable-uploads/8f8193e3-0898-424f-8592-ce16830b43ed.png"
              alt="STEMinist Study Hub Logo"
              className="h-8 w-auto"
            />
            <span className="font-playfair text-lg font-bold text-foreground hidden sm:block">
              STEMinist
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePath(item.path)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Resources Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors outline-none">
                Resources <ChevronDown className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {resourceItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="w-full">{item.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Community Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors outline-none">
                Community <ChevronDown className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {communityItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="w-full">{item.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Link to="/dashboard">
                    <User className="h-4 w-4 mr-1.5" />
                    Dashboard
                  </Link>
                </Button>
                <Button onClick={handleSignOut} variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Link to="/auth">Sign in</Link>
                </Button>
                <Button asChild size="sm" className="shadow-sm">
                  <Link to="/auth">Join the Hub</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-6 pt-6">
                  <Link
                    to="/"
                    className="flex items-center gap-2 pb-4 border-b border-border"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <img
                      src="/lovable-uploads/8f8193e3-0898-424f-8592-ce16830b43ed.png"
                      alt="Logo"
                      className="h-7 w-auto"
                    />
                    <span className="font-playfair font-bold text-foreground">STEMinist Study Hub</span>
                  </Link>

                  <NavGroup title="Main" items={mainNavItems} isActive={isActivePath} onClose={() => setIsMobileMenuOpen(false)} />
                  <NavGroup title="Resources" items={resourceItems} isActive={isActivePath} onClose={() => setIsMobileMenuOpen(false)} />
                  <NavGroup title="Community" items={communityItems} isActive={isActivePath} onClose={() => setIsMobileMenuOpen(false)} />

                  <div className="pt-4 border-t border-border space-y-3">
                    {user ? (
                      <>
                        <Button asChild className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                          <Link to="/dashboard">
                            <User className="h-4 w-4 mr-2" />
                            Dashboard
                          </Link>
                        </Button>
                        <Button
                          onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
                          variant="outline"
                          className="w-full"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <Button asChild className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                        <Link to="/auth">Join the Hub</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

function NavGroup({ title, items, isActive, onClose }: {
  title: string;
  items: { path: string; label: string }[];
  isActive: (path: string) => boolean;
  onClose: () => void;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">{title}</p>
      {items.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`block px-3 py-2 rounded-md text-sm transition-colors ${
            isActive(item.path)
              ? "text-primary bg-primary/10 font-medium"
              : "text-foreground hover:bg-muted"
          }`}
          onClick={onClose}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export default Navigation;
