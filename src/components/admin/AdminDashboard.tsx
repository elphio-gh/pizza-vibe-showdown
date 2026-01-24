import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePizzas } from '@/hooks/usePizzas';
import { useVotes } from '@/hooks/useVotes';
import { usePlayers } from '@/hooks/usePlayers';
import { Pizza, Users, Vote, TrendingUp } from 'lucide-react';
import { calculateVoteScore } from '@/types/database';

export const AdminDashboard: React.FC = () => {
  const { pizzas } = usePizzas();
  const { votes } = useVotes();
  const { players } = usePlayers();

  const averageScore = votes.length > 0
    ? (votes.reduce((acc, vote) => acc + calculateVoteScore(vote), 0) / votes.length).toFixed(1)
    : '0.0';

  const stats = [
    { icon: Pizza, label: 'Pizze', value: pizzas.length, color: 'text-primary' },
    { icon: Users, label: 'Giocatori', value: players.length, color: 'text-accent' },
    { icon: Vote, label: 'Voti', value: votes.length, color: 'text-secondary' },
    { icon: TrendingUp, label: 'Media', value: averageScore, color: 'text-destructive' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(({ icon: Icon, label, value, color }) => (
        <Card key={label} className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className={`font-game text-sm ${color} flex items-center gap-2`}>
              <Icon className="w-4 h-4" />
              {label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`font-display text-4xl ${color}`}>{value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
