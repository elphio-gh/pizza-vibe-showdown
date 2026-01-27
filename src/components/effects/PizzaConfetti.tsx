import React from 'react';

const emojis = ['🍕', '🏆', '🎉', '🎸', '🔥', '✨', '💿', '🌭', '🕺', '🎪', '🎲', '🎯', '🚀', '🧀', '🍅'];

export const PizzaConfetti: React.FC = () => {
    // Create more pieces for a denser effect
    const pieces = Array.from({ length: 70 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2}s`, // Spread start times more
        duration: `${2 + Math.random() * 2}s`, // Slower fall for emojis
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        rotation: Math.random() * 360,
        size: 20 + Math.random() * 20, // Vary size
        xOffset: (Math.random() - 0.5) * 100, // Horizontal sway
    }));

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            <style>
                {`
          @keyframes fall-sway {
            0% {
              transform: translateY(-50px) rotate(0deg) translateX(0px);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            100% {
              transform: translateY(110vh) rotate(720deg) translateX(var(--sway));
              opacity: 0;
            }
          }
        `}
            </style>
            {pieces.map((piece) => (
                <div
                    key={piece.id}
                    className="absolute"
                    style={{
                        left: piece.left,
                        top: '-50px',
                        fontSize: `${piece.size}px`,
                        animationName: 'fall-sway',
                        animationTimingFunction: 'linear',
                        animationIterationCount: 'infinite',
                        animationDelay: piece.delay,
                        animationDuration: piece.duration,
                        '--sway': `${piece.xOffset}px`,
                    } as React.CSSProperties}
                >
                    {piece.emoji}
                </div>
            ))}
        </div>
    );
};
