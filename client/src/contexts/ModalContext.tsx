import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  isModificationsModalOpen: boolean;
  setIsModificationsModalOpen: (isOpen: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isModificationsModalOpen, setIsModificationsModalOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ isModificationsModalOpen, setIsModificationsModalOpen }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
