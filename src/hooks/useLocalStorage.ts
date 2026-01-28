// Questo file gestisce il "LocalStorage", ovvero la memoria del browser.
// Serve a far sì che se l'utente ricarica la pagina, l'app si ricordi ancora chi è
// e se ha già inserito la password.
import { useState } from 'react';

// Hook generico per salvare qualsiasi dato nel browser in formato JSON.
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  };

  return [storedValue, setValue];
}

// Gestisce l'elenco dei profili usati di recente su questo dispositivo.
export const useRecentProfiles = () => {
  const [profiles, setProfiles] = useLocalStorage<RecentProfile[]>('tbc_recent_profiles', []);

  const addProfile = (profile: Omit<RecentProfile, 'lastUsed'>) => {
    const updated = [
      { ...profile, lastUsed: new Date().toISOString() },
      ...profiles.filter(p => p.id !== profile.id)
    ].slice(0, 5); // Teniamo solo i 5 più recenti
    setProfiles(updated);
  };

  const removeProfile = (id: string) => {
    setProfiles(profiles.filter(p => p.id !== id));
  };

  return { profiles, addProfile, removeProfile };
};

// Gestisce i dati della sessione attuale dell'utente (Token, ID, Nome).
export const useCurrentSession = () => {
  const [sessionToken, setSessionToken] = useLocalStorage<string | null>('tbc_session_token', null);
  const [currentPlayerId, setCurrentPlayerId] = useLocalStorage<string | null>('tbc_player_id', null);
  const [currentPlayerName, setCurrentPlayerName] = useLocalStorage<string | null>('tbc_player_name', null);

  const clearSession = () => {
    setSessionToken(null);
    setCurrentPlayerId(null);
    setCurrentPlayerName(null);
  };

  return {
    sessionToken,
    setSessionToken,
    currentPlayerId,
    setCurrentPlayerId,
    currentPlayerName,
    setCurrentPlayerName,
    clearSession
  };
};

// Gestisce l'autenticazione per ogni ruolo (Admin, TV, Giocatore).
export const useRoleAuth = () => {
  const [auth, setAuth] = useLocalStorage<RoleAuth>('tbc_role_auth', {
    admin: false,
    tv: false,
    player: false
  });

  const setRoleAuthenticated = (role: 'admin' | 'tv' | 'player') => {
    setAuth({ ...auth, [role]: true });
  };

  const isRoleAuthenticated = (role: 'admin' | 'tv' | 'player') => {
    return auth[role];
  };

  const clearAllAuth = () => {
    setAuth({ admin: false, tv: false, player: false });
  };

  return { auth, setRoleAuthenticated, isRoleAuthenticated, clearAllAuth };
};

export interface RecentProfile {
  id: string;
  username: string;
  lastUsed: string;
}

export interface RoleAuth {
  admin: boolean;
  tv: boolean;
  player: boolean;
}
