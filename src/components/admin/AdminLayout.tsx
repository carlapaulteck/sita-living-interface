import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Ticket,
  Megaphone,
  AlertTriangle,
  ClipboardList,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Shield,
  Activity,
  Flag,
  Webhook,
  Building2,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

const NavItem = ({ to, icon, label, collapsed }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
          'hover:bg-white/5 group',
          isActive
            ? 'bg-primary/10 text-primary border-l-2 border-primary'
            : 'text-muted-foreground hover:text-foreground'
        )
      }
    >
      <span className="flex-shrink-0">{icon}</span>
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="text-sm font-medium whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );
};

interface NavSectionProps {
  title: string;
  children: React.ReactNode;
  collapsed: boolean;
}

const NavSection = ({ title, children, collapsed }: NavSectionProps) => (
  <div className="mb-4">
    <AnimatePresence>
      {!collapsed && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60"
        >
          {title}
        </motion.p>
      )}
    </AnimatePresence>
    <div className="space-y-1">{children}</div>
  </div>
);

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  // Get current page title from path
  const getPageTitle = () => {
    const path = location.pathname.replace('/admin', '').replace('/', '');
    const titles: Record<string, string> = {
      '': 'Dashboard',
      'users': 'User Management',
      'subscriptions': 'Subscriptions',
      'tickets': 'Support Tickets',
      'announcements': 'Announcements',
      'errors': 'Error Logs',
      'audit': 'Audit Logs',
      'settings': 'Platform Settings',
      'feature-flags': 'Feature Flags',
      'platform': 'Platform Management'
    };
    return titles[path] || 'Admin Panel';
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <h1 className="text-lg font-bold text-foreground whitespace-nowrap">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Control Center</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator className="bg-white/5" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <NavItem
          to="/admin"
          icon={<LayoutDashboard className="w-5 h-5" />}
          label="Dashboard"
          collapsed={collapsed}
        />

        <NavSection title="Management" collapsed={collapsed}>
          <NavItem
            to="/admin/users"
            icon={<Users className="w-5 h-5" />}
            label="Users"
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/subscriptions"
            icon={<CreditCard className="w-5 h-5" />}
            label="Subscriptions"
            collapsed={collapsed}
          />
        </NavSection>

        <NavSection title="Support" collapsed={collapsed}>
          <NavItem
            to="/admin/tickets"
            icon={<Ticket className="w-5 h-5" />}
            label="Tickets"
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/announcements"
            icon={<Megaphone className="w-5 h-5" />}
            label="Announcements"
            collapsed={collapsed}
          />
        </NavSection>

        <NavSection title="Monitoring" collapsed={collapsed}>
          <NavItem
            to="/admin/errors"
            icon={<AlertTriangle className="w-5 h-5" />}
            label="Error Logs"
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/audit"
            icon={<ClipboardList className="w-5 h-5" />}
            label="Audit Logs"
            collapsed={collapsed}
          />
        </NavSection>

        <NavSection title="Settings" collapsed={collapsed}>
          <NavItem
            to="/admin/settings"
            icon={<Settings className="w-5 h-5" />}
            label="Platform Config"
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/feature-flags"
            icon={<Flag className="w-5 h-5" />}
            label="Feature Flags"
            collapsed={collapsed}
          />
        </NavSection>

        <NavSection title="Platform" collapsed={collapsed}>
          <NavItem
            to="/admin/platform"
            icon={<Webhook className="w-5 h-5" />}
            label="Webhooks & Orgs"
            collapsed={collapsed}
          />
        </NavSection>
      </ScrollArea>

      <Separator className="bg-white/5" />

      {/* User section */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-primary/20 text-primary text-sm">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 overflow-hidden"
              >
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.email?.split('@')[0] || 'Admin'}
                </p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Collapse toggle */}
      <div className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2">
        <Button
          variant="outline"
          size="icon"
          className="w-6 h-6 rounded-full bg-background border-border shadow-lg"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 256 }}
        className="hidden md:flex flex-col fixed left-0 top-0 h-full bg-[#111111] border-r border-white/5 z-40 relative"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#111111] border-b border-white/5 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground">Admin Panel</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="md:hidden fixed left-0 top-0 h-full w-[280px] bg-[#111111] border-r border-white/5 z-50 flex flex-col pt-16"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 min-h-screen transition-all duration-300',
          'md:ml-[256px]',
          collapsed && 'md:ml-[72px]',
          'pt-16 md:pt-0'
        )}
      >
        {/* Top Header */}
        <header className="hidden md:flex h-16 bg-[#111111]/50 border-b border-white/5 items-center justify-between px-6 sticky top-0 z-30 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">{getPageTitle()}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-400">System Online</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
