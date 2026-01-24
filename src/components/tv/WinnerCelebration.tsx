import React, { useMemo } from 'react';
import { usePizzas } from '@/hooks/usePizzas';
import { useVotes } from '@/hooks/useVotes';
import { Confetti } from '@/components/effects/Confetti';
import { ThugLifeGlasses } from '@/components/effects/ThugLifeGlasses';
import { PizzaWithScore, calculatePizzaScore } from '@/types/database';

export const WinnerCelebration: React.FC = () => {
  const { pizzas } = usePizzas();
  const { votes } = useVotes();

  const winner: PizzaWithScore | null = useMemo(() => {
    if (pizzas.length === 0) return null;

    const pizzasWithScores = pizzas.map((pizza) => {
      const pizzaVotes = votes.filter((v) => v.pizza_id === pizza.id);
      return {
        ...pizza,
        averageScore: calculatePizzaScore(pizzaVotes),
        voteCount: pizzaVotes.length,
        votes: pizzaVotes,
      };
    });

    return pizzasWithScores.reduce((best, current) =>
      current.averageScore > best.averageScore ? current : best
    );
  }, [pizzas, votes]);

  if (!winner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-game text-2xl text-muted-foreground">
          Nessuna pizza da premiare...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <Confetti />

      <div className="text-center space-y-8 z-10 animate-bounce-in">
        <div className="text-[150px] md:text-[200px] animate-float">🏆</div>

        <h1 className="font-display text-5xl md:text-8xl text-secondary text-glow-yellow">
          VINCITORE!
        </h1>

        <ThugLifeGlasses />

        <div className="bg-gradient-to-r from-yellow-500/30 to-amber-500/30 rounded-3xl p-8 md:p-12 border-4 border-yellow-500 box-glow-yellow">
          <div className="text-8xl mb-4">🍕</div>
          
          <div className="font-display text-4xl md:text-6xl text-foreground mb-2">
            Pizza #{winner.number}
          </div>
          
          <div className="font-game text-2xl md:text-3xl text-muted-foreground mb-6">
            {winner.brand} - {winner.flavor}
          </div>

          <div className="font-display text-6xl md:text-9xl text-green-400 text-glow-yellow">
            {winner.averageScore.toFixed(1)}
          </div>
          
          <div className="font-game text-xl text-muted-foreground mt-2">
            con {winner.voteCount} voti
          </div>
        </div>

        <div className="flex justify-center gap-4 text-5xl">
          <span className="animate-float" style={{ animationDelay: '0s' }}>🎉</span>
          <span className="animate-float" style={{ animationDelay: '0.15s' }}>🥳</span>
          <span className="animate-float" style={{ animationDelay: '0.3s' }}>🎊</span>
          <span className="animate-float" style={{ animationDelay: '0.45s' }}>🎸</span>
          <span className="animate-float" style={{ animationDelay: '0.6s' }}>🕶️</span>
        </div>
      </div>
    </div>
  );
};
