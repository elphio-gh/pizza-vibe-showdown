import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Pizza } from '@/types/database';
import { useEffect } from 'react';

// Opzioni per controllare il comportamento dell'hook
interface UsePizzasOptions {
  // Se true, disabilita la subscription realtime (utile per iOS Safari che ha problemi di memoria)
  disableRealtime?: boolean;
}

export const usePizzas = (options?: UsePizzasOptions) => {
  const queryClient = useQueryClient();

  const { data: pizzas = [], isLoading, error } = useQuery({
    queryKey: ['pizzas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pizzas')
        .select('*')
        .order('number', { ascending: true });

      if (error) throw error;
      return data as Pizza[];
    },
  });

  // Real-time subscription (può essere disabilitata per risparmiare memoria su iOS)
  useEffect(() => {
    // Skip subscription se disableRealtime è true
    if (options?.disableRealtime) return;

    const channel = supabase
      .channel('pizzas-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'pizzas' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['pizzas'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, options?.disableRealtime]);

  const createPizza = useMutation({
    mutationFn: async ({ brand, flavor, registered_by }: { brand: string; flavor: string; registered_by?: string }) => {
      // Get the next pizza number by finding the max current number
      // This ensures numbering starts from 1 after a game reset
      const { data: maxData } = await supabase
        .from('pizzas')
        .select('number')
        .order('number', { ascending: false })
        .limit(1)
        .single();

      const nextNumber = (maxData?.number ?? 0) + 1;

      const { data, error } = await supabase
        .from('pizzas')
        .insert([{ brand, flavor, registered_by, number: nextNumber }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizzas'] });
    },
  });

  const updatePizza = useMutation({
    mutationFn: async ({ id, brand, flavor, registered_by }: { id: string; brand: string; flavor: string; registered_by?: string | null }) => {
      const updateData: { brand: string; flavor: string; registered_by?: string | null } = { brand, flavor };
      if (registered_by !== undefined) {
        updateData.registered_by = registered_by;
      }
      const { data, error } = await supabase
        .from('pizzas')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizzas'] });
    },
  });

  const deletePizza = useMutation({
    mutationFn: async (id: string) => {
      // First delete related votes
      await supabase.from('votes').delete().eq('pizza_id', id);
      // Then delete pizza
      const { error } = await supabase
        .from('pizzas')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizzas'] });
      queryClient.invalidateQueries({ queryKey: ['votes'] });
    },
  });

  return {
    pizzas,
    isLoading,
    error,
    createPizza,
    updatePizza,
    deletePizza,
  };
};
