import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { Navigation } from '@/components/shared/Navigation';
import { PlayerOnboarding } from '@/components/player/PlayerOnboarding';
import { PizzaRegistration } from '@/components/player/PizzaRegistration';
import { PizzaList } from '@/components/player/PizzaList';
import { VotingCard } from '@/components/player/VotingCard';
import { ParticipantsList } from '@/components/player/ParticipantsList';
import { ProfileSwitcher } from '@/components/player/ProfileSwitcher';
import { Pizza, Vote, generateRandomNickname } from '@/types/database';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrentSession, useRecentProfiles } from '@/hooks/useLocalStorage';
import { useSessions } from '@/hooks/useSessions';
import { usePlayers } from '@/hooks/usePlayers';
import { usePizzas } from '@/hooks/usePizzas';
import { usePlayerPresence } from '@/hooks/usePlayerPresence';

const PlayerPage: React.FC = () => {
  const { role, playerId, setPlayerId, setPlayerName, setRole } = useRole();
  const [selectedPizza, setSelectedPizza] = useState<{ pizza: Pizza; vote?: Vote } | null>(null);
  const [showParticipants, setShowParticipants] = useState(true);
  const [searchParams] = useSearchParams();
  
  const { currentPlayerId, setCurrentPlayerId, currentPlayerName, setCurrentPlayerName, setSessionToken } = useCurrentSession();
  const { addProfile } = useRecentProfiles();
  const { getSessionByToken, linkPlayerToSession } = useSessions();
  const { createPlayer, players } = usePlayers();
  const { pizzas } = usePizzas();

  // Use presence tracking
  usePlayerPresence();

  // Check if player already has a pizza registered
  const playerHasPizza = pizzas.some(p => p.registered_by === playerId);

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

  // Show participants list first for presence confirmation
  const currentPlayer = players.find(p => p.id === playerId);
  if (showParticipants && currentPlayer && !currentPlayer.is_confirmed) {
    return (
      <>
        <Navigation showProfileSwitcher />
        <div className="container mx-auto px-4 pt-20 pb-8">
          <div className="mb-6 text-center">
            <h1 className="font-display text-4xl text-primary text-glow-orange">
              Ciao {currentPlayer.username}! 🍕
            </h1>
            <p className="font-game text-muted-foreground">
              Conferma la tua presenza per iniziare
            </p>
          </div>
          <ParticipantsList onConfirmPresence={() => setShowParticipants(false)} />
        </div>
      </>
    );
  }

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

  return (
    <>
      <Navigation showProfileSwitcher />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="mb-6">
          <h1 className="font-display text-4xl text-primary text-glow-orange">
            Ciao! 🍕
          </h1>
          <p className="font-game text-muted-foreground">
            {playerHasPizza 
              ? 'Hai già registrato la tua pizza! Ora puoi votare le altre.' 
              : 'Registra la tua pizza o vota quelle esistenti'}
          </p>
        </div>

        <Tabs defaultValue="vote" className="w-full">
          <TabsList className="w-full mb-6 bg-muted">
            <TabsTrigger value="vote" className="flex-1 font-game">
              🗳️ Vota
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="flex-1 font-game"
              disabled={playerHasPizza}
            >
              {playerHasPizza ? '✅ Pizza Registrata' : '➕ Registra'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vote">
            <PizzaList onSelectPizza={(pizza, vote) => setSelectedPizza({ pizza, vote })} />
          </TabsContent>

          <TabsContent value="register">
            {playerHasPizza ? (
              <div className="text-center p-8 bg-accent/10 rounded-lg border border-accent/30">
                <p className="font-display text-2xl text-accent mb-2">✅ Hai già registrato la tua pizza!</p>
                <p className="font-game text-muted-foreground">
                  Puoi registrare solo una pizza per questa competizione.
                </p>
              </div>
            ) : (
              <PizzaRegistration />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default PlayerPage;
