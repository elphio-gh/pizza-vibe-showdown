import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { Navigation } from '@/components/shared/Navigation';
import { PlayerOnboarding } from '@/components/player/PlayerOnboarding';
import { PizzaList } from '@/components/player/PizzaList';
import { VotingCard } from '@/components/player/VotingCard';
import { Pizza, Vote, generateRandomNickname } from '@/types/database';
import { useCurrentSession, useRecentProfiles } from '@/hooks/useLocalStorage';
import { useSessions } from '@/hooks/useSessions';
import { usePlayers } from '@/hooks/usePlayers';
import { usePlayerPresence } from '@/hooks/usePlayerPresence';

const PlayerPage: React.FC = () => {
  const { role, playerId, setPlayerId, setPlayerName, setRole } = useRole();
  const [selectedPizza, setSelectedPizza] = useState<{ pizza: Pizza; vote?: Vote } | null>(null);
  const [searchParams] = useSearchParams();
  
  const { currentPlayerId, setCurrentPlayerId, currentPlayerName, setCurrentPlayerName, setSessionToken } = useCurrentSession();
  const { addProfile } = useRecentProfiles();
  const { getSessionByToken, linkPlayerToSession } = useSessions();
  const { createPlayer, players, updatePlayer } = usePlayers();

  // Use presence tracking - auto confirms presence
  usePlayerPresence();

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
          // New session - create player with random nickname
          const nickname = generateRandomNickname();
          try {
            const player = await createPlayer.mutateAsync(nickname);
            setPlayerId(player.id);
            setPlayerName(player.username);
            setCurrentPlayerId(player.id);
            setCurrentPlayerName(player.username);
            addProfile({ id: player.id, username: player.username });
            
            // Link player to session
            await linkPlayerToSession.mutateAsync({ sessionId: session.id, playerId: player.id });
          } catch (error) {
            console.error('Error creating player from QR:', error);
          }
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

  if (role !== 'player') {
    return <Navigate to="/" replace />;
  }

  if (!playerId) {
    return (
      <>
        <Navigation showProfileSwitcher />
        <PlayerOnboarding />
      </>
    );
  }

  // Show voting card if pizza selected
  if (selectedPizza) {
    return (
      <>
        <Navigation showProfileSwitcher />
        <div className="container mx-auto px-4 pt-20 pb-8">
          <VotingCard
            pizza={selectedPizza.pizza}
            existingVote={selectedPizza.vote}
            onBack={() => setSelectedPizza(null)}
          />
        </div>
      </>
    );
  }

  // Default: Show pizza list for voting (no tabs, no presence confirmation)
  const currentPlayer = players.find(p => p.id === playerId);

  return (
    <>
      <Navigation showProfileSwitcher />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="mb-6">
          <h1 className="font-display text-4xl text-primary text-glow-orange">
            Ciao {currentPlayer?.username || ''}! 🍕
          </h1>
          <p className="font-russo text-muted-foreground">
            Vota le pizze dei tuoi amici!
          </p>
        </div>

        <PizzaList onSelectPizza={(pizza, vote) => setSelectedPizza({ pizza, vote })} />
      </div>
    </>
  );
};

export default PlayerPage;
