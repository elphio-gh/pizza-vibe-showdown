import React from 'react';
import { LiveStats } from './LiveStats';

export const WaitingMode: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="space-y-8 animate-bounce-in">
        <div className="text-[120px] md:text-[180px] animate-float">🍕</div>
        
        <h1 className="font-display text-6xl md:text-8xl gradient-pizza bg-clip-text text-transparent">
          TONY BUITONY CUP
        </h1>
        
        <p className="font-game text-2xl md:text-3xl text-muted-foreground animate-pulse-glow">
          La competizione sta per iniziare...
        </p>

        <div className="pt-12">
          <LiveStats />
        </div>

        <div className="flex justify-center gap-4 text-4xl pt-8">
          <span className="animate-float" style={{ animationDelay: '0s' }}>🎸</span>
          <span className="animate-float" style={{ animationDelay: '0.2s' }}>🕶️</span>
          <span className="animate-float" style={{ animationDelay: '0.4s' }}>🎤</span>
          <span className="animate-float" style={{ animationDelay: '0.6s' }}>🎵</span>
        </div>
      </div>
    </div>
  );
};
