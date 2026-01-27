import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Vote } from '@/types/database';
import { useEffect } from 'react';

export const useVotes = () => {
  const queryClient = useQueryClient();

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

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('votes-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'votes' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['votes'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

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
