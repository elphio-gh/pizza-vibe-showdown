import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Role } from '@/types/database';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  playerId: string | null;
  setPlayerId: (id: string | null) => void;
  playerName: string | null;
  setPlayerName: (name: string | null) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string | null>(null);

  return (
    <RoleContext.Provider value={{ 
      role, 
      setRole, 
      playerId, 
      setPlayerId, 
      playerName, 
      setPlayerName 
    }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
