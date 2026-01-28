import React, { useState, useEffect } from 'react';
import { LiveStats } from './LiveStats';
import { motion, AnimatePresence } from 'framer-motion';
import { tvQuotes } from '@/data/tvQuotes';

export const WaitingMode: React.FC = () => {
  // Shuffle quotes on mount to ensure random order
  const [shuffledQuotes, setShuffledQuotes] = useState<typeof tvQuotes>([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    // Fischer-Yates shuffle
    const quotes = [...tvQuotes];
    for (let i = quotes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [quotes[i], quotes[j]] = [quotes[j], quotes[i]];
    }
    setShuffledQuotes(quotes);
  }, []);

  // Cycle quotes every 12 seconds
  useEffect(() => {
    if (shuffledQuotes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % shuffledQuotes.length);
    }, 12000); // 12 seconds

    return () => clearInterval(interval);
  }, [shuffledQuotes]);

  const currentQuote = shuffledQuotes.length > 0 ? shuffledQuotes[currentQuoteIndex] : tvQuotes[0];

  return (
    <div className="h-screen w-screen relative overflow-hidden flex flex-col items-center justify-between p-8">


      {/* Top Header - Matched to Index.tsx style */}
      <div className="w-full text-center mt-4 mb-8 z-10 animate-bounce-in">
        {/* Giant Pizza removed to avoid clutter with carousel, but font styles matched strictly */}
        <h1 className="font-display text-5xl md:text-7xl bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-4">
          TONY BUITONY CUP
        </h1>
        <p className="font-russo text-xl md:text-2xl text-muted-foreground">
          🏆 La sfida delle pizze surgelate! 🏆
        </p>
      </div>

      {/* CENTER: QUOTE CAROUSEL */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto perspective-1000 z-10">
        <AnimatePresence mode="wait">
          {shuffledQuotes.length > 0 && (
            <motion.div
              key={currentQuoteIndex}
              initial={{ opacity: 0, y: 50, rotateX: -10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -50, rotateX: 10 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center p-12 rounded-3xl bg-card/30 backdrop-blur-sm border border-white/10 shadow-glow-orange relative"
            >
              {/* Quote Icon */}
              <div className="text-6xl text-primary/50 absolute -top-8 -left-4 font-serif">“</div>

              <h2 className="font-display text-4xl md:text-6xl text-foreground leading-tight mb-8 drop-shadow-lg">
                {currentQuote.text}
              </h2>

              <div className="text-6xl text-primary/50 absolute -bottom-16 -right-4 font-serif rotate-180">“</div>

              <p className="font-russo text-xl md:text-3xl text-accent animate-pulse">
                — {currentQuote.author}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Section - Stats */}
      <div className="w-full mt-8 z-10">
        <div className="flex flex-row items-center justify-center gap-12">
          {/* Stats */}
          <LiveStats />
        </div>
      </div>
    </div>
  );
};
