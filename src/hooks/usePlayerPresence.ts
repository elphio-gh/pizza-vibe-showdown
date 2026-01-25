import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRole } from '@/contexts/RoleContext';

export const usePlayerPresence = () => {
  const { playerId } = useRole();

  const updatePresence = useCallback(async (isOnline: boolean) => {
    if (!playerId) return;

    await supabase
      .from('players')
      .update({ 
        is_online: isOnline, 
        last_seen: new Date().toISOString() 
      })
      .eq('id', playerId);
  }, [playerId]);

  const confirmPresence = useCallback(async () => {
    if (!playerId) return;

    await supabase
      .from('players')
      .update({ 
        is_confirmed: true,
        is_online: true,
        last_seen: new Date().toISOString()
      })
      .eq('id', playerId);
  }, [playerId]);

  useEffect(() => {
    if (!playerId) return;

    // Set online when component mounts
    updatePresence(true);

    // Heartbeat every 30 seconds
    const heartbeat = setInterval(() => {
      updatePresence(true);
    }, 30000);

    // Set offline when leaving
    const handleBeforeUnload = () => {
      // Use sendBeacon for reliable offline update
      const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/players?id=eq.${playerId}`;
      const data = JSON.stringify({ is_online: false, last_seen: new Date().toISOString() });
      navigator.sendBeacon(url, new Blob([data], { type: 'application/json' }));
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        updatePresence(false);
      } else {
        updatePresence(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(heartbeat);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      updatePresence(false);
    };
  }, [playerId, updatePresence]);

  return { updatePresence, confirmPresence };
};
