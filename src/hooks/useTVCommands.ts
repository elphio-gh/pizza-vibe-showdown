import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TVCommand } from '@/types/database';
import { useEffect } from 'react';

export const useTVCommands = () => {
  const queryClient = useQueryClient();

  const { data: tvCommand, isLoading, error } = useQuery({
    queryKey: ['tv-command'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tv_commands')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data as TVCommand;
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('tv-commands-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tv_commands' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['tv-command'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const updateCommand = useMutation({
    mutationFn: async ({ command, current_position }: { command: TVCommand['command']; current_position?: number }) => {
      const { data: existing } = await supabase
        .from('tv_commands')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (existing) {
        const { data, error } = await supabase
          .from('tv_commands')
          .update({ 
            command, 
            current_position: current_position ?? 0,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('tv_commands')
          .insert([{ command, current_position: current_position ?? 0 }])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tv-command'] });
    },
  });

  const setWaiting = () => updateCommand.mutate({ command: 'waiting', current_position: 0 });
  const setReveal = () => updateCommand.mutate({ command: 'reveal', current_position: 0 });
  const setWinner = () => updateCommand.mutate({ command: 'winner' });
  
  const nextPosition = () => {
    if (tvCommand) {
      updateCommand.mutate({ 
        command: 'reveal', 
        current_position: tvCommand.current_position + 1 
      });
    }
  };
  
  const prevPosition = () => {
    if (tvCommand && tvCommand.current_position > 0) {
      updateCommand.mutate({ 
        command: 'reveal', 
        current_position: tvCommand.current_position - 1 
      });
    }
  };
  
  const setPosition = (position: number) => {
    updateCommand.mutate({ 
      command: 'reveal', 
      current_position: position 
    });
  };
  
  const resetGame = () => updateCommand.mutate({ command: 'reset', current_position: 0 });

  return {
    tvCommand,
    isLoading,
    error,
    updateCommand,
    setWaiting,
    setReveal,
    setWinner,
    nextPosition,
    prevPosition,
    setPosition,
    resetGame,
  };
};
