// Questo hook gestisce l'elenco dei partecipanti alla sfida.
// Permette di creare, aggiornare ed eliminare i giocatori dal database.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Player } from '@/types/database';
import { useEffect } from 'react';

// Opzioni per controllare il comportamento dell'hook
interface UsePlayersOptions {
  // Se true, disabilita la subscription realtime (utile per iOS Safari che ha problemi di memoria)
  disableRealtime?: boolean;
  // Intervallo di polling in millisecondi (opzionale)
  pollingInterval?: number;
}

export const usePlayers = (options?: UsePlayersOptions) => {
  const queryClient = useQueryClient();

  // Recupera tutti i giocatori presenti.
  const { data: players = [], isLoading, error } = useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Player[];
    },
    refetchInterval: options?.pollingInterval,
  });

  // Aggiorna la lista dei giocatori se qualcuno si aggiunge o cambia nome (può essere disabilitato per iOS)
  useEffect(() => {
    // Skip subscription se disableRealtime è true
    if (options?.disableRealtime) return;

    const channel = supabase
      .channel('players-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'players' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['players'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, options?.disableRealtime]);

  // Crea un nuovo profilo giocatore.
  const createPlayer = useMutation({
    mutationFn: async (username: string) => {
      const { data, error } = await supabase
        .from('players')
        .insert([{ username }])
        .select()
        .single();

      if (error) throw error;
      return data as Player;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });

  // Aggiorna lo stato di un giocatore (es: se è online o ha confermato la partecipazione).
  const updatePlayer = useMutation({
    mutationFn: async ({ id, username, is_confirmed, is_online }: { id: string; username?: string; is_confirmed?: boolean; is_online?: boolean }) => {
      const updateData: Partial<Pick<Player, 'username' | 'is_confirmed' | 'is_online'>> = {};
      if (username !== undefined) updateData.username = username;
      if (is_confirmed !== undefined) updateData.is_confirmed = is_confirmed;
      if (is_online !== undefined) updateData.is_online = is_online;

      const { data, error } = await supabase
        .from('players')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Player;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });

  // Elimina un giocatore e tutte le sue pizze e voti associati (pulizia ricorsiva).
  const deletePlayer = useMutation({
    mutationFn: async (id: string) => {
      // Prima eliminiamo i dati collegati per evitare errori di chiavi esterne (Foreign Keys).
      await supabase.from('votes').delete().eq('player_id', id);
      await supabase.from('pizzas').delete().eq('registered_by', id);
      await supabase.from('sessions').delete().eq('player_id', id);
      // Infine eliminiamo il profilo.
      const { error } = await supabase.from('players').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      queryClient.invalidateQueries({ queryKey: ['pizzas'] });
      queryClient.invalidateQueries({ queryKey: ['votes'] });
    },
  });

  return {
    players,
    isLoading,
    error,
    createPlayer,
    updatePlayer,
    deletePlayer,
  };
};
