import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export type BackgroundVariant = 'default' | 'winner' | 'pre_winner' | 'stop' | 'pause';

interface AnimatedBackgroundProps {
  variant?: BackgroundVariant;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ variant = 'default' }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Define colors based on variant
  const getVariantColors = () => {
    switch (variant) {
      case 'winner':
        return {
          c1: 'hsl(45, 90%, 50%)', // Gold
          c2: 'hsl(35, 90%, 50%)', // Amber
          c3: 'hsl(50, 100%, 60%)', // Yellow
        };
      case 'stop':
        return {
          c1: 'hsl(0, 80%, 50%)', // Red
          c2: 'hsl(10, 80%, 50%)', // Red-Orange
          c3: 'hsl(350, 80%, 50%)', // Deep Red
        };
      case 'pause':
        return {
          c1: 'hsl(45, 90%, 50%)', // Yellow
          c2: 'hsl(30, 90%, 50%)', // Orange
          c3: 'hsl(60, 90%, 50%)', // Light Yellow
        };
      case 'pre_winner':
        return {
          c1: 'hsl(260, 60%, 40%)', // Purple
          c2: 'hsl(280, 60%, 40%)', // Deep Purple
          c3: 'hsl(240, 60%, 40%)', // Blue-Purple
        };
      default:
        return {
          c1: 'hsl(var(--primary))',
          c2: 'hsl(var(--secondary))',
          c3: 'hsl(var(--accent))',
        };
    }
  };

  const colors = getVariantColors();

  // Periodic movement to prevent burn-in
  useEffect(() => {
    const interval = setInterval(() => {
      setOffset({
        x: Math.sin(Date.now() / 10000) * 10,
        y: Math.cos(Date.now() / 10000) * 10,
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, ${colors.c1} 0%, transparent 70%)`,
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, 100, 0, -100, 0],
          y: [0, -50, 100, -50, 0],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        }}
        initial={{ left: '10%', top: '20%' }}
      />

      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-15"
        style={{
          background: `radial-gradient(circle, ${colors.c2} 0%, transparent 70%)`,
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, -80, 0, 80, 0],
          y: [0, 60, -80, 60, 0],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: 'linear',
        }}
        initial={{ right: '10%', bottom: '20%' }}
      />

      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-10"
        style={{
          background: `radial-gradient(circle, ${colors.c3} 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -70, 70, 0],
        }}
        transition={{
          duration: 55,
          repeat: Infinity,
          ease: 'linear',
        }}
        initial={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      />

      {/* Floating emojis with burn-in protection */}
      {Array.from({ length: 15 }).map((_, i) => {
        const emojis = ['🍕', '🎸', '🕶️', '🎤', '🎵', '🏆', '🔥', '✨', '💿', '🌭', '🕺', '🎪', '🎲', '🎯', '🚀'];
        const emoji = emojis[i % emojis.length];

        return (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-10"
            style={{
              left: `${((i * 13.7) % 80) + 10}%`,
              top: `${((i * 19.3) % 80) + 10}%`,
            }}
            animate={{
              x: [offset.x * (i + 1) * 0.3, offset.x * (i + 1) * -0.3],
              y: [offset.y * (i + 1) * 0.3, offset.y * (i + 1) * -0.3],
              rotate: [0, 360],
            }}
            transition={{
              x: { duration: 25 + i * 2, repeat: Infinity, repeatType: 'reverse' },
              y: { duration: 20 + i * 2, repeat: Infinity, repeatType: 'reverse' },
              rotate: { duration: 50 + i * 5, repeat: Infinity, ease: 'linear' },
            }}
          >
            {emoji}
          </motion.div>
        );
      })}


    </div>
  );
};
