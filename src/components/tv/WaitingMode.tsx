import React from 'react';
import { LiveStats } from './LiveStats';
import { QRCodeDisplay } from './QRCodeDisplay';
import { motion } from 'framer-motion';

export const WaitingMode: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="space-y-8 animate-bounce-in">
        <motion.div 
          className="text-[120px] md:text-[180px]"
          animate={{ 
            y: [0, -20, 0],
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
        
        <h1 className="font-display text-6xl md:text-8xl bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
          TONY BUITONY CUP
        </h1>
        
        <p className="font-russo text-2xl md:text-3xl text-muted-foreground animate-pulse-glow">
          La competizione sta per iniziare...
        </p>

        {/* QR Code for joining */}
        <div className="pt-8">
          <QRCodeDisplay />
        </div>

        <div className="pt-8">
          <LiveStats />
        </div>

        <div className="flex justify-center gap-4 text-4xl pt-8">
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
  );
};
