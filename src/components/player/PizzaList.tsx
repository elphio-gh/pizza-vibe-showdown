import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Pizza, Vote } from '@/types/database';
import { usePizzas } from '@/hooks/usePizzas';
import { useVotes } from '@/hooks/useVotes';
import { useRole } from '@/contexts/RoleContext';
import { Check, ChevronRight } from 'lucide-react';

interface PizzaListProps {
  onSelectPizza: (pizza: Pizza, existingVote?: Vote) => void;
}

export const PizzaList: React.FC<PizzaListProps> = ({ onSelectPizza }) => {
  const { pizzas, isLoading } = usePizzas();
  const { votes } = useVotes();
  const { playerId } = useRole();

  const getVoteForPizza = (pizzaId: string): Vote | undefined => {
    return votes.find(v => v.pizza_id === pizzaId && v.player_id === playerId);
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
      <Card className="bg-muted/30 border-dashed border-2 border-muted">
        <CardContent className="py-12 text-center">
          <div className="text-6xl mb-4">🍕</div>
          <p className="font-game text-muted-foreground">
            Nessuna pizza registrata ancora!
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Registra la prima pizza per iniziare.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="font-display text-2xl text-accent">
        Pizze da Votare ({pizzas.length})
      </h2>
      
      {pizzas.map((pizza) => {
        const existingVote = getVoteForPizza(pizza.id);
        const hasVoted = !!existingVote;

        return (
          <Card
            key={pizza.id}
            onClick={() => onSelectPizza(pizza, existingVote)}
            className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
              hasVoted 
                ? 'bg-green-500/10 border-green-500/50' 
                : 'bg-card border-accent/30 hover:border-accent'
            }`}
          >
            <CardContent className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🍕</div>
                <div>
                  <div className="font-display text-xl">
                    Pizza #{pizza.number}
                  </div>
                  <div className="font-game text-sm text-muted-foreground">
                    {pizza.brand} - {pizza.flavor}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {hasVoted ? (
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 rounded-full">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="font-game text-sm text-green-500">Votata</span>
                  </div>
                ) : (
                  <ChevronRight className="w-6 h-6 text-accent" />
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
