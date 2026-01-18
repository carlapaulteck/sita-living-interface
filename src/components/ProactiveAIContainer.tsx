import React from 'react';
import { useProactiveConversation } from '@/hooks/useProactiveConversation';
import { ProactivePromptStack } from './ProactivePrompt';

interface ProactiveAIContainerProps {
  onOpenConsole?: () => void;
}

export const ProactiveAIContainer: React.FC<ProactiveAIContainerProps> = ({
  onOpenConsole,
}) => {
  const {
    pendingTriggers,
    dismissTrigger,
    recordInteraction,
  } = useProactiveConversation();

  const handleAccept = (timestamp: Date) => {
    dismissTrigger(timestamp);
    recordInteraction();
    onOpenConsole?.();
  };

  const handleDismiss = (timestamp: Date) => {
    dismissTrigger(timestamp);
    recordInteraction();
  };

  if (pendingTriggers.length === 0) return null;

  return (
    <ProactivePromptStack
      prompts={pendingTriggers}
      onAccept={handleAccept}
      onDismiss={handleDismiss}
    />
  );
};
