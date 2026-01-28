import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRole } from '@/contexts/RoleContext';
import { usePlayers } from '@/hooks/usePlayers';
import { User } from 'lucide-react';

export const PlayerOnboarding: React.FC = () => {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setPlayerId, setPlayerName } = useRole();
  // Disabilita realtime per evitare crash su iOS Safari
  const { createPlayer } = usePlayers({ disableRealtime: true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const player = await createPlayer.mutateAsync(username.trim());
      setPlayerId(player.id);
      setPlayerName(player.username);
    } catch (error) {
      console.error('Error creating player:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-6">
      <div className="w-full max-w-md space-y-8 animate-bounce-in">
        <div className="text-center space-y-4">
          <div className="text-8xl animate-float">🍕</div>
          <h1 className="font-display text-5xl text-primary text-glow-orange">
            Benvenuto!
          </h1>
          <p className="text-xl text-muted-foreground">
            Come ti chiami, pizza lover?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
            <Input
              type="text"
              placeholder="Il tuo nome..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-14 py-6 text-xl font-russo bg-card border-2 border-primary/50 focus:border-primary"
              maxLength={30}
              autoFocus
            />
          </div>

          <Button
            type="submit"
            disabled={!username.trim() || isSubmitting}
            className="w-full py-6 font-display text-2xl gradient-pizza text-primary-foreground box-glow-orange disabled:opacity-50"
          >
            {isSubmitting ? 'Caricamento...' : 'INIZIA 🚀'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Pronto a giudicare le pizze surgelate più buone? 😎
        </p>
      </div>
    </div>
  );
};
