import React from 'react';
import { LiveStats } from './LiveStats';
import { QRCodeDisplay } from './QRCodeDisplay';
import { motion } from 'framer-motion';

export const WaitingMode: React.FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-6 overflow-hidden text-center">
      <div className="w-full max-w-7xl animate-bounce-in">
        {/* Top Section - Pizza and Title */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <motion.div
            className="text-[100px] md:text-[140px]"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🍕
          </motion.div>

          <h1 className="font-display text-5xl md:text-7xl bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
            TONY BUITONY CUP
          </h1>

          <p className="font-russo text-xl md:text-2xl text-muted-foreground animate-pulse-glow mt-2">
            La competizione sta per iniziare...
          </p>
        </div>

        {/* Middle Section - QR Code */}
        <div className="mb-6">
          <QRCodeDisplay />
        </div>

        {/* Bottom Section - Stats and Emojis in a horizontal layout for 16:9 */}
        <div className="flex flex-row items-center justify-center gap-8 md:gap-12">
          {/* Stats */}
          <LiveStats />

          {/* Emojis */}
          <div className="flex gap-4 text-4xl md:text-5xl">
            {['🎸', '🕶️', '🎤', '🎵'].map((emoji, i) => (
              <motion.span
                key={i}
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
