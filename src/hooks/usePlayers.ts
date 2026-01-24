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

  return {
    players,
    isLoading,
    error,
    createPlayer,
  };
};
