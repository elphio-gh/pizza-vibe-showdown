// Questo "hook" gestisce tutto ciò che riguarda i voti nel database.
// Utilizza React Query per recuperare i dati e Supabase per le operazioni in tempo reale.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Vote } from '@/types/database';
import { useEffect } from 'react';

// Opzioni per controllare il comportamento dell'hook
interface UseVotesOptions {
  // Se true, disabilita la subscription realtime (utile per iOS Safari che ha problemi di memoria)
  disableRealtime?: boolean;
}

export const useVotes = (options?: UseVotesOptions) => {
  const queryClient = useQueryClient();

  // Recupera l'elenco di tutti i voti dal database.
  const { data: votes = [], isLoading, error } = useQuery({
    queryKey: ['votes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('votes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Vote[];
    },
  });

  // Iscrizione in tempo reale (può essere disabilitata per risparmiare memoria su iOS)
  useEffect(() => {
    // Skip subscription se disableRealtime è true
    if (options?.disableRealtime) return;

    const channel = supabase
      .channel('votes-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'votes' },
        () => {
          // Forza React Query a scaricare di nuovo i dati aggiornati.
          queryClient.invalidateQueries({ queryKey: ['votes'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, options?.disableRealtime]);

  // Funzione per creare un nuovo voto (una "Mutation" in termini tecnici).
  const createVote = useMutation({
    mutationFn: async (vote: Omit<Vote, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('votes')
        .insert([vote])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    retry: 3,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['votes'] });
    },
  });

  // Funzione per aggiornare un voto esistente.
  const updateVote = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Vote> & { id: string }) => {
      const { data, error } = await supabase
        .from('votes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['votes'] });
    },
  });

  // Funzione per eliminare un voto.
  const deleteVote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('votes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['votes'] });
    },
  });

  // Helper per filtrare i voti.
  const getVotesByPlayer = (playerId: string) => {
    return votes.filter(vote => vote.player_id === playerId);
  };

  const getVotesByPizza = (pizzaId: string) => {
    return votes.filter(vote => vote.pizza_id === pizzaId);
  };

  const hasPlayerVotedForPizza = (playerId: string, pizzaId: string) => {
    return votes.some(vote => vote.player_id === playerId && vote.pizza_id === pizzaId);
  };

  return {
    votes,
    isLoading,
    error,
    createVote,
    updateVote,
    deleteVote,
    getVotesByPlayer,
    getVotesByPizza,
    hasPlayerVotedForPizza,
  };
};
