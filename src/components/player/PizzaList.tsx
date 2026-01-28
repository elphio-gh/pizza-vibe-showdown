import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Pizza, Vote } from '@/types/database';
import { usePizzas } from '@/hooks/usePizzas';
import { useVotes } from '@/hooks/useVotes';
import { useRole } from '@/contexts/RoleContext';
import { usePlayers } from '@/hooks/usePlayers';
import { Check, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPizzaEmoji } from '@/lib/pizzaUtils';
import { formatPizzaText } from '@/lib/stringUtils';

interface PizzaListProps {
  onSelectPizza: (pizza: Pizza, existingVote?: Vote) => void;
}

export const PizzaList: React.FC<PizzaListProps> = ({ onSelectPizza }) => {
  // Disabilita realtime per evitare crash su iOS Safari
  const { pizzas, isLoading } = usePizzas({ disableRealtime: true });
  const { votes } = useVotes({ disableRealtime: true });
  const { playerId } = useRole();
  const { players } = usePlayers({ disableRealtime: true });
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
          <p className="font-sans font-bold text-muted-foreground">
            Nessuna pizza registrata ancora!
          </p>
          <p className="text-sm text-secondary mt-2 font-sans font-bold">
            Clicca qui per registrare la prima pizza 👆
          </p>
        </CardContent>
      </Card>
    );
  }

  // Filter out the player's own pizza (self-voting prevention)
  const allVotablePizzas = pizzas.filter(p => p.registered_by !== playerId);

  // Ordina le pizze: quelle non ancora votate prima, quelle già votate in fondo
  const votablePizzas = [...allVotablePizzas].sort((a, b) => {
    const aVoted = !!getVoteForPizza(a.id);
    const bVoted = !!getVoteForPizza(b.id);
    // Le pizze non votate vengono prima (false < true == -1)
    if (aVoted !== bVoted) return aVoted ? 1 : -1;
    // Mantieni ordinamento per numero se stesso stato di voto
    return (a.number || 0) - (b.number || 0);
  });

  // Check if user has their own pizza registered
  const userPizza = pizzas.find(p => p.registered_by === playerId);

  const remainingCount = votablePizzas.filter(p => !getVoteForPizza(p.id)).length;

  return (
    <div className="space-y-3">
      <h2 className="font-display text-2xl text-accent flex justify-between items-center">
        <span>Pizze da Votare</span>
        <span className="text-lg opacity-80">{remainingCount} di {votablePizzas.length}</span>
      </h2>

      {userPizza && (
        <div className="p-3 bg-primary/10 rounded-lg border border-primary/30 mb-4">
          <p className="font-sans text-sm text-primary">
            {getPizzaEmoji(userPizza.flavor, userPizza.number, userPizza.emoji)} La tua pizza: <strong>{formatPizzaText(userPizza.brand)} - {formatPizzaText(userPizza.flavor)}</strong>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Pizza #{userPizza.number} • Non puoi votare la tua pizza
          </p>
        </div>
      )}

      {votablePizzas.length === 0 ? (
        <Card className="bg-muted/30 border-dashed border-2 border-muted">
          <CardContent className="py-8 text-center">
            <p className="font-sans text-muted-foreground">
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
              className={`cursor-pointer touch-manipulation select-none active:scale-[0.98] ${hasVoted
                ? 'bg-accent/10 border-accent/50'
                : 'bg-card border-accent/30 hover:border-accent'
                }`}
            >
              <CardContent className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{getPizzaEmoji(pizza.flavor, pizza.number, pizza.emoji)}</div>
                  <div>
                    <div className="font-schoolbell text-lg leading-tight">
                      {formatPizzaText(pizza.brand)} - {formatPizzaText(pizza.flavor)}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="font-russo text-xs text-secondary bg-secondary/10 px-1.5 py-0.5 rounded">
                        👨‍🍳 {ownerName}
                      </span>
                      <span className="font-sans text-xs text-muted-foreground">
                        • #{pizza.number}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {hasVoted ? (
                    <div className="flex items-center gap-1 px-3 py-1 bg-accent/20 rounded-full">
                      <Check className="w-4 h-4 text-accent" />
                      <span className="font-sans font-bold text-sm text-accent">Votata</span>
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

