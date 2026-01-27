import React, { useEffect, useState } from 'react';
import { Confetti } from './Confetti';
import { ThugLifeGlasses } from './ThugLifeGlasses';
import { SadElvis } from './SadElvis';

interface VoteFeedbackProps {
  score: number;
  onComplete: () => void;
}

export const VoteFeedback: React.FC<VoteFeedbackProps> = ({ score, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const isHighScore = score > 8;
  const isLowScore = score < 5;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      {isHighScore && <Confetti />}
      
      <div className="text-center space-y-6 animate-bounce-in">
        {isHighScore && (
          <>
            <ThugLifeGlasses />
            <div className="text-6xl font-display text-secondary text-glow-yellow animate-pulse-glow">
              BOOM! 🔥
            </div>
            <div className="text-4xl">😎🎉🍕</div>
          </>
        )}

        {isLowScore && (
          <>
            <SadElvis />
            <div className="text-6xl font-display text-destructive">
              Meh... 😢
            </div>
            <div className="text-4xl">🎻💔</div>
          </>
        )}

        {!isHighScore && !isLowScore && (
          <>
            <div className="text-8xl animate-float">🍕</div>
            <div className="text-4xl font-display text-primary text-glow-orange">
              Voto Registrato!
            </div>
            <div className="text-3xl">👍</div>
          </>
        )}

        <div className="font-russo text-2xl text-muted-foreground">
          Punteggio: <span className="text-foreground font-display text-3xl">{score.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};
