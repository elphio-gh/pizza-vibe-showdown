import React from 'react';
import { motion } from 'framer-motion';

export const StopTelevotoMode: React.FC = () => {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center p-6 overflow-hidden text-center bg-gradient-to-b from-background to-destructive/20">
            <motion.div
                className="animate-bounce-in"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
            >
                {/* Stop Sign */}
                <motion.div
                    className="text-[180px] mb-4"
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    🛑
                </motion.div>

                {/* Main Title */}
                <motion.h1
                    className="font-display text-6xl md:text-8xl text-destructive text-glow-pink mb-4"
                    animate={{
                        textShadow: [
                            "0 0 20px rgba(255,0,0,0.5)",
                            "0 0 60px rgba(255,0,0,0.8)",
                            "0 0 20px rgba(255,0,0,0.5)"
                        ]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    STOP AL TELEVOTO!
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    className="font-russo text-2xl md:text-3xl text-foreground/80"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    Le votazioni sono chiuse! 📊
                </motion.p>

                {/* Meme Text */}
                <motion.div
                    className="mt-8 px-6 py-4 bg-muted/50 rounded-2xl border-2 border-destructive/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <p className="font-russo text-xl text-muted-foreground italic">
                        "Non si accettano più bustarelle..." 💸
                    </p>
                </motion.div>

                {/* Animated Icons */}
                <div className="flex justify-center gap-6 mt-8 text-5xl">
                    {['🔒', '⛔', '🚫', '✋'].map((emoji, i) => (
                        <motion.span
                            key={i}
                            animate={{
                                y: [0, -15, 0],
                                opacity: [0.7, 1, 0.7]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                        >
                            {emoji}
                        </motion.span>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
