import React, { useMemo } from 'react';
import { usePizzas } from '@/hooks/usePizzas';
import { useVotes } from '@/hooks/useVotes';
import { usePlayers } from '@/hooks/usePlayers';
import { PizzaConfetti } from '@/components/effects/PizzaConfetti';
import { ThugLifeGlasses } from '@/components/effects/ThugLifeGlasses';
import { PizzaWithScore, calculatePizzaScore, getRankedPizzas, calculateVoteScore } from '@/types/database';
import { motion } from 'framer-motion';
import { formatPizzaText, formatTitleCase } from '@/lib/stringUtils';

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

  // Get detailed stats for a pizza
  const getPizzaDetails = (pizza: PizzaWithScore) => {
    if (pizza.votes.length === 0) {
      return { averages: null, topFan: null, topScore: 0 };
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

  if (winners.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-russo text-2xl text-muted-foreground">
          Nessuna pizza da premiare...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center p-6 relative overflow-hidden">
      <PizzaConfetti />

      <div className={`
        text-center z-10 w-full flex flex-col items-center h-full
        ${isTie ? 'max-w-[95vw] justify-start pt-10 overflow-y-auto no-scrollbar pb-20' : 'max-w-[85vw] justify-center'}
      `}>
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`
            font-display text-secondary text-glow-yellow mb-6 flex items-center justify-center gap-4 shrink-0
            ${isTie ? 'text-5xl md:text-6xl' : 'text-7xl'}
          `}
        >
          <motion.span
            className="inline-block"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🏆
          </motion.span>
          {isTie ? 'VINCITORI!' : 'VINCITORE!'}
        </motion.h1>

        <ThugLifeGlasses />

        {/* Winners Display */}
        <div className={`
          flex flex-col items-center w-full mt-6
          ${isTie ? 'gap-4' : 'gap-6'}
        `}>
          {winners.map((winner, index) => {
            const details = getPizzaDetails(winner);
            return (
              <motion.div
                key={winner.id}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.3, type: "spring" }}
                className={`
                  rounded-3xl transition-all duration-500 w-full
                  flex flex-row items-center
                  bg-card/90 border-4 border-yellow-400/80 box-glow-yellow backdrop-blur-md shadow-2xl
                  ${isTie ? 'p-4 gap-4' : 'p-6 gap-8'}
                `}
              >
                {/* Left Column - Trophy & Score */}
                <div className="flex flex-col items-center justify-center min-w-[200px] md:min-w-[250px]">
                  <div className={`${isTie ? 'text-6xl mb-2' : 'text-8xl mb-3'}`}>🥇</div>
                  <div className={`font-display text-white drop-shadow-md mb-2 ${isTie ? 'text-7xl' : 'text-9xl'}`}>
                    {winner.averageScore.toFixed(1)}
                  </div>
                  <p className="font-russo text-base text-muted-foreground">
                    con {winner.voteCount} {winner.voteCount === 1 ? 'voto' : 'voti'}
                  </p>
                </div>

                {/* Middle Column - Pizza Info */}
                <div className="flex-1 flex flex-col justify-center">
                  <h2 className={`font-schoolbell text-foreground mb-2 flex flex-col gap-1 ${isTie ? 'text-4xl' : 'text-6xl'}`}>
                    <span>{formatPizzaText(winner.brand)}</span>
                    <span>{formatPizzaText(winner.flavor)}</span>
                  </h2>
                  <p className={`font-russo text-muted-foreground/80 mb-4 ${isTie ? 'text-2xl' : 'text-3xl'}`}>
                    Pizza #{winner.number}
                  </p>

                  {/* Category Averages */}
                  {details.averages && (
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <div className="flex flex-col items-center px-3 py-2 bg-background/50 rounded-lg border border-border/50 min-w-[80px]">
                        <span className="text-xl font-russo">🧀 {details.averages.farcitura.toFixed(1)}</span>
                        <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground font-sans mt-1">Farcitura</span>
                      </div>
                      <div className="flex flex-col items-center px-3 py-2 bg-background/50 rounded-lg border border-border/50 min-w-[80px]">
                        <span className="text-xl font-russo">😋 {details.averages.gusto.toFixed(1)}</span>
                        <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground font-sans mt-1">Gusto</span>
                      </div>
                      <div className="flex flex-col items-center px-3 py-2 bg-background/50 rounded-lg border border-border/50 min-w-[80px]">
                        <span className="text-xl font-russo">🥖 {details.averages.impasto.toFixed(1)}</span>
                        <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground font-sans mt-1">Impasto</span>
                      </div>
                      <div className="flex flex-col items-center px-3 py-2 bg-background/50 rounded-lg border border-border/50 min-w-[80px]">
                        <span className="text-xl font-russo">📸 {details.averages.aspetto.toFixed(1)}</span>
                        <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground font-sans mt-1">Aspetto</span>
                      </div>
                      <div className="flex flex-col items-center px-3 py-2 bg-background/50 rounded-lg border border-border/50 min-w-[80px]">
                        <span className="text-xl font-russo">🕶️ {details.averages.tony_factor.toFixed(1)}</span>
                        <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground font-sans mt-1">Tony F.</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Player Info */}
                <div className="flex flex-col items-end justify-center gap-4 min-w-[200px] md:min-w-[250px]">
                  {/* Owner */}
                  {winner.registeredByPlayer && (
                    <div className={`w-full bg-secondary/20 rounded-2xl border border-secondary/40 text-center ${isTie ? 'p-2' : 'p-4'}`}>
                      <p className="font-russo text-sm text-secondary/70 mb-1">🧑‍🍳 Portata da:</p>
                      <p className={`font-russo font-bold text-secondary ${isTie ? 'text-2xl' : 'text-3xl'}`}>
                        {winner.registeredByPlayer.username}
                      </p>
                    </div>
                  )}

                  {/* Top Fan */}
                  {details.topFan && (
                    <div className={`inline-flex items-center gap-3 bg-primary/20 rounded-full border border-primary/40 ${isTie ? 'px-4 py-2' : 'px-5 py-3'}`}>
                      <span className={`${isTie ? 'text-xl' : 'text-2xl'}`}>⭐</span>
                      <span className={`font-russo text-primary ${isTie ? 'text-base' : 'text-lg'}`}>
                        Top Fan: <span className="font-bold">{details.topFan.username}</span>
                        <span className="text-sm ml-2 opacity-70">({details.topScore.toFixed(1)})</span>
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {isTie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 shrink-0"
          >
            <p className="font-display text-4xl text-secondary animate-pulse-glow">
              🎊 EX AEQUO! 🎊
            </p>
          </motion.div>
        )}

      </div>
    </div>
  );
};
