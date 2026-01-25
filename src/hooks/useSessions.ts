import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Session, generateSessionToken } from '@/types/database';
import { useEffect } from 'react';

export const useSessions = () => {
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading, error } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Session[];
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('sessions-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'sessions' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['sessions'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const createSession = useMutation({
    mutationFn: async (playerId?: string) => {
      const token = generateSessionToken();
      const { data, error } = await supabase
        .from('sessions')
        .insert([{ 
          token, 
          player_id: playerId || null,
          is_active: true
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data as Session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });

  const getSessionByToken = async (token: string): Promise<Session | null> => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('token', token)
      .eq('is_active', true)
      .maybeSingle();
    
    if (error) throw error;
    return data as Session | null;
  };

  const linkPlayerToSession = useMutation({
    mutationFn: async ({ sessionId, playerId }: { sessionId: string; playerId: string }) => {
      const { data, error } = await supabase
        .from('sessions')
        .update({ player_id: playerId })
        .eq('id', sessionId)
        .select()
        .single();
      
      if (error) throw error;
      return data as Session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });

  return {
    sessions,
    isLoading,
    error,
    createSession,
    getSessionByToken,
    linkPlayerToSession,
  };
};
