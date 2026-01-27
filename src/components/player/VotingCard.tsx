import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pizza, Vote } from '@/types/database';
import { VoteSlider } from './VoteSlider';
import { useVotes } from '@/hooks/useVotes';
import { useRole } from '@/contexts/RoleContext';
import { ArrowLeft, Send, Check, AlertTriangle } from 'lucide-react';
import { VoteFeedback } from '@/components/effects/VoteFeedback';

interface VotingCardProps {
  pizza: Pizza;
  existingVote?: Vote;
  onBack: () => void;
}

// Meme-style warning messages
const WARNING_MESSAGES = [
  "⚠️ ATTENZIONE: Il voto è definitivo come la carbonara con la panna... irreversibile! 🍝",
  "🚨 Una volta votato, non si torna indietro. Come l'ananas sulla pizza, è una scelta di vita! 🍍",
  "⚡ Voto permanente! Pensa bene, non puoi fare CTRL+Z come con gli screenshot cringe 😬",
  "🔒 Il voto è per sempre, come il tatuaggio del delfino che volevi a 18 anni 🐬",
  "💀 No take-backsies! Questo voto è più definitivo di un messaggio su WhatsApp con le spunte blu ✓✓",
];

const getScoreEmoji = (score: number): string => {
  if (score <= 3) return '💩';
  if (score <= 4) return '😬';
  if (score <= 5) return '😐';
  if (score <= 6) return '🤔';
  if (score <= 7) return '😊';
  if (score <= 8) return '😍';
  if (score <= 9) return '🔥';
  return '🏆';
};

const getScoreLabel = (score: number): string => {
  if (score <= 2) return 'Tragica';
  if (score <= 3) return 'Scarsa';
  if (score <= 4) return 'Meh...';
  if (score <= 5) return 'Nella media';
  if (score <= 6) return 'Discreta';
  if (score <= 7) return 'Buona!';
  if (score <= 8) return 'Ottima!';
  if (score <= 9) return 'TOP!';
  return 'LEGGENDARIA!';
};

export const VotingCard: React.FC<VotingCardProps> = ({ pizza, existingVote, onBack }) => {
  const { playerId } = useRole();
  const { createVote } = useVotes();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Random warning message (stays the same during component lifecycle)
  const [warningMessage] = useState(() =>
    WARNING_MESSAGES[Math.floor(Math.random() * WARNING_MESSAGES.length)]
  );

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

  const currentScore = calculateScore();

  const handleSubmit = async () => {
    if (!playerId || isSubmitting || isReadOnly) return;

    setIsSubmitting(true);
    try {
      await createVote.mutateAsync({
        pizza_id: pizza.id,
        player_id: playerId,
        ...votes,
      });
      setFinalScore(currentScore);
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
            {pizza.brand} - {pizza.flavor}
          </CardTitle>
          <p className="font-russo text-sm text-muted-foreground">
            Pizza #{pizza.number}
          </p>
          {isReadOnly && (
            <div className="flex items-center justify-center gap-2 mt-2 px-4 py-2 bg-green-500/20 rounded-lg">
              <Check className="w-5 h-5 text-green-500" />
              <span className="font-russo text-green-500">Già votata!</span>
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
            <>
              {/* Score Preview */}
              <div className="p-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl border-2 border-primary/30">
                <div className="text-center space-y-2">
                  <p className="font-russo text-sm text-muted-foreground uppercase tracking-wide">
                    Voto che stai per dare
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-5xl">{getScoreEmoji(currentScore)}</span>
                    <div className="text-left">
                      <p className="font-display text-4xl text-primary text-glow-orange">
                        {currentScore.toFixed(1)}
                      </p>
                      <p className="font-russo text-sm text-foreground">
                        {getScoreLabel(currentScore)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meme-style warning */}
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="font-russo text-xs text-center text-destructive/90 leading-relaxed">
                  {warningMessage}
                </p>
              </div>

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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
