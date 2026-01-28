// Questo file gestisce lo "stato globale" relativo ai ruoli degli utenti.
// Usiamo React Context per evitare di passare le informazioni (come il nome del giocatore)
// manualmente tra decine di componenti diversi.
// I dati vengono persistiti in localStorage per sopravvivere a refresh e chiusure del browser.
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Role } from '@/types/database';

// Chiavi localStorage per persistenza
const STORAGE_KEYS = {
  role: 'tbc_role',
  playerId: 'tbc_player_id',
  playerName: 'tbc_player_name'
};

// Helper per leggere da localStorage
const getStoredValue = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

// Helper per salvare in localStorage
const setStoredValue = <T,>(key: string, value: T): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

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
// Legge i valori iniziali da localStorage per garantire persistenza.
export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Inizializza con i valori salvati in localStorage
  const [role, setRoleState] = useState<Role>(() => getStoredValue<Role>(STORAGE_KEYS.role, null));
  const [playerId, setPlayerIdState] = useState<string | null>(() => getStoredValue(STORAGE_KEYS.playerId, null));
  const [playerName, setPlayerNameState] = useState<string | null>(() => getStoredValue(STORAGE_KEYS.playerName, null));

  // Wrapper per setRole che salva anche in localStorage
  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    setStoredValue(STORAGE_KEYS.role, newRole);
  };

  // Wrapper per setPlayerId che salva anche in localStorage
  const setPlayerId = (id: string | null) => {
    setPlayerIdState(id);
    setStoredValue(STORAGE_KEYS.playerId, id);
  };

  // Wrapper per setPlayerName che salva anche in localStorage
  const setPlayerName = (name: string | null) => {
    setPlayerNameState(name);
    setStoredValue(STORAGE_KEYS.playerName, name);
  };

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
