import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface ShortcutHint {
  key: string;
  description: string;
}

const shortcuts: ShortcutHint[] = [
  { key: '⌘K', description: 'Open command palette' },
  { key: '⌘/', description: 'Toggle help' },
  { key: 'Esc', description: 'Close dialogs' },
  { key: '↑↓', description: 'Navigate lists' },
  { key: 'Tab', description: 'Move focus' },
];

export const KeyboardHints: React.FC = () => {
  const [showHints, setShowHints] = useState(false);
  const [keyboardUser, setKeyboardUser] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect keyboard navigation
      if (e.key === 'Tab') {
        setKeyboardUser(true);
      }
      
      // Toggle hints with Cmd/Ctrl + ?
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setShowHints(prev => !prev);
      }
    };

    const handleMouseDown = () => {
      setKeyboardUser(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <AnimatePresence>
      {showHints && keyboardUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 left-4 z-[9990] p-4 rounded-xl bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl"
        >
          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-foreground">
            <Command className="h-4 w-4" />
            <span>Keyboard Shortcuts</span>
          </div>
          <div className="space-y-2">
            {shortcuts.map((shortcut) => (
              <div key={shortcut.key} className="flex items-center justify-between gap-4 text-xs">
                <kbd className="px-2 py-1 rounded bg-muted font-mono text-muted-foreground">
                  {shortcut.key}
                </kbd>
                <span className="text-muted-foreground">{shortcut.description}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 pt-3 border-t border-border/30 text-xs text-muted-foreground">
            Press ⌘/ to toggle this panel
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
