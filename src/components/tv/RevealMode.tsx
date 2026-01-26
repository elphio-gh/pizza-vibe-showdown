import React, { useMemo, useEffect, useState } from 'react';
import { usePizzas } from '@/hooks/usePizzas';
import { useVotes } from '@/hooks/useVotes';
import { usePlayers } from '@/hooks/usePlayers';
import { useTVCommands } from '@/hooks/useTVCommands';
import { PizzaWithScore, calculatePizzaScore, calculateVoteScore } from '@/types/database';

export const RevealMode: React.FC = () => {
  const { pizzas } = usePizzas();
  const { votes } = useVotes();
  const { players } = usePlayers();
  const { tvCommand } = useTVCommands();
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

  const currentPosition = tvCommand?.current_position || 0;

  // Calculate rankings (sorted from lowest to highest score for reveal from bottom)
  const rankings: PizzaWithScore[] = useMemo(() => {
    return pizzas
      .map((pizza) => {
        const pizzaVotes = votes.filter((v) => v.pizza_id === pizza.id);
        const registeredByPlayer = players.find(p => p.id === pizza.registered_by);
        return {
          ...pizza,
          averageScore: calculatePizzaScore(pizzaVotes),
          voteCount: pizzaVotes.length,
          votes: pizzaVotes,
          registeredByPlayer,
        };
      })
      .sort((a, b) => a.averageScore - b.averageScore); // Lowest first (reveal from bottom)
  }, [pizzas, votes, players]);

  // Get detailed stats for a pizza
  const getPizzaDetails = (pizza: PizzaWithScore) => {
    if (pizza.votes.length === 0) {
      return { averages: null, topFan: null };
    }

    // Calculate category averages
    const averages = {
      aspetto: pizza.votes.reduce((acc, v) => acc + v.aspetto, 0) / pizza.votes.length,
      gusto: pizza.votes.reduce((acc, v) => acc + v.gusto, 0) / pizza.votes.length,
      impasto: pizza.votes.reduce((acc, v) => acc + v.impasto, 0) / pizza.votes.length,
      farcitura: pizza.votes.reduce((acc, v) => acc + v.farcitura, 0) / pizza.votes.length,
      tony_factor: pizza.votes.reduce((acc, v) => acc + v.tony_factor, 0) / pizza.votes.length,
    };

    // Find top fan (player who gave highest score)
    let topVote = pizza.votes[0];
    let topScore = calculateVoteScore(pizza.votes[0]);
    
    for (const vote of pizza.votes) {
      const score = calculateVoteScore(vote);
      if (score > topScore) {
        topScore = score;
        topVote = vote;
      }
    }
    
    const topFan = players.find(p => p.id === topVote.player_id);

    return { averages, topFan, topScore };
  };

  // Trigger animation when position changes
  useEffect(() => {
    if (currentPosition > 0 && currentPosition <= rankings.length) {
      setAnimatingIndex(currentPosition - 1);
      const timer = setTimeout(() => setAnimatingIndex(null), 600);
      return () => clearTimeout(timer);
    }
  }, [currentPosition, rankings.length]);

  const visibleRankings = rankings.slice(0, currentPosition);
  const remainingCount = rankings.length - currentPosition;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="font-display text-5xl md:text-7xl text-primary text-glow-orange mb-8">
        🏆 CLASSIFICA 🏆
      </h1>

      {remainingCount > 0 && (
        <div className="mb-8 font-game text-2xl text-muted-foreground animate-pulse-glow">
          {remainingCount} pizze ancora da svelare...
        </div>
      )}

      <div className="w-full max-w-4xl space-y-4">
        {visibleRankings.map((pizza, index) => {
          const rank = rankings.length - index; // Reverse rank (highest = 1)
          const isNew = index === animatingIndex;
          const details = getPizzaDetails(pizza);
          
          return (
            <div
              key={pizza.id}
              className={`flex flex-col p-4 md:p-6 rounded-2xl transition-all duration-500 ${
                isNew ? 'animate-bounce-in box-glow-yellow' : ''
              } ${
                rank === 1
                  ? 'bg-gradient-to-r from-yellow-500/30 to-amber-500/30 border-2 border-yellow-500'
                  : rank === 2
                  ? 'bg-gradient-to-r from-gray-400/30 to-gray-500/30 border-2 border-gray-400'
                  : rank === 3
                  ? 'bg-gradient-to-r from-amber-700/30 to-orange-700/30 border-2 border-amber-700'
                  : 'bg-muted/30 border border-border'
              }`}
            >
              {/* Main row */}
              <div className="flex items-center gap-4">
                <div className={`font-display text-4xl md:text-6xl ${
                  rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-300' : rank === 3 ? 'text-amber-600' : 'text-muted-foreground'
                }`}>
                  {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                </div>

                <div className="flex-1">
                  <div className="font-display text-2xl md:text-4xl text-foreground">
                    Pizza #{pizza.number}
                  </div>
                  <div className="font-game text-lg md:text-xl text-muted-foreground">
                    {pizza.brand} - {pizza.flavor}
                  </div>
                  {/* Who brought it */}
                  {pizza.registeredByPlayer && (
                    <div className="font-game text-sm text-secondary mt-1">
                      🧑‍🍳 Portata da: <span className="font-bold">{pizza.registeredByPlayer.username}</span>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className={`font-display text-4xl md:text-6xl ${
                    pizza.averageScore >= 8 ? 'text-accent text-glow-yellow' :
                    pizza.averageScore >= 6 ? 'text-secondary' :
                    pizza.averageScore >= 4 ? 'text-primary' :
                    'text-destructive'
                  }`}>
                    {pizza.averageScore.toFixed(1)}
                  </div>
                  <div className="font-game text-sm text-muted-foreground">
                    {pizza.voteCount} voti
                  </div>
                </div>
              </div>

              {/* Details row - category averages & top fan */}
              {details.averages && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex flex-wrap gap-4 justify-between items-center">
                    {/* Category averages */}
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-background/50 rounded text-xs font-game">
                        👀 Aspetto: {details.averages.aspetto.toFixed(1)}
                      </span>
                      <span className="px-2 py-1 bg-background/50 rounded text-xs font-game">
                        😋 Gusto: {details.averages.gusto.toFixed(1)}
                      </span>
                      <span className="px-2 py-1 bg-background/50 rounded text-xs font-game">
                        🫓 Impasto: {details.averages.impasto.toFixed(1)}
                      </span>
                      <span className="px-2 py-1 bg-background/50 rounded text-xs font-game">
                        🧀 Farcitura: {details.averages.farcitura.toFixed(1)}
                      </span>
                      <span className="px-2 py-1 bg-background/50 rounded text-xs font-game">
                        🎸 Tony Factor: {details.averages.tony_factor.toFixed(1)}
                      </span>
                    </div>
                    
                    {/* Top Fan */}
                    {details.topFan && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full">
                        <span className="text-lg">⭐</span>
                        <span className="font-game text-sm text-primary">
                          Top Fan: <span className="font-bold">{details.topFan.username}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {currentPosition === 0 && (
        <div className="text-center animate-pulse-glow">
          <div className="text-8xl mb-4">🎬</div>
          <p className="font-game text-2xl text-muted-foreground">
            In attesa del reveal...
          </p>
        </div>
      )}
    </div>
  );
};
