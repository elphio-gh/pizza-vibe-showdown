import React, { useEffect, useState, useMemo } from 'react';
import { Confetti } from './Confetti';
import { ThugLifeGlasses } from './ThugLifeGlasses';
import { SadElvis } from './SadElvis';
import { getFeedbackMessage } from '@/lib/feedbackUtils';

interface VoteFeedbackProps {
  score: number;
  onComplete: () => void;
}

export const VoteFeedback: React.FC<VoteFeedbackProps> = ({ score, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const isHighScore = score >= 8.5;
  const isLowScore = score <= 5.0;

  // Memoize functionality to prevent re-roll on renders
  const feedbackMessage = useMemo(() => getFeedbackMessage(score), [score]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 3000); // Slightly longer to read the meme

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      {isHighScore && <Confetti />}

      <div className="text-center space-y-4 animate-bounce-in px-4">
        {isHighScore && (
          <>
            <ThugLifeGlasses />
            <div className="text-6xl font-display text-secondary text-glow-yellow animate-pulse-glow">
              BOOM! 🔥
            </div>
            <div className="text-2xl md:text-3xl font-display text-foreground leading-tight break-words mt-2">
              "{feedbackMessage}"
            </div>
          </>
        )}

        {isLowScore && (
          <>
            <SadElvis />
            <div className="text-6xl font-display text-destructive">
              Ahi... 🤕
            </div>
            <div className="text-2xl md:text-3xl font-display text-foreground leading-tight break-words mt-2">
              "{feedbackMessage}"
            </div>
          </>
        )}

        {!isHighScore && !isLowScore && (
          <>
            <div className="text-8xl animate-float mb-4">🍕</div>
            <div className="text-4xl font-display text-primary text-glow-orange">
              Voto Registrato!
            </div>
            <div className="text-2xl md:text-3xl font-display text-foreground leading-tight break-words mt-2">
              "{feedbackMessage}"
            </div>
          </>
        )}

        <div className="font-russo text-2xl text-muted-foreground">
          Punteggio: <span className="text-foreground font-display text-4xl ml-2">{score.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};
