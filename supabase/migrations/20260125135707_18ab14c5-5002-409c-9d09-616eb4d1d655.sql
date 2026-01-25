-- Add sessions table for QR-based authentication
CREATE TABLE public.sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token text NOT NULL UNIQUE,
  player_id uuid REFERENCES public.players(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '24 hours'),
  is_active boolean NOT NULL DEFAULT true
);

-- Add online status and presence confirmation to players
ALTER TABLE public.players 
ADD COLUMN is_online boolean NOT NULL DEFAULT false,
ADD COLUMN last_seen timestamp with time zone DEFAULT now(),
ADD COLUMN is_confirmed boolean NOT NULL DEFAULT false;

-- Enable RLS on sessions
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for sessions
CREATE POLICY "Anyone can create sessions" ON public.sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Sessions are readable by everyone" ON public.sessions FOR SELECT USING (true);
CREATE POLICY "Anyone can update sessions" ON public.sessions FOR UPDATE USING (true);

-- Update policies for players to allow updates (for online status)
CREATE POLICY "Anyone can update players" ON public.players FOR UPDATE USING (true);

-- Enable realtime for sessions
ALTER PUBLICATION supabase_realtime ADD TABLE public.sessions;