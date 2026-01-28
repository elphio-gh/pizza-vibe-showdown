import React from 'react';
import { usePizzas } from '@/hooks/usePizzas';
import { useVotes } from '@/hooks/useVotes';
import { usePlayers } from '@/hooks/usePlayers';
import { Pizza, Users, TrendingUp } from 'lucide-react';
import { calculateVoteScore } from '@/types/database';

export const LiveStats: React.FC = () => {
  const { pizzas } = usePizzas();
  const { votes } = useVotes();
  const { players } = usePlayers();

  // Calcola la media di tutti i voti
  const averageScore = votes.length > 0
    ? (votes.reduce((acc, vote) => acc + calculateVoteScore(vote), 0) / votes.length).toFixed(1)
    : '—';

  const stats = [
    { icon: Pizza, label: 'Pizze', value: pizzas.length, color: 'text-primary' },
    { icon: Users, label: 'Giocatori', value: players.length, color: 'text-accent' },
    { icon: TrendingUp, label: 'Media Voti', value: averageScore, color: 'text-secondary' },
  ];

  return (
    <div className="flex justify-center gap-8 md:gap-16 animate-float">
      {stats.map(({ icon: Icon, label, value, color }) => (
        <div key={label} className="text-center">
          <Icon className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 ${color}`} />
          <div className={`font-display text-5xl md:text-7xl ${color} text-glow-orange`}>
            {value}
          </div>
          <div className="font-russo text-lg md:text-xl text-muted-foreground mt-2">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
};

