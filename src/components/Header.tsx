import { useState } from "react";
import { GlassCard } from "./GlassCard";
import { NotificationCenter } from "./NotificationCenter";
import { useNotifications } from "@/hooks/useNotifications";
import { DollarSign, Menu, Settings, Bell, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import logoImage from "@/assets/logo.jpg";

export function Header() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const {
    notifications,
    isOpen,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismiss,
    clearAll,
    openNotifications,
    closeNotifications,
  } = useNotifications();
  
  return (
    <>
      <header className="animate-fade-in-up">
        <GlassCard className="px-4 sm:px-6 py-3 flex items-center justify-between" hover={false}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-primary/30 bg-gradient-to-br from-secondary/20 to-primary/20">
              <img 
                src={logoImage} 
                alt="Alpha Vision Method" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-display font-semibold tracking-wide bg-gradient-to-b from-secondary via-primary/80 to-primary bg-clip-text text-transparent">
                Alpha Vision
              </span>
              <span className="text-sm text-muted-foreground ml-2">
                The Living Interface
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={openNotifications}
              className="relative p-2.5 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </button>
            <button className="p-2.5 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </button>
            <button 
              onClick={() => navigate("/settings")}
              className="p-2.5 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
            >
              <Settings className="h-5 w-5 text-muted-foreground" />
            </button>
            {user ? (
              <button 
                onClick={() => signOut()}
                className="p-2.5 rounded-xl border border-border/50 hover:border-destructive/50 hover:bg-destructive/5 transition-all duration-200"
                title="Sign out"
              >
                <LogOut className="h-5 w-5 text-muted-foreground" />
              </button>
            ) : (
              <button 
                onClick={() => navigate("/auth")}
                className="p-2.5 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
              >
                <User className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
          </div>
        </GlassCard>
      </header>

      <NotificationCenter
        isOpen={isOpen}
        onClose={closeNotifications}
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onDismiss={dismiss}
        onClearAll={clearAll}
      />
    </>
  );
}
