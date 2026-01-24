import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Pizza } from '@/types/database';
import { useEffect } from 'react';

export const usePizzas = () => {
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

  // Real-time subscription
  useEffect(() => {
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
  }, [queryClient]);

  const createPizza = useMutation({
    mutationFn: async ({ brand, flavor, registered_by }: { brand: string; flavor: string; registered_by?: string }) => {
      const { data, error } = await supabase
        .from('pizzas')
        .insert([{ brand, flavor, registered_by }])
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
    mutationFn: async ({ id, brand, flavor }: { id: string; brand: string; flavor: string }) => {
      const { data, error } = await supabase
        .from('pizzas')
        .update({ brand, flavor })
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
      const { error } = await supabase
        .from('pizzas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizzas'] });
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
