import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Archive, 
  MoreVertical,
  Clock,
  Sparkles,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { useConversationHistory, Conversation } from '@/hooks/useConversationHistory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

interface ConversationHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation?: (conversation: Conversation) => void;
}

export const ConversationHistoryPanel: React.FC<ConversationHistoryPanelProps> = ({
  isOpen,
  onClose,
  onSelectConversation,
}) => {
  const {
    conversations,
    currentConversation,
    isLoading,
    createConversation,
    switchConversation,
    archiveConversation,
    updateTitle,
    searchConversations,
  } = useConversationHistory();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Conversation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const displayedConversations = searchQuery ? searchResults : conversations;

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      const results = await searchConversations(query);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const handleNewConversation = async () => {
    const conv = await createConversation();
    if (conv && onSelectConversation) {
      onSelectConversation(conv);
    }
  };

  const handleSelectConversation = async (conversation: Conversation) => {
    await switchConversation(conversation.id);
    if (onSelectConversation) {
      onSelectConversation(conversation);
    }
  };

  const handleStartEdit = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title || '');
  };

  const handleSaveEdit = async () => {
    if (editingId && editTitle.trim()) {
      await updateTitle(editingId, editTitle);
      setEditingId(null);
      setEditTitle('');
    }
  };

  const getPersonalityIcon = (mode: string) => {
    const icons: Record<string, string> = {
      executive: '👔',
      coach: '🏃',
      muse: '🎨',
      analyst: '📊',
      guardian: '🛡️',
      zen: '🧘',
    };
    return icons[mode] || '💬';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed left-0 top-0 bottom-0 w-80 bg-card/95 backdrop-blur-xl border-r border-border/50 z-50 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Conversations
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 bg-background/50"
              />
            </div>
          </div>

          {/* New Conversation Button */}
          <div className="p-3">
            <Button
              onClick={handleNewConversation}
              className="w-full gap-2"
              variant="outline"
            >
              <Plus className="w-4 h-4" />
              New Conversation
            </Button>
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {isLoading || isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                </div>
              ) : displayedConversations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {searchQuery ? 'No conversations found' : 'No conversations yet'}
                  </p>
                </div>
              ) : (
                displayedConversations.map((conversation) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`
                      group relative rounded-lg p-3 cursor-pointer transition-all
                      ${currentConversation?.id === conversation.id 
                        ? 'bg-primary/10 border border-primary/30' 
                        : 'hover:bg-accent/50 border border-transparent'
                      }
                    `}
                    onClick={() => handleSelectConversation(conversation)}
                  >
                    {editingId === conversation.id ? (
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                          autoFocus
                          className="h-8 text-sm"
                        />
                        <Button size="sm" onClick={handleSaveEdit}>
                          Save
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-base">
                                {getPersonalityIcon(conversation.personality_mode)}
                              </span>
                              <span className="font-medium text-sm truncate text-foreground">
                                {conversation.title || 'Untitled'}
                              </span>
                            </div>
                            
                            {conversation.summary && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                {conversation.summary}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                {conversation.message_count}
                              </span>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleStartEdit(conversation)}>
                                <Edit2 className="w-4 h-4 mr-2" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => archiveConversation(conversation.id)}
                                className="text-destructive"
                              >
                                <Archive className="w-4 h-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Footer Stats */}
          <div className="p-3 border-t border-border/50 bg-background/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{conversations.length} conversations</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {conversations.reduce((acc, c) => acc + c.message_count, 0)} messages
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
