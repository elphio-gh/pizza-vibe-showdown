-- Allow anyone to delete players (admin will control this from UI)
CREATE POLICY "Anyone can delete players" 
ON public.players 
FOR DELETE 
USING (true);

-- Allow anyone to delete sessions (needed for reset)
CREATE POLICY "Anyone can delete sessions" 
ON public.sessions 
FOR DELETE 
USING (true);