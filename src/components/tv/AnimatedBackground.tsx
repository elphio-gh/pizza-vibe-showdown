import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground: React.FC = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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
          background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
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
          background: 'radial-gradient(circle, hsl(var(--secondary)) 0%, transparent 70%)',
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
          background: 'radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)',
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
      {['🍕', '🎸', '🕶️', '🎤', '🎵', '🏆'].map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-10"
          style={{
            left: `${15 + (i * 15)}%`,
            top: `${20 + ((i % 3) * 25)}%`,
          }}
          animate={{
            x: [offset.x * (i + 1) * 0.5, offset.x * (i + 1) * -0.5],
            y: [offset.y * (i + 1) * 0.5, offset.y * (i + 1) * -0.5],
            rotate: [0, 360],
          }}
          transition={{
            x: { duration: 30 + i * 5, repeat: Infinity, repeatType: 'reverse' },
            y: { duration: 25 + i * 5, repeat: Infinity, repeatType: 'reverse' },
            rotate: { duration: 60, repeat: Infinity, ease: 'linear' },
          }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Subtle grid pattern with movement */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px'],
        }}
        transition={{
          duration: 120,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};
