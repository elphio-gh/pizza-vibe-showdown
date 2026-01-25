import { useState, useEffect } from 'react';

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

export interface RecentProfile {
  id: string;
  username: string;
  lastUsed: string;
}

export const useRecentProfiles = () => {
  const [profiles, setProfiles] = useLocalStorage<RecentProfile[]>('tbc_recent_profiles', []);

  const addProfile = (profile: Omit<RecentProfile, 'lastUsed'>) => {
    const updated = [
      { ...profile, lastUsed: new Date().toISOString() },
      ...profiles.filter(p => p.id !== profile.id)
    ].slice(0, 5); // Keep only 5 most recent
    setProfiles(updated);
  };

  const removeProfile = (id: string) => {
    setProfiles(profiles.filter(p => p.id !== id));
  };

  return { profiles, addProfile, removeProfile };
};

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
