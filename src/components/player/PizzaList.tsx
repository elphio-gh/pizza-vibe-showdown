import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Pizza, Vote } from '@/types/database';
import { usePizzas } from '@/hooks/usePizzas';
import { useVotes } from '@/hooks/useVotes';
import { useRole } from '@/contexts/RoleContext';
import { usePlayers } from '@/hooks/usePlayers';
import { Check, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PizzaListProps {
  onSelectPizza: (pizza: Pizza, existingVote?: Vote) => void;
}

export const PizzaList: React.FC<PizzaListProps> = ({ onSelectPizza }) => {
  const { pizzas, isLoading } = usePizzas();
  const { votes } = useVotes();
  const { playerId } = useRole();
  const { players } = usePlayers();
  const navigate = useNavigate();

  const getVoteForPizza = (pizzaId: string): Vote | undefined => {
    return votes.find(v => v.pizza_id === pizzaId && v.player_id === playerId);
  };

  const getPlayerName = (playerId: string | null): string => {
    if (!playerId) return 'Anonimo';
    const player = players.find(p => p.id === playerId);
    return player?.username || 'Anonimo';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-4xl animate-spin-slow">🍕</div>
      </div>
    );
  }

  if (pizzas.length === 0) {
    return (
      <Card
        className="bg-muted/30 border-dashed border-2 border-muted cursor-pointer hover:border-secondary hover:bg-secondary/10 transition-all"
        onClick={() => navigate('/my-pizza')}
      >
        <CardContent className="py-12 text-center">
          <div className="text-6xl mb-4">🍕</div>
          <p className="font-russo text-muted-foreground">
            Nessuna pizza registrata ancora!
          </p>
          <p className="text-sm text-secondary mt-2 font-russo">
            Clicca qui per registrare la prima pizza 👆
          </p>
        </CardContent>
      </Card>
    );
  }

  // Filter out the player's own pizza (self-voting prevention)
  const votablePizzas = pizzas.filter(p => p.registered_by !== playerId);

  // Check if user has their own pizza registered
  const userPizza = pizzas.find(p => p.registered_by === playerId);

  return (
    <div className="space-y-3">
      <h2 className="font-display text-2xl text-accent">
        Pizze da Votare ({votablePizzas.length})
      </h2>

      {userPizza && (
        <div className="p-3 bg-primary/10 rounded-lg border border-primary/30 mb-4">
          <p className="font-russo text-sm text-primary">
            🍕 La tua pizza: <strong>{userPizza.brand} - {userPizza.flavor}</strong>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Pizza #{userPizza.number} • Non puoi votare la tua pizza
          </p>
        </div>
      )}

      {votablePizzas.length === 0 ? (
        <Card className="bg-muted/30 border-dashed border-2 border-muted">
          <CardContent className="py-8 text-center">
            <p className="font-russo text-muted-foreground">
              Non ci sono altre pizze da votare al momento.
            </p>
          </CardContent>
        </Card>
      ) : (
        votablePizzas.map((pizza) => {
          const existingVote = getVoteForPizza(pizza.id);
          const hasVoted = !!existingVote;
          const ownerName = getPlayerName(pizza.registered_by);

          return (
            <Card
              key={pizza.id}
              onClick={() => onSelectPizza(pizza, existingVote)}
              className={`cursor-pointer touch-manipulation transition-colors duration-150 active:scale-[0.98] ${hasVoted
                ? 'bg-accent/10 border-accent/50'
                : 'bg-card border-accent/30 hover:border-accent'
                }`}
            >
              <CardContent className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">🍕</div>
                  <div>
                    <div className="font-display text-lg leading-tight">
                      {pizza.brand} - {pizza.flavor}
                    </div>
                    <div className="font-russo text-xs text-muted-foreground">
                      di {ownerName} • Pizza #{pizza.number}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {hasVoted ? (
                    <div className="flex items-center gap-1 px-3 py-1 bg-accent/20 rounded-full">
                      <Check className="w-4 h-4 text-accent" />
                      <span className="font-russo text-sm text-accent">Votata</span>
                    </div>
                  ) : (
                    <ChevronRight className="w-6 h-6 text-accent" />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};

