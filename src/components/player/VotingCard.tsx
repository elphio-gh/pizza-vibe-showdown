import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pizza, Vote } from '@/types/database';
import { VoteSlider } from './VoteSlider';
import { useVotes } from '@/hooks/useVotes';
import { useRole } from '@/contexts/RoleContext';
import { ArrowLeft, Send, Check } from 'lucide-react';
import { VoteFeedback } from '@/components/effects/VoteFeedback';

interface VotingCardProps {
  pizza: Pizza;
  existingVote?: Vote;
  onBack: () => void;
}

export const VotingCard: React.FC<VotingCardProps> = ({ pizza, existingVote, onBack }) => {
  const { playerId } = useRole();
  const { createVote } = useVotes();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const [votes, setVotes] = useState({
    aspetto: existingVote?.aspetto ?? 5,
    gusto: existingVote?.gusto ?? 5,
    impasto: existingVote?.impasto ?? 5,
    farcitura: existingVote?.farcitura ?? 5,
    tony_factor: existingVote?.tony_factor ?? 5,
  });

  const isReadOnly = !!existingVote;

  const calculateScore = () => {
    return (
      votes.aspetto * 0.15 +
      votes.gusto * 0.30 +
      votes.impasto * 0.20 +
      votes.farcitura * 0.15 +
      votes.tony_factor * 0.20
    );
  };

  const handleSubmit = async () => {
    if (!playerId || isSubmitting || isReadOnly) return;

    setIsSubmitting(true);
    try {
      await createVote.mutateAsync({
        pizza_id: pizza.id,
        player_id: playerId,
        ...votes,
      });
      const score = calculateScore();
      setFinalScore(score);
      setShowFeedback(true);
    } catch (error) {
      console.error('Error submitting vote:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 animate-slide-up">
      {showFeedback && (
        <VoteFeedback score={finalScore} onComplete={onBack} />
      )}

      <Button
        variant="ghost"
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-5 h-5" />
        Torna alla lista
      </Button>

      <Card className="bg-card border-2 border-primary/50">
        <CardHeader className="text-center pb-2">
          <div className="text-6xl mb-2">🍕</div>
          <CardTitle className="font-display text-3xl text-primary">
            Pizza #{pizza.number}
          </CardTitle>
          <p className="font-game text-lg text-muted-foreground">
            {pizza.brand} - {pizza.flavor}
          </p>
          {isReadOnly && (
            <div className="flex items-center justify-center gap-2 mt-2 px-4 py-2 bg-green-500/20 rounded-lg">
              <Check className="w-5 h-5 text-green-500" />
              <span className="font-game text-green-500">Già votata!</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <VoteSlider
            label="Aspetto"
            emoji="📸"
            value={votes.aspetto}
            onChange={(v) => setVotes({ ...votes, aspetto: v })}
            disabled={isReadOnly}
          />
          <VoteSlider
            label="Gusto"
            emoji="😋"
            value={votes.gusto}
            onChange={(v) => setVotes({ ...votes, gusto: v })}
            disabled={isReadOnly}
          />
          <VoteSlider
            label="Impasto"
            emoji="🥖"
            value={votes.impasto}
            onChange={(v) => setVotes({ ...votes, impasto: v })}
            disabled={isReadOnly}
          />
          <VoteSlider
            label="Farcitura"
            emoji="🧀"
            value={votes.farcitura}
            onChange={(v) => setVotes({ ...votes, farcitura: v })}
            disabled={isReadOnly}
          />
          <VoteSlider
            label="Fattore Tony Buitony"
            emoji="🕶️"
            value={votes.tony_factor}
            onChange={(v) => setVotes({ ...votes, tony_factor: v })}
            disabled={isReadOnly}
          />

          {!isReadOnly && (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-6 font-display text-xl gradient-pizza text-primary-foreground box-glow-orange"
            >
              {isSubmitting ? (
                'Invio...'
              ) : (
                <>
                  INVIA VOTO <Send className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
