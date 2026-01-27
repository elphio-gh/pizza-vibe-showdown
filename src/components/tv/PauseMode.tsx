import React from 'react';
import { motion } from 'framer-motion';

export const PauseMode: React.FC = () => {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center p-6 overflow-hidden text-center">
            <motion.div
                className="animate-bounce-in"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Pause Icon */}
                <motion.div
                    className="text-[160px] mb-6"
                    animate={{
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    ⏸️
                </motion.div>

                {/* Main Title */}
                <h1 className="font-display text-5xl md:text-7xl text-primary text-glow-orange mb-4">
                    PAUSA PUBBLICITÀ
                </h1>

                {/* Subtitle */}
                <motion.p
                    className="font-russo text-xl md:text-2xl text-muted-foreground mb-8"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    Torniamo subito... forse! ☕
                </motion.p>

                {/* Meme Section */}
                <motion.div
                    className="max-w-2xl mx-auto p-6 bg-muted/30 rounded-3xl border border-border"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <p className="font-russo text-2xl text-foreground/90 mb-3">
                        🍕 "Una pizza non si giudica durante la pubblicità" 🍕
                    </p>
                    <p className="font-russo text-lg text-muted-foreground">
                        - Antico proverbio napoletano
                    </p>
                </motion.div>

                {/* Relaxing Animation */}
                <div className="flex justify-center gap-8 mt-10 text-4xl">
                    {['☕', '🍿', '📺', '🛋️', '🎵'].map((emoji, i) => (
                        <motion.span
                            key={i}
                            animate={{
                                y: [0, -8, 0],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 0.3,
                                ease: "easeInOut"
                            }}
                        >
                            {emoji}
                        </motion.span>
                    ))}
                </div>

                {/* Loading Dots */}
                <div className="flex justify-center gap-3 mt-8">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-4 h-4 rounded-full bg-primary"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.4, 1, 0.4]
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
