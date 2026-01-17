import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Settings, LogOut, Menu, X, Command } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NotificationCenter } from "@/components/NotificationCenter";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import logoImage from "@/assets/logo.jpg";
import avatarImage from "@/assets/avatar.jpg";
import { LiveIndicator } from "./LiveIndicator";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

export function Header() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Subscribe to notifications for live status
  const { isConnected } = useRealtimeSubscription({
    table: 'notifications',
    enabled: !!user,
  });

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-xl border-b border-border/50" />
      
      {/* Gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg" />
              <Avatar className="w-10 h-10 border-2 border-primary/30 relative">
                <AvatarImage src={logoImage} alt="SITA" />
                <AvatarFallback className="bg-primary/10 text-primary">S</AvatarFallback>
              </Avatar>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground font-['Playfair_Display']">
                SITA
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Personal OS</span>
                <LiveIndicator isConnected={isConnected} size="sm" />
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {/* Command hint */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-muted-foreground text-sm mr-2">
              <Command className="w-3.5 h-3.5" />
              <span>K</span>
            </div>
            
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                "relative rounded-xl hover:bg-muted/50",
                showNotifications && "bg-muted"
              )}
            >
              <Bell className="w-5 h-5" />
              {/* Notification badge */}
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background" />
            </Button>

            {/* Settings */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/settings")}
              className="rounded-xl hover:bg-muted/50"
            >
              <Settings className="w-5 h-5" />
            </Button>

            {/* Profile */}
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-border/50">
              <Avatar className="w-9 h-9 border border-border/50">
                <AvatarImage src={avatarImage} alt="Profile" />
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-xl"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/50 p-4 md:hidden"
          >
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                className="justify-start gap-3"
                onClick={() => {
                  navigate("/settings");
                  setMobileMenuOpen(false);
                }}
              >
                <Settings className="w-5 h-5" />
                Settings
              </Button>
              <Button
                variant="ghost"
                className="justify-start gap-3 text-destructive hover:bg-destructive/10"
                onClick={handleSignOut}
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Notification Center */}
      {showNotifications && (
        <NotificationCenter onClose={() => setShowNotifications(false)} />
      )}
    </header>
  );
}
