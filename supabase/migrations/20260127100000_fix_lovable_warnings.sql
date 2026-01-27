-- W1: Add DELETE policy for tv_commands
CREATE POLICY "Anyone can delete tv_commands"
ON public.tv_commands
FOR DELETE
USING (true);

-- W2: Set search_path for the trigger function to improve security
-- Supabase lint: 0011_function_search_path_mutable
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';
