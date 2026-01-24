-- Create players table
CREATE TABLE public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on players
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Players are readable by everyone (for voting/display)
CREATE POLICY "Players are readable by everyone" 
  ON public.players FOR SELECT 
  USING (true);

-- Anyone can create a player (no auth required for this game)
CREATE POLICY "Anyone can create players" 
  ON public.players FOR INSERT 
  WITH CHECK (true);

-- Create pizzas table with auto-incrementing number
CREATE TABLE public.pizzas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number SERIAL,
  brand TEXT NOT NULL,
  flavor TEXT NOT NULL,
  registered_by UUID REFERENCES public.players(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on pizzas
ALTER TABLE public.pizzas ENABLE ROW LEVEL SECURITY;

-- Pizzas are readable by everyone
CREATE POLICY "Pizzas are readable by everyone" 
  ON public.pizzas FOR SELECT 
  USING (true);

-- Anyone can create pizzas
CREATE POLICY "Anyone can create pizzas" 
  ON public.pizzas FOR INSERT 
  WITH CHECK (true);

-- Anyone can update pizzas (for admin functionality)
CREATE POLICY "Anyone can update pizzas" 
  ON public.pizzas FOR UPDATE 
  USING (true);

-- Anyone can delete pizzas (for admin functionality)
CREATE POLICY "Anyone can delete pizzas" 
  ON public.pizzas FOR DELETE 
  USING (true);

-- Create votes table
CREATE TABLE public.votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pizza_id UUID NOT NULL REFERENCES public.pizzas(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  aspetto INTEGER NOT NULL CHECK (aspetto >= 1 AND aspetto <= 10),
  gusto INTEGER NOT NULL CHECK (gusto >= 1 AND gusto <= 10),
  impasto INTEGER NOT NULL CHECK (impasto >= 1 AND impasto <= 10),
  farcitura INTEGER NOT NULL CHECK (farcitura >= 1 AND farcitura <= 10),
  tony_factor INTEGER NOT NULL CHECK (tony_factor >= 1 AND tony_factor <= 10),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(pizza_id, player_id)
);

-- Enable RLS on votes
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Votes are readable by everyone
CREATE POLICY "Votes are readable by everyone" 
  ON public.votes FOR SELECT 
  USING (true);

-- Anyone can create votes
CREATE POLICY "Anyone can create votes" 
  ON public.votes FOR INSERT 
  WITH CHECK (true);

-- Anyone can update votes (for admin functionality)
CREATE POLICY "Anyone can update votes" 
  ON public.votes FOR UPDATE 
  USING (true);

-- Anyone can delete votes (for admin functionality)
CREATE POLICY "Anyone can delete votes" 
  ON public.votes FOR DELETE 
  USING (true);

-- Create tv_commands table for real-time TV control
CREATE TABLE public.tv_commands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  command TEXT NOT NULL DEFAULT 'waiting' CHECK (command IN ('waiting', 'reveal', 'winner', 'next', 'reset')),
  current_position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on tv_commands
ALTER TABLE public.tv_commands ENABLE ROW LEVEL SECURITY;

-- TV commands are readable by everyone
CREATE POLICY "TV commands are readable by everyone" 
  ON public.tv_commands FOR SELECT 
  USING (true);

-- Anyone can update TV commands (for admin functionality)
CREATE POLICY "Anyone can update TV commands" 
  ON public.tv_commands FOR UPDATE 
  USING (true);

-- Anyone can insert TV commands
CREATE POLICY "Anyone can insert TV commands" 
  ON public.tv_commands FOR INSERT 
  WITH CHECK (true);

-- Insert initial TV command state
INSERT INTO public.tv_commands (command, current_position) VALUES ('waiting', 0);

-- Enable real-time for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pizzas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tv_commands;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for tv_commands updated_at
CREATE TRIGGER update_tv_commands_updated_at
  BEFORE UPDATE ON public.tv_commands
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();