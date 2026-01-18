import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, Utensils, Moon, Shield, Send, 
  Sparkles, ChevronDown, FileText, Download
} from 'lucide-react';
import { BioCard, BioHeroCard } from './BioCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { demoCoachMessages, CoachMessage } from '@/lib/bioOSData';
import { cn } from '@/lib/utils';

const roleConfig: Record<string, { icon: typeof Dumbbell; color: string; gradient: string; label: string }> = {
  strength: { 
    icon: Dumbbell, 
    color: 'text-amber-400', 
    gradient: 'from-amber-500 to-orange-600',
    label: 'Strength Coach' 
  },
  nutrition: { 
    icon: Utensils, 
    color: 'text-emerald-400', 
    gradient: 'from-emerald-500 to-green-600',
    label: 'Nutrition Coach' 
  },
  recovery: { 
    icon: Moon, 
    color: 'text-cyan-400', 
    gradient: 'from-cyan-500 to-blue-600',
    label: 'Recovery Coach' 
  },
  safety: { 
    icon: Shield, 
    color: 'text-purple-400', 
    gradient: 'from-purple-500 to-pink-600',
    label: 'Safety Officer' 
  }
};

const quickQuestions = [
  "What should I eat before my workout?",
  "Can I train legs today?",
  "How can I improve my sleep?",
  "Is my current protein intake enough?"
];

export function CoachTeam() {
  const [messages, setMessages] = useState<CoachMessage[]>(demoCoachMessages);
  const [inputValue, setInputValue] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isClinicianMode, setIsClinicianMode] = useState(false);

  const filteredMessages = activeFilters.length > 0
    ? messages.filter(m => activeFilters.includes(m.role))
    : messages;

  const toggleFilter = (role: string) => {
    setActiveFilters(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    // Simulate adding user message and getting response
    const newMessage: CoachMessage = {
      id: Date.now().toString(),
      role: 'nutrition', // Example: nutrition coach responds
      content: `Based on your question about "${inputValue}", I recommend focusing on your post-workout nutrition. Aim for 30-40g of protein within 30 minutes of training, combined with fast-digesting carbs to optimize recovery.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: ['Current protein goal: 180g/day', 'Last workout: Push Day']
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <BioHeroCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Your Coach Team</h2>
            <p className="text-muted-foreground">
              Expert guidance from your personal advisory board
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant={isClinicianMode ? 'default' : 'outline'}
              onClick={() => setIsClinicianMode(!isClinicianMode)}
              className={cn(
                isClinicianMode 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600' 
                  : 'border-white/20'
              )}
            >
              <Shield className="w-4 h-4 mr-2" />
              Clinician Mode
            </Button>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600">
              <FileText className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Coach Avatars */}
        <div className="flex justify-center gap-6">
          {Object.entries(roleConfig).map(([role, config]) => {
            const Icon = config.icon;
            const isActive = activeFilters.length === 0 || activeFilters.includes(role);

            return (
              <motion.button
                key={role}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleFilter(role)}
                className="flex flex-col items-center gap-2"
              >
                <div className={cn(
                  'w-16 h-16 rounded-2xl flex items-center justify-center transition-all',
                  'bg-gradient-to-br',
                  config.gradient,
                  !isActive && 'opacity-40 grayscale'
                )}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <span className={cn(
                  'text-sm font-medium',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {config.label.split(' ')[0]}
                </span>
              </motion.button>
            );
          })}
        </div>
      </BioHeroCard>

      {/* Quick Questions */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {quickQuestions.map((question) => (
          <motion.button
            key={question}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setInputValue(question)}
            className="px-4 py-2 rounded-full bg-white/10 text-sm text-muted-foreground whitespace-nowrap hover:bg-white/20 transition-all"
          >
            {question}
          </motion.button>
        ))}
      </div>

      {/* Messages */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        <AnimatePresence>
          {filteredMessages.map((message, index) => {
            const config = roleConfig[message.role];
            const Icon = config.icon;

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <BioCard className="p-4" gradient={config.gradient}>
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center',
                      'bg-gradient-to-br',
                      config.gradient
                    )}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className={cn('font-medium', config.color)}>
                          {config.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp}
                        </span>
                      </div>

                      <p className="text-foreground leading-relaxed">
                        {message.content}
                      </p>

                      {/* Citations */}
                      {message.citations && message.citations.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.citations.map((citation, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 rounded-md bg-white/10 text-xs text-muted-foreground"
                            >
                              {citation}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </BioCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Input */}
      <BioCard className="p-4">
        <div className="flex gap-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your coach team anything..."
            className="bg-white/5 border-white/10 focus:border-cyan-500/50"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="bg-gradient-to-r from-cyan-500 to-blue-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </BioCard>

      {/* Clinician Mode Panel */}
      {isClinicianMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BioCard className="p-6" gradient="from-purple-500/20 to-pink-600/20">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Clinician Review Mode Active
                </h3>
                <p className="text-muted-foreground mb-4">
                  Generate a comprehensive health summary to share with your healthcare provider.
                </p>

                <div className="p-4 rounded-lg bg-white/5 mb-4">
                  <h4 className="font-medium text-foreground mb-2">Questions for Your Doctor</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      Review recent LDL improvements and discuss statin alternatives
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      Evaluate current training load given recent bloodwork
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      Discuss Vitamin D supplementation protocol
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-600">
                    <Download className="w-4 h-4 mr-2" />
                    Export FHIR Bundle
                  </Button>
                  <Button variant="outline" className="border-white/20">
                    <FileText className="w-4 h-4 mr-2" />
                    PDF Summary
                  </Button>
                </div>
              </div>
            </div>
          </BioCard>
        </motion.div>
      )}
    </div>
  );
}
