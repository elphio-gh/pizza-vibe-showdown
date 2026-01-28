// Questo file gestisce lo "stato globale" relativo ai ruoli degli utenti.
// Usiamo React Context per evitare di passare le informazioni (come il nome del giocatore)
// manualmente tra decine di componenti diversi.
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Role } from '@/types/database';

// Definiamo quali dati vogliamo condividere in tutta l'app.
interface RoleContextType {
  role: Role;                    // Il ruolo attuale: 'admin', 'player' o null
  setRole: (role: Role) => void; // Funzione per cambiare il ruolo
  playerId: string | null;       // L'ID univoco del giocatore (da database)
  setPlayerId: (id: string | null) => void;
  playerName: string | null;     // Il nome visualizzato del giocatore
  setPlayerName: (name: string | null) => void;
}

// Creiamo il contenitore (Context) per questi dati.
const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Il Provider è il componente che "avvolge" l'app e fornisce i dati.
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

// Hook personalizzato per accedere facilmente ai dati del ruolo in qualsiasi componente.
export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
