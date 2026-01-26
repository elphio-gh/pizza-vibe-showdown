import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Player } from '@/types/database';
import { useEffect } from 'react';

export const usePlayers = () => {
  const queryClient = useQueryClient();

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
  });

  // Real-time subscription
  useEffect(() => {
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
  }, [queryClient]);

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

  const updatePlayer = useMutation({
    mutationFn: async ({ id, username }: { id: string; username: string }) => {
      const { data, error } = await supabase
        .from('players')
        .update({ username })
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

  const deletePlayer = useMutation({
    mutationFn: async (id: string) => {
      // First delete related votes
      await supabase.from('votes').delete().eq('player_id', id);
      // Then delete related pizzas
      await supabase.from('pizzas').delete().eq('registered_by', id);
      // Then delete sessions
      await supabase.from('sessions').delete().eq('player_id', id);
      // Finally delete player
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
