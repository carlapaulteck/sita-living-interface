import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface QuickActionsContextType {
  showTaskModal: boolean;
  showActivityLogger: boolean;
  openTaskModal: () => void;
  closeTaskModal: () => void;
  openActivityLogger: () => void;
  closeActivityLogger: () => void;
}

const QuickActionsContext = createContext<QuickActionsContextType | undefined>(undefined);

export const useQuickActions = () => {
  const context = useContext(QuickActionsContext);
  if (!context) {
    throw new Error('useQuickActions must be used within QuickActionsProvider');
  }
  return context;
};

interface QuickActionsProviderProps {
  children: ReactNode;
}

export const QuickActionsProvider: React.FC<QuickActionsProviderProps> = ({ children }) => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showActivityLogger, setShowActivityLogger] = useState(false);

  const openTaskModal = useCallback(() => setShowTaskModal(true), []);
  const closeTaskModal = useCallback(() => setShowTaskModal(false), []);
  const openActivityLogger = useCallback(() => setShowActivityLogger(true), []);
  const closeActivityLogger = useCallback(() => setShowActivityLogger(false), []);

  return (
    <QuickActionsContext.Provider
      value={{
        showTaskModal,
        showActivityLogger,
        openTaskModal,
        closeTaskModal,
        openActivityLogger,
        closeActivityLogger,
      }}
    >
      {children}
    </QuickActionsContext.Provider>
  );
};
