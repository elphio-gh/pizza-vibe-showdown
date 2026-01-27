import React, { useMemo, useEffect, useState } from 'react';
import { usePizzas } from '@/hooks/usePizzas';
import { useVotes } from '@/hooks/useVotes';
import { usePlayers } from '@/hooks/usePlayers';
import { useTVCommands } from '@/hooks/useTVCommands';
import { PizzaWithScore, calculatePizzaScore, calculateVoteScore, getRankedPizzas } from '@/types/database';
import { motion, AnimatePresence } from 'framer-motion';

export const RevealMode: React.FC = () => {
  const { pizzas } = usePizzas();
  const { votes } = useVotes();
  const { players } = usePlayers();
  const { tvCommand } = useTVCommands();
  const [showAnimation, setShowAnimation] = useState(false);

  const currentPosition = tvCommand?.current_position || 0;

  // Calculate rankings with scores
  const pizzasWithScores: PizzaWithScore[] = useMemo(() => {
    return pizzas.map((pizza) => {
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
  }, [pizzas, votes, players]);

  // Get ranked groups (handles ex-aequo)
  const rankedGroups = useMemo(() => getRankedPizzas(pizzasWithScores), [pizzasWithScores]);
  
  // Flatten for indexing, but keep track of which group each belongs to
  const flatRanked = useMemo(() => rankedGroups.flat(), [rankedGroups]);

  // Get current position's group (for ex-aequo display)
  const getCurrentGroup = (): PizzaWithScore[] => {
    if (currentPosition <= 0 || currentPosition > flatRanked.length) return [];
    
    // Find which group the current position belongs to
    let positionCounter = 0;
    for (const group of rankedGroups) {
      const groupStart = positionCounter;
      const groupEnd = positionCounter + group.length;
      
      if (currentPosition > groupStart && currentPosition <= groupEnd) {
        return group;
      }
      positionCounter = groupEnd;
    }
    return [];
  };

  // Get the actual rank for the current group
  const getCurrentRank = (): number => {
    if (currentPosition <= 0) return 0;
    
    let positionCounter = 0;
    let rank = flatRanked.length; // Start from last position
    
    for (const group of rankedGroups) {
      const groupEnd = positionCounter + group.length;
      
      if (currentPosition > positionCounter && currentPosition <= groupEnd) {
        return rank;
      }
      positionCounter = groupEnd;
      rank -= group.length;
    }
    return rank;
  };

  const currentGroup = getCurrentGroup();
  const currentRank = getCurrentRank();

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

  // Trigger animation when position changes
  useEffect(() => {
    setShowAnimation(false);
    const timer = setTimeout(() => setShowAnimation(true), 50);
    return () => clearTimeout(timer);
  }, [currentPosition]);

  const remainingCount = flatRanked.length - currentPosition;
  const isExAequo = currentGroup.length > 1;

  // Render a single pizza card
  const renderPizzaCard = (pizza: PizzaWithScore, index: number) => {
    const details = getPizzaDetails(pizza);
    const isWinner = currentRank === 1;
    const isSecond = currentRank === 2;
    const isThird = currentRank === 3;

    return (
      <motion.div
        key={pizza.id}
        initial={{ opacity: 0, scale: 0.5, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: -100 }}
        transition={{ 
          duration: 0.6, 
          delay: index * 0.1,
          type: "spring",
          stiffness: 100
        }}
        className={`
          p-6 md:p-8 rounded-3xl transition-all duration-500 w-full max-w-2xl
          ${isWinner
            ? 'bg-gradient-to-br from-yellow-500/40 to-amber-500/40 border-4 border-yellow-400 box-glow-yellow'
            : isSecond
            ? 'bg-gradient-to-br from-gray-400/30 to-gray-500/30 border-3 border-gray-300'
            : isThird
            ? 'bg-gradient-to-br from-amber-700/30 to-orange-700/30 border-3 border-amber-600'
            : 'bg-muted/40 border-2 border-border'
          }
        `}
      >
        {/* Position Badge */}
        <div className="text-center mb-6">
          <div className={`inline-block font-display text-6xl md:text-8xl ${
            isWinner ? 'text-yellow-400 text-glow-yellow' : 
            isSecond ? 'text-gray-300' : 
            isThird ? 'text-amber-500' : 
            'text-muted-foreground'
          }`}>
            {isWinner ? '🥇' : isSecond ? '🥈' : isThird ? '🥉' : `#${currentRank}`}
          </div>
          {isExAequo && (
            <div className="mt-2 inline-block px-4 py-1 bg-accent/30 rounded-full">
              <span className="font-russo text-accent text-lg">🤝 EX AEQUO</span>
            </div>
          )}
        </div>

        {/* Pizza Info */}
        <div className="text-center mb-6">
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-2">
            Pizza #{pizza.number}
          </h2>
          <p className="font-russo text-xl md:text-2xl text-muted-foreground">
            {pizza.brand} - {pizza.flavor}
          </p>
        </div>

        {/* Score */}
        <div className="text-center mb-6">
          <div className={`font-display text-7xl md:text-9xl ${
            pizza.averageScore >= 8 ? 'text-accent text-glow-yellow' :
            pizza.averageScore >= 6 ? 'text-secondary' :
            pizza.averageScore >= 4 ? 'text-primary' :
            'text-destructive'
          }`}>
            {pizza.averageScore.toFixed(1)}
          </div>
          <p className="font-russo text-lg text-muted-foreground">
            {pizza.voteCount} {pizza.voteCount === 1 ? 'voto' : 'voti'}
          </p>
        </div>

        {/* Owner */}
        {pizza.registeredByPlayer && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-full">
              <span className="text-2xl">🧑‍🍳</span>
              <span className="font-russo text-lg text-secondary">
                Portata da: <span className="font-bold">{pizza.registeredByPlayer.username}</span>
              </span>
            </div>
          </div>
        )}

        {/* Category Averages */}
        {details.averages && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <span className="px-3 py-1 bg-background/50 rounded-lg text-sm font-russo">
              👀 {details.averages.aspetto.toFixed(1)}
            </span>
            <span className="px-3 py-1 bg-background/50 rounded-lg text-sm font-russo">
              😋 {details.averages.gusto.toFixed(1)}
            </span>
            <span className="px-3 py-1 bg-background/50 rounded-lg text-sm font-russo">
              🫓 {details.averages.impasto.toFixed(1)}
            </span>
            <span className="px-3 py-1 bg-background/50 rounded-lg text-sm font-russo">
              🧀 {details.averages.farcitura.toFixed(1)}
            </span>
            <span className="px-3 py-1 bg-background/50 rounded-lg text-sm font-russo">
              🎸 {details.averages.tony_factor.toFixed(1)}
            </span>
          </div>
        )}

        {/* Top Fan */}
        {details.topFan && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full">
              <span className="text-xl">⭐</span>
              <span className="font-russo text-primary">
                Top Fan: <span className="font-bold">{details.topFan.username}</span>
                <span className="text-xs ml-2 opacity-70">({details.topScore.toFixed(1)})</span>
              </span>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <h1 className="font-display text-4xl md:text-6xl text-primary text-glow-orange mb-4">
        🏆 CLASSIFICA 🏆
      </h1>

      {remainingCount > 0 && currentPosition > 0 && (
        <div className="mb-6 font-russo text-xl text-muted-foreground animate-pulse-glow">
          {remainingCount} {remainingCount === 1 ? 'pizza ancora da svelare' : 'pizze ancora da svelare'}...
        </div>
      )}

      {/* Current Position Display - Single or Ex-Aequo */}
      <AnimatePresence mode="wait">
        {showAnimation && currentGroup.length > 0 && (
          <motion.div
            key={currentPosition}
            className={`flex flex-wrap justify-center gap-6 w-full ${
              isExAequo ? 'max-w-6xl' : ''
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {currentGroup.map((pizza, index) => renderPizzaCard(pizza, index))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Waiting State */}
      {currentPosition === 0 && (
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-9xl mb-6 animate-bounce">🎬</div>
          <p className="font-russo text-2xl text-muted-foreground animate-pulse-glow">
            In attesa del reveal...
          </p>
          <p className="font-russo text-lg text-muted-foreground/60 mt-2">
            {flatRanked.length} pizze in gara
          </p>
        </motion.div>
      )}
    </div>
  );
};
