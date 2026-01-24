import React from 'react';

export const SadElvis: React.FC = () => {
  return (
    <div className="text-center animate-shake">
      <div className="text-8xl mb-4">😭</div>
      <div className="flex justify-center gap-2 text-4xl">
        <span className="animate-float" style={{ animationDelay: '0s' }}>🎸</span>
        <span className="animate-float" style={{ animationDelay: '0.2s' }}>💔</span>
        <span className="animate-float" style={{ animationDelay: '0.4s' }}>🎵</span>
      </div>
      <div className="mt-4 font-display text-xl text-muted-foreground italic">
        "You ain't nothing but a cold pizza..."
      </div>
    </div>
  );
};
