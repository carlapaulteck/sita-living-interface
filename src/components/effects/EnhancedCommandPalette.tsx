import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Command, 
  ArrowRight, 
  Clock,
  Sparkles,
  Briefcase,
  Heart,
  Brain,
  Users,
  Settings,
  Home,
  Wallet,
  Activity,
  Bot,
  Keyboard,
  Plus,
  Moon,
  Sun,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
  category: 'navigation' | 'action' | 'quick' | 'system';
}

interface EnhancedCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTaskModal?: () => void;
  onOpenActivityLogger?: () => void;
}

export function EnhancedCommandPalette({ 
  isOpen, 
  onClose,
  onOpenTaskModal,
  onOpenActivityLogger,
}: EnhancedCommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();
  const queryClient = useQueryClient();

  // Define all available commands
  const commands: CommandItem[] = useMemo(() => [
    // Quick Actions (most used)
    { 
      id: 'new-task', 
      title: 'Create New Task', 
      description: 'Add a new task to your list',
      icon: <Plus className="w-4 h-4" />, 
      action: () => {
        onOpenTaskModal?.();
        onClose();
      }, 
      keywords: ['new', 'task', 'create', 'add', 'todo'], 
      category: 'quick' 
    },
    { 
      id: 'log-activity', 
      title: 'Log Activity', 
      description: 'Track your activities',
      icon: <Activity className="w-4 h-4" />, 
      action: () => {
        onOpenActivityLogger?.();
        onClose();
      }, 
      keywords: ['log', 'activity', 'track', 'workout', 'exercise'], 
      category: 'quick' 
    },
    
    // Navigation
    { id: 'home', title: 'Go to Dashboard', icon: <Home className="w-4 h-4" />, action: () => navigate('/'), keywords: ['home', 'dashboard', 'main'], category: 'navigation' },
    { id: 'business', title: 'Business OS', description: 'Manage your business operations', icon: <Briefcase className="w-4 h-4" />, action: () => navigate('/business'), keywords: ['business', 'work', 'company'], category: 'navigation' },
    { id: 'assistant', title: 'Personal Assistant', description: 'AI assistant & calendar', icon: <Bot className="w-4 h-4" />, action: () => navigate('/assistant'), keywords: ['assistant', 'ai', 'help', 'calendar'], category: 'navigation' },
    { id: 'finance', title: 'Personal Finance', description: 'Budgets & investments', icon: <Wallet className="w-4 h-4" />, action: () => navigate('/finance'), keywords: ['finance', 'money', 'budget', 'invest'], category: 'navigation' },
    { id: 'health', title: 'Health & Fitness', description: 'Track your wellness', icon: <Heart className="w-4 h-4" />, action: () => navigate('/health'), keywords: ['health', 'fitness', 'workout', 'wellness'], category: 'navigation' },
    { id: 'mindset', title: 'Mindset', description: 'Mental wellness & habits', icon: <Brain className="w-4 h-4" />, action: () => navigate('/mindset'), keywords: ['mindset', 'mind', 'mental', 'habits'], category: 'navigation' },
    { id: 'academy', title: 'Community & Education', description: 'Courses & community', icon: <Users className="w-4 h-4" />, action: () => navigate('/academy'), keywords: ['academy', 'learn', 'courses', 'community'], category: 'navigation' },
    { id: 'settings', title: 'Settings', icon: <Settings className="w-4 h-4" />, action: () => navigate('/settings'), keywords: ['settings', 'preferences', 'config'], category: 'navigation' },
    
    // System Actions
    { 
      id: 'toggle-theme', 
      title: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      description: 'Toggle between light and dark theme',
      icon: theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />, 
      action: () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
        toast.success(`Switched to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      }, 
      keywords: ['theme', 'dark', 'light', 'mode', 'toggle'], 
      category: 'system' 
    },
    { 
      id: 'refresh-data', 
      title: 'Refresh All Data', 
      description: 'Reload all cached data',
      icon: <RefreshCw className="w-4 h-4" />, 
      action: () => {
        queryClient.invalidateQueries();
        toast.success('Data refreshed');
      }, 
      keywords: ['refresh', 'reload', 'sync', 'update'], 
      category: 'system' 
    },
    { 
      id: 'sign-out', 
      title: 'Sign Out', 
      description: 'Log out of your account',
      icon: <LogOut className="w-4 h-4" />, 
      action: async () => {
        await signOut();
        navigate('/auth');
      }, 
      keywords: ['sign out', 'logout', 'exit'], 
      category: 'system' 
    },
  ], [navigate, theme, setTheme, signOut, queryClient, onOpenTaskModal, onOpenActivityLogger, onClose]);

  // Fuzzy search with highlighting
  const fuzzySearch = useCallback((items: CommandItem[], searchQuery: string) => {
    if (!searchQuery.trim()) return items.slice(0, 8);
    
    const lowerQuery = searchQuery.toLowerCase();
    
    return items
      .map((item) => {
        const titleMatch = item.title.toLowerCase().includes(lowerQuery);
        const keywordMatch = item.keywords.some((k) => k.includes(lowerQuery));
        const descMatch = item.description?.toLowerCase().includes(lowerQuery);
        
        let score = 0;
        if (titleMatch) score += 10;
        if (keywordMatch) score += 5;
        if (descMatch) score += 3;
        
        // Exact match bonus
        if (item.title.toLowerCase().startsWith(lowerQuery)) score += 15;
        
        return { ...item, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, []);

  const filteredCommands = useMemo(
    () => fuzzySearch(commands, query),
    [commands, query, fuzzySearch]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="text-primary font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Command Palette */}
          <motion.div
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="glass-card border border-border/50 shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder="Search commands, navigate, or ask..."
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
                  autoFocus
                />
                <button
                  onClick={() => setShowShortcuts(!showShortcuts)}
                  className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                  title="Keyboard shortcuts"
                >
                  <Keyboard className="w-4 h-4" />
                </button>
              </div>
              
              {/* Keyboard shortcuts overlay */}
              <AnimatePresence>
                {showShortcuts && (
                  <motion.div
                    className="absolute inset-0 bg-card/95 backdrop-blur-sm z-10 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className="text-sm font-semibold mb-4">Keyboard Shortcuts</h3>
                    <div className="space-y-2 text-sm">
                      {[
                        { keys: ['⌘', 'K'], action: 'Open command palette' },
                        { keys: ['↑', '↓'], action: 'Navigate results' },
                        { keys: ['Enter'], action: 'Select command' },
                        { keys: ['Esc'], action: 'Close' },
                        { keys: ['⌘', '1-6'], action: 'Quick module access' },
                      ].map((shortcut, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-muted-foreground">{shortcut.action}</span>
                          <div className="flex gap-1">
                            {shortcut.keys.map((key, j) => (
                              <kbd key={j} className="px-2 py-0.5 bg-muted rounded text-xs font-mono">
                                {key}
                              </kbd>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowShortcuts(false)}
                      className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Results */}
              <div className="max-h-80 overflow-y-auto py-2">
                {filteredCommands.length === 0 ? (
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No commands found for "{query}"</p>
                  </div>
                ) : (
                  filteredCommands.map((command, index) => (
                    <motion.button
                      key={command.id}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        index === selectedIndex
                          ? 'bg-primary/10 text-foreground'
                          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      }`}
                      onClick={() => {
                        command.action();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <div className={`p-1.5 rounded-md ${
                        index === selectedIndex ? 'bg-primary/20' : 'bg-muted/50'
                      }`}>
                        {command.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {highlightMatch(command.title, query)}
                        </div>
                        {command.description && (
                          <div className="text-xs text-muted-foreground truncate">
                            {command.description}
                          </div>
                        )}
                      </div>
                      {index === selectedIndex && (
                        <ArrowRight className="w-4 h-4 text-primary" />
                      )}
                    </motion.button>
                  ))
                )}
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-border/50 text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono">↵</kbd>
                    select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono">↑↓</kbd>
                    navigate
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Command className="w-3 h-3" />
                  <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono">K</kbd>
                  to toggle
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook for command palette keyboard shortcut
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
}
