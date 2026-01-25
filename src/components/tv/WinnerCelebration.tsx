import React, { useMemo } from 'react';
import { usePizzas } from '@/hooks/usePizzas';
import { useVotes } from '@/hooks/useVotes';
import { usePlayers } from '@/hooks/usePlayers';
import { Confetti } from '@/components/effects/Confetti';
import { ThugLifeGlasses } from '@/components/effects/ThugLifeGlasses';
import { PizzaWithScore, calculatePizzaScore, getRankedPizzas } from '@/types/database';
import { motion } from 'framer-motion';

export const WinnerCelebration: React.FC = () => {
  const { pizzas } = usePizzas();
  const { votes } = useVotes();
  const { players } = usePlayers();

  const { winners, isTie } = useMemo(() => {
    if (pizzas.length === 0) return { winners: [], isTie: false };

    const pizzasWithScores: PizzaWithScore[] = pizzas.map((pizza) => {
      const pizzaVotes = votes.filter((v) => v.pizza_id === pizza.id);
      const registeredByPlayer = players.find(p => p.id === pizza.registered_by);
      return {
        ...pizza,
        averageScore: calculatePizzaScore(pizzaVotes),
        voteCount: pizzaVotes.length,
        votes: pizzaVotes,
        registeredByPlayer,
      };
    });

    const rankedGroups = getRankedPizzas(pizzasWithScores);
    if (rankedGroups.length === 0) return { winners: [], isTie: false };

    const topGroup = rankedGroups[0];
    return {
      winners: topGroup,
      isTie: topGroup.length > 1,
    };
  }, [pizzas, votes, players]);

  if (winners.length === 0) {
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
        <motion.div 
          className="text-[120px] md:text-[180px]"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🏆
        </motion.div>

        <h1 className="font-display text-5xl md:text-8xl text-secondary text-glow-yellow">
          {isTie ? 'VINCITORI!' : 'VINCITORE!'}
        </h1>

        <ThugLifeGlasses />

        {/* Winners Display */}
        <div className={`flex flex-wrap justify-center gap-6 ${isTie ? 'max-w-4xl' : ''}`}>
          {winners.map((winner, index) => (
            <motion.div
              key={winner.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.3 }}
              className="bg-gradient-to-r from-secondary/30 to-primary/30 rounded-3xl p-6 md:p-10 border-4 border-secondary box-glow-yellow"
            >
              <div className="text-6xl md:text-8xl mb-4">🍕</div>
              
              <div className="font-display text-3xl md:text-5xl text-foreground mb-2">
                Pizza #{winner.number}
              </div>
              
              <div className="font-game text-xl md:text-2xl text-muted-foreground mb-4">
                {winner.brand} - {winner.flavor}
              </div>

              {/* Winner's username */}
              {winner.registeredByPlayer && (
                <div className="p-3 bg-primary/20 rounded-lg border border-primary/50 mb-4">
                  <p className="font-game text-sm text-muted-foreground">Registrata da:</p>
                  <p className="font-display text-2xl md:text-3xl text-primary">
                    🎉 {winner.registeredByPlayer.username} 🎉
                  </p>
                </div>
              )}

              <div className="font-display text-5xl md:text-7xl text-accent text-glow-yellow">
                {winner.averageScore.toFixed(1)}
              </div>
              
              <div className="font-game text-lg text-muted-foreground mt-2">
                con {winner.voteCount} voti
              </div>
            </motion.div>
          ))}
        </div>

        {isTie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <p className="font-display text-3xl text-secondary animate-pulse-glow">
              🎊 EX AEQUO! 🎊
            </p>
          </motion.div>
        )}

        <div className="flex justify-center gap-4 text-5xl">
          {['🎉', '🥳', '🎊', '🎸', '🕶️'].map((emoji, i) => (
            <motion.span 
              key={i}
              animate={{ 
                y: [0, -15, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.15 
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
};
