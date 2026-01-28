import React, { useState, useEffect, useCallback } from 'react';
import { Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { PlayerOnboarding } from '@/components/player/PlayerOnboarding';
import { PizzaList } from '@/components/player/PizzaList';
import { VotingCard } from '@/components/player/VotingCard';
import { Pizza, Vote } from '@/types/database';
import { useCurrentSession, useRecentProfiles } from '@/hooks/useLocalStorage';
import { useSessions } from '@/hooks/useSessions';
import { usePlayers } from '@/hooks/usePlayers';
import { usePizzas } from '@/hooks/usePizzas';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, LogOut } from 'lucide-react';
import { formatTitleCase } from '@/lib/stringUtils';

const PlayerPage: React.FC = () => {
  const { role, playerId, setPlayerId, setPlayerName, setRole } = useRole();
  const [selectedPizza, setSelectedPizza] = useState<{ pizza: Pizza; vote?: Vote } | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { currentPlayerId, setCurrentPlayerId, currentPlayerName, setCurrentPlayerName, setSessionToken, clearSession } = useCurrentSession();
  const { addProfile } = useRecentProfiles();
  const { getSessionByToken, linkPlayerToSession } = useSessions();
  // Disabilita realtime per evitare crash su iOS Safari
  const { createPlayer, players, updatePlayer } = usePlayers({ disableRealtime: true });
  const { pizzas } = usePizzas({ disableRealtime: true });


  // Check if player has registered a pizza
  const myPizza = pizzas.find(p => p.registered_by === playerId);

  // Handle selecting a pizza - push state to browser history
  const handleSelectPizza = useCallback((pizza: Pizza, vote?: Vote) => {
    setSelectedPizza({ pizza, vote });
    // Push a state to browser history so back button works
    window.history.pushState({ voting: true }, '', window.location.href);
  }, []);

  // Handle going back from voting
  const handleBackFromVoting = useCallback(() => {
    setSelectedPizza(null);
  }, []);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (selectedPizza) {
        // If we're in voting mode, go back to list
        setSelectedPizza(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedPizza]);

  // Handle QR code token on mount
  useEffect(() => {
    const handleTokenLogin = async () => {
      const token = searchParams.get('token');

      if (token) {
        setSessionToken(token);
        setRole('player');

        // Check if session exists and has a player
        const session = await getSessionByToken(token);

        if (session?.player_id) {
          // Existing player in session
          const player = players.find(p => p.id === session.player_id);
          if (player) {
            setPlayerId(player.id);
            setPlayerName(player.username);
            setCurrentPlayerId(player.id);
            setCurrentPlayerName(player.username);
            addProfile({ id: player.id, username: player.username });
            // Auto-confirm presence
            if (!player.is_confirmed) {
              updatePlayer.mutate({ id: player.id, is_confirmed: true });
            }
          }
        } else if (session) {
          // New session - player will enter nickname through onboarding
          // Don't auto-create, just set role and let onboarding handle it
        }
      } else if (currentPlayerId && currentPlayerName) {
        // Restore from localStorage
        setPlayerId(currentPlayerId);
        setPlayerName(currentPlayerName);
        setRole('player');
      }
    };

    if (!playerId) {
      handleTokenLogin();
    }
  }, [searchParams, playerId]);

  // Auto-set role if coming directly
  useEffect(() => {
    if (!role) {
      setRole('player');
    }
  }, [role, setRole]);

  // If role is null, we are initializing. Don't redirect yet.
  // If after init we are not player (e.g. admin logged in but went to /player?), we might redirect,
  // but simpler to just show a loader.
  if (role === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl">🍕</div>
      </div>
    );
  }

  // Only redirect if explicitly set to another role than player (unlikely in this context but safe)
  if (role !== 'player' && role !== null) {
    // Actually, if we are here, we might just want to force player role?
    // For now, let's just let it be, or redirect if it is explicitly 'admin' or 'tv'
    return <Navigate to="/" replace />;
  }

  // Funzione per tornare alla home senza eliminare la sessione
  const handleLogout = () => {
    navigate('/');
  };

  if (!playerId) {
    return <PlayerOnboarding />;
  }

  // Show voting card if pizza selected
  if (selectedPizza) {
    return (
      <div className="container mx-auto px-4 pt-6 pb-8">
        <VotingCard
          pizza={selectedPizza.pizza}
          existingVote={selectedPizza.vote}
          onBack={handleBackFromVoting}
        />
      </div>
    );
  }

  // Default: Show pizza list for voting (no tabs, no presence confirmation)
  const currentPlayer = players.find(p => p.id === playerId);

  return (
    <div className="container mx-auto px-4 pt-6 pb-8">
      {/* Header con saluto e pulsante logout */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-3xl sm:text-4xl text-primary text-glow-orange">
            Ciao {formatTitleCase(currentPlayer?.username) || ''}! 🍕
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive flex items-center gap-1.5 shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Esci</span>
          </Button>
        </div>
        <p className="font-sans text-muted-foreground mt-1">
          Vota le pizze dei tuoi amici!
        </p>
      </div>

      {/* My Pizza Button - harmonized with app style */}
      <div className="mb-6">
        <Button
          onClick={() => navigate('/my-pizza')}
          className={`w-full h-auto py-4 flex-col gap-1 font-sans font-bold text-xl transition-all ${myPizza
            ? 'bg-accent/20 border-2 border-accent text-accent hover:bg-accent/30'
            : 'gradient-pizza text-primary-foreground box-glow-orange'
            }`}
        >
          {myPizza ? (
            <>
              <div className="flex items-center gap-2 text-sm uppercase opacity-90 mb-1">
                <Pencil className="w-4 h-4" /> Modifica la tua pizza
              </div>
              <div className="text-xl leading-tight text-center w-full whitespace-normal break-words px-2">
                {myPizza.brand} - {myPizza.flavor}
              </div>
            </>
          ) : (
            <>
              <Plus className="w-6 h-6 mr-2" />
              Registra la tua Pizza 🍕
            </>
          )}
        </Button>
      </div>

      <PizzaList onSelectPizza={handleSelectPizza} />
    </div>
  );
};

export default PlayerPage;


