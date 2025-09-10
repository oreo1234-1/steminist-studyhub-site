import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User, Heart, Menu, X, ChevronDown } from "lucide-react";
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

  // Group navigation items logically
  const mainNavItems = [
    { path: "/", label: "Home" },
    { path: "/mentors", label: "Mentors" },
    { path: "/workshops", label: "Workshops" },
    { path: "/ai-tools", label: "AI Study Tools" },
  ];

  const resourceItems = [
    { path: "/study-materials", label: "Study Materials" },
    { path: "/opportunities", label: "Opportunities" },
    { path: "/impact", label: "Impact Stories" },
  ];

  const communityItems = [
    { path: "/community", label: "Community Forum" },
    { path: "/gamification", label: "Progress & Badges" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact" },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  const isActivePath = (path: string) => location.pathname === path;

  const MobileNavItems = ({ items }: { items: typeof mainNavItems }) => (
    <>
      {items.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`block px-4 py-3 text-lg font-medium rounded-lg transition-colors ${
            isActivePath(item.path)
              ? "bg-accent text-white"
              : "text-primary hover:bg-accent/10"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <nav className="bg-primary text-primary-foreground shadow-elegant border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img 
              src="/lovable-uploads/8f8193e3-0898-424f-8592-ce16830b43ed.png" 
              alt="STEMinist Study Hub Logo" 
              className="h-10 w-auto"
            />
            <span className="font-playfair text-xl font-bold hidden sm:block">
              STEMinist Study Hub
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Main nav items */}
            {mainNavItems.map((item) => (
              <Button
                key={item.path}
                asChild
                variant={isActivePath(item.path) ? "secondary" : "ghost"}
                className={
                  isActivePath(item.path) 
                    ? "bg-accent text-white hover:bg-accent/90" 
                    : "text-primary-foreground hover:bg-accent/20"
                }
              >
                <Link to={item.path}>{item.label}</Link>
              </Button>
            ))}
            
            {/* Resources Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-primary-foreground hover:bg-accent/20"
                >
                  Resources <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {resourceItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="w-full">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Community Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-primary-foreground hover:bg-accent/20"
                >
                  Community <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {communityItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="w-full">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  asChild
                  variant="ghost"
                  className="text-primary-foreground hover:bg-accent/20"
                >
                  <Link to="/dashboard">
                    <User className="h-4 w-4 mr-1" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  onClick={handleSignOut}
                  variant="ghost" 
                  size="sm"
                  className="text-primary-foreground hover:bg-accent/20"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                asChild
                variant="secondary"
                className="hidden md:flex bg-accent hover:bg-accent/90 text-white"
              >
                <Link to="/auth">Join Us! 💖</Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden text-primary-foreground">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background">
                <div className="flex flex-col gap-6 pt-6">
                  <div className="flex items-center gap-2 pb-4 border-b">
                    <Heart className="h-6 w-6 text-accent" />
                    <span className="font-playfair text-lg font-bold text-primary">
                      STEMinist Study Hub
                    </span>
                  </div>

                  {/* Main Navigation */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary mb-3">Main</h3>
                    <MobileNavItems items={mainNavItems} />
                  </div>

                  {/* Resources */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary mb-3">Resources</h3>
                    <MobileNavItems items={resourceItems} />
                  </div>

                  {/* Community */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary mb-3">Community</h3>
                    <MobileNavItems items={communityItems} />
                  </div>

                  {/* User Actions Mobile */}
                  <div className="pt-4 border-t space-y-3">
                    {user ? (
                      <>
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2 px-4 py-3 text-lg font-medium rounded-lg bg-accent text-white"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="h-5 w-5" />
                          Dashboard
                        </Link>
                        <Button
                          onClick={() => {
                            handleSignOut();
                            setIsMobileMenuOpen(false);
                          }}
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <Link
                        to="/auth"
                        className="block px-4 py-3 text-lg font-medium rounded-lg bg-accent text-white text-center"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Join Us! 💖
                      </Link>
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

export default Navigation;