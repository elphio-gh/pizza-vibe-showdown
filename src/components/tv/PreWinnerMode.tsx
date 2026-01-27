import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePizzas } from '@/hooks/usePizzas';
import { useVotes } from '@/hooks/useVotes';
import { usePlayers } from '@/hooks/usePlayers';
import { PizzaWithScore, calculatePizzaScore, getRankedPizzas } from '@/types/database';

export const PreWinnerMode: React.FC = () => {
    const [drumrollIntensity, setDrumrollIntensity] = useState(0);
    const { pizzas } = usePizzas();
    const { votes } = useVotes();
    const { players } = usePlayers();

    // Check for tie
    const isTie = useMemo(() => {
        if (pizzas.length === 0) return false;

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
        if (rankedGroups.length === 0) return false;

        const topGroup = rankedGroups[0];
        return topGroup.length > 1;
    }, [pizzas, votes, players]);

    // Increase suspense over time
    useEffect(() => {
        const interval = setInterval(() => {
            setDrumrollIntensity((prev) => Math.min(prev + 0.1, 1));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                className="animate-bounce-in"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Drumroll Visual */}
                <div className="flex justify-center gap-4 mb-8">
                    {['🥁', '🎺', '🥁'].map((emoji, i) => (
                        <motion.span
                            key={i}
                            className="text-6xl"
                            animate={{
                                scale: [1, 1.3 + drumrollIntensity * 0.3, 1],
                                rotate: i === 1 ? 0 : [0, 10, -10, 0]
                            }}
                            transition={{
                                duration: 0.3 - drumrollIntensity * 0.1,
                                repeat: Infinity,
                                delay: i * 0.1
                            }}
                        >
                            {emoji}
                        </motion.span>
                    ))}
                </div>

                {/* Main Suspense Text */}
                <AnimatePresence mode="wait">
                    {isTie ? (
                        <motion.div
                            key="tie-msg"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{
                                scale: 1 + drumrollIntensity * 0.1,
                                opacity: 1
                            }}
                            transition={{ type: "spring", damping: 10 }}
                        >
                            <h1 className="font-display text-4xl md:text-6xl text-secondary mb-4">
                                MA COSA SUCCEDE?!
                            </h1>
                            <motion.h1
                                className="font-display text-6xl md:text-8xl text-accent text-glow-yellow leading-tight"
                                animate={{
                                    scale: [1, 1.05, 1],
                                    textShadow: [
                                        "0 0 30px rgba(255,200,0,0.5)",
                                        `0 0 ${60 + drumrollIntensity * 40}px rgba(255,200,0,0.9)`,
                                        "0 0 30px rgba(255,200,0,0.5)"
                                    ]
                                }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                            >
                                INCREDIBILE...
                                <br />
                                NON CI CREDO!
                            </motion.h1>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="winner-msg"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{
                                scale: 1 + drumrollIntensity * 0.1,
                                opacity: 1
                            }}
                            transition={{ type: "spring", damping: 10 }}
                        >
                            <h1 className="font-display text-6xl md:text-8xl text-secondary mb-2">
                                AND THE
                            </h1>
                            <motion.h1
                                className="font-display text-7xl md:text-9xl text-accent text-glow-yellow"
                                animate={{
                                    textShadow: [
                                        "0 0 30px rgba(255,200,0,0.5)",
                                        `0 0 ${60 + drumrollIntensity * 40}px rgba(255,200,0,0.9)`,
                                        "0 0 30px rgba(255,200,0,0.5)"
                                    ]
                                }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                            >
                                WINNER IS...
                            </motion.h1>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Trophy Teaser */}
                <motion.div
                    className="mt-10"
                    animate={{
                        y: [0, -20, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 1.5 - drumrollIntensity * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <span className="text-8xl opacity-80">🏆</span>
                </motion.div>

                {/* Suspense Dots */}
                <div className="flex justify-center gap-4 mt-8">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-6 h-6 rounded-full bg-secondary"
                            animate={{
                                scale: [0.8, 1.5, 0.8],
                                opacity: [0.3, 1, 0.3]
                            }}
                            transition={{
                                duration: 0.6 - drumrollIntensity * 0.2,
                                repeat: Infinity,
                                delay: i * 0.15
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
