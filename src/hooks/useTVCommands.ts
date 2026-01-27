import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TVCommand } from '@/types/database';
import { useEffect, useRef, useCallback } from 'react';

const MAX_RETRIES = 3;
const RETRY_DELAY = 500;

// Type definition for the actual DB schema (legacy)
type LegacyTVCommand = {
  id: string;
  command: 'waiting' | 'reveal' | 'winner' | 'next' | 'reset';
  current_position: number;
  created_at: string;
  updated_at: string;
};

export const useTVCommands = () => {
  const queryClient = useQueryClient();
  const pendingMutation = useRef(false);

  // Adapter: Convert DB representation to App representation
  const transformFromDB = (data: LegacyTVCommand): TVCommand => {
    // Map special "waiting" states to new app commands
    if (data.command === 'waiting') {
      if (data.current_position === -1) return { ...data, command: 'stop_televote' } as unknown as TVCommand;
      if (data.current_position === -2) return { ...data, command: 'pause' } as unknown as TVCommand;
      if (data.current_position === -3) return { ...data, command: 'pre_winner' } as unknown as TVCommand;
    }
    // Default pass-through
    return data as unknown as TVCommand;
  };

  // Adapter: Convert App representation to DB representation
  const transformToDB = (command: TVCommand['command'], position: number): { command: LegacyTVCommand['command'], current_position: number } => {
    switch (command) {
      case 'stop_televote':
        return { command: 'waiting', current_position: -1 };
      case 'pause':
        return { command: 'waiting', current_position: -2 };
      case 'pre_winner':
        return { command: 'waiting', current_position: -3 };
      default:
        // Ensure we don't pass invalid commands to DB
        if (['waiting', 'reveal', 'winner', 'next', 'reset'].includes(command)) {
          return { command: command as LegacyTVCommand['command'], current_position: position };
        }
        // Fallback for safety
        console.error('Unknown command:', command);
        return { command: 'waiting', current_position: 0 };
    }
  };

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
      return transformFromDB(data as LegacyTVCommand);
    },
    refetchInterval: 2000,
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
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          setTimeout(() => supabase.removeChannel(channel), 1000);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const updateCommand = useMutation({
    mutationFn: async ({
      command,
      current_position,
    }: {
      command: TVCommand['command'];
      current_position?: number;
    }): Promise<TVCommand> => {
      // Fetch existing ID
      const { data: existing } = await supabase
        .from('tv_commands')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Convert to DB format
      const dbPayload = transformToDB(command, current_position ?? 0);

      let resultData: LegacyTVCommand;

      if (existing) {
        const { data, error } = await supabase
          .from('tv_commands')
          .update({
            command: dbPayload.command,
            current_position: dbPayload.current_position,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        resultData = data as LegacyTVCommand;
      } else {
        const { data, error } = await supabase
          .from('tv_commands')
          .insert([{
            command: dbPayload.command,
            current_position: dbPayload.current_position
          }])
          .select()
          .single();

        if (error) throw error;
        resultData = data as LegacyTVCommand;
      }

      // Return transformed back to App format
      return transformFromDB(resultData);
    },
    // Use built-in retry for network stability
    retry: 3,
    onMutate: async ({ command, current_position }) => {
      await queryClient.cancelQueries({ queryKey: ['tv-command'] });
      const previousCommand = queryClient.getQueryData<TVCommand>(['tv-command']);

      if (previousCommand) {
        // Optimistically update with APP format
        queryClient.setQueryData<TVCommand>(['tv-command'], {
          ...previousCommand,
          command,
          current_position: current_position ?? previousCommand.current_position,
        });
      }
      return { previousCommand };
    },
    onError: async (err, variables, context) => {
      if (context?.previousCommand) {
        queryClient.setQueryData(['tv-command'], context.previousCommand);
      }
      console.error('TV Command failed after retries:', variables.command, err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tv-command'] });
      pendingMutation.current = false;
    },
    onSettled: () => {
      pendingMutation.current = false;
    },
  });

  const sendCommand = useCallback((command: TVCommand['command'], current_position?: number) => {
    if (pendingMutation.current) {
      console.warn('TV Command: Ignoring duplicate command while mutation pending');
      return;
    }
    pendingMutation.current = true;
    updateCommand.mutate({ command, current_position });
  }, [updateCommand]);

  const setWaiting = useCallback(() => sendCommand('waiting', 0), [sendCommand]);
  // Use current position for context, but adapter will force -1/-2
  const setStopTelevolto = useCallback(() => sendCommand('stop_televote', tvCommand?.current_position ?? 0), [sendCommand, tvCommand?.current_position]);
  const setPause = useCallback(() => sendCommand('pause', tvCommand?.current_position ?? 0), [sendCommand, tvCommand?.current_position]);
  const setReveal = useCallback(() => sendCommand('reveal', 1), [sendCommand]);
  const setPreWinner = useCallback(() => sendCommand('pre_winner', tvCommand?.current_position ?? 0), [sendCommand, tvCommand?.current_position]);
  const setWinner = useCallback(() => sendCommand('winner'), [sendCommand]);

  const nextPosition = useCallback(() => {
    if (tvCommand) {
      sendCommand('reveal', tvCommand.current_position + 1);
    }
  }, [sendCommand, tvCommand]);

  const prevPosition = useCallback(() => {
    if (tvCommand && tvCommand.current_position > 1) {
      sendCommand('reveal', tvCommand.current_position - 1);
    }
  }, [sendCommand, tvCommand]);

  const setPosition = useCallback((position: number) => {
    sendCommand('reveal', position);
  }, [sendCommand]);

  const resetGame = useCallback(() => sendCommand('reset', 0), [sendCommand]);

  return {
    tvCommand,
    isLoading: isLoading || updateCommand.isPending,
    isPending: updateCommand.isPending,
    error,
    updateCommand,
    setWaiting,
    setStopTelevolto,
    setPause,
    setReveal,
    setPreWinner,
    setWinner,
    nextPosition,
    prevPosition,
    setPosition,
    resetGame,
  };
};
