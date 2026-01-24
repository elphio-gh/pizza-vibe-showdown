import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { Navigation } from '@/components/shared/Navigation';
import { PlayerOnboarding } from '@/components/player/PlayerOnboarding';
import { PizzaRegistration } from '@/components/player/PizzaRegistration';
import { PizzaList } from '@/components/player/PizzaList';
import { VotingCard } from '@/components/player/VotingCard';
import { Pizza, Vote } from '@/types/database';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PlayerPage: React.FC = () => {
  const { role, playerId } = useRole();
  const [selectedPizza, setSelectedPizza] = useState<{ pizza: Pizza; vote?: Vote } | null>(null);

  if (role !== 'player') {
    return <Navigate to="/" replace />;
  }

  if (!playerId) {
    return (
      <>
        <Navigation />
        <PlayerOnboarding />
      </>
    );
  }

  if (selectedPizza) {
    return (
      <>
        <Navigation />
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
      <Navigation />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="mb-6">
          <h1 className="font-display text-4xl text-primary text-glow-orange">
            Ciao! 🍕
          </h1>
          <p className="font-game text-muted-foreground">
            Registra pizze o vota quelle esistenti
          </p>
        </div>

        <Tabs defaultValue="vote" className="w-full">
          <TabsList className="w-full mb-6 bg-muted">
            <TabsTrigger value="vote" className="flex-1 font-game">
              🗳️ Vota
            </TabsTrigger>
            <TabsTrigger value="register" className="flex-1 font-game">
              ➕ Registra
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vote">
            <PizzaList onSelectPizza={(pizza, vote) => setSelectedPizza({ pizza, vote })} />
          </TabsContent>

          <TabsContent value="register">
            <PizzaRegistration />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default PlayerPage;
