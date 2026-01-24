import React, { useMemo, useEffect, useState } from 'react';
import { usePizzas } from '@/hooks/usePizzas';
import { useVotes } from '@/hooks/useVotes';
import { useTVCommands } from '@/hooks/useTVCommands';
import { PizzaWithScore, calculatePizzaScore } from '@/types/database';

export const RevealMode: React.FC = () => {
  const { pizzas } = usePizzas();
  const { votes } = useVotes();
  const { tvCommand } = useTVCommands();
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

  const currentPosition = tvCommand?.current_position || 0;

  // Calculate rankings (sorted from lowest to highest score for reveal from bottom)
  const rankings: PizzaWithScore[] = useMemo(() => {
    return pizzas
      .map((pizza) => {
        const pizzaVotes = votes.filter((v) => v.pizza_id === pizza.id);
        return {
          ...pizza,
          averageScore: calculatePizzaScore(pizzaVotes),
          voteCount: pizzaVotes.length,
          votes: pizzaVotes,
        };
      })
      .sort((a, b) => a.averageScore - b.averageScore); // Lowest first (reveal from bottom)
  }, [pizzas, votes]);

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
          
          return (
            <div
              key={pizza.id}
              className={`flex items-center gap-4 p-4 md:p-6 rounded-2xl transition-all duration-500 ${
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
              </div>

              <div className="text-right">
                <div className={`font-display text-4xl md:text-6xl ${
                  pizza.averageScore >= 8 ? 'text-green-400 text-glow-yellow' :
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
