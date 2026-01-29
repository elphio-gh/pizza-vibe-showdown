import React, { useMemo } from 'react';
import { Pizza, Vote, Player } from '@/types/database';
import { calculateRankings } from '@/utils/statsCalculations';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface RankingTabProps {
    pizzas: Pizza[];
    votes: Vote[];
    players: Player[];
}

export const RankingTab: React.FC<RankingTabProps> = ({ pizzas, votes, players }) => {
    const pizzasWithScores = useMemo(() => {
        return calculateRankings(pizzas, votes, players);
    }, [pizzas, votes, players]);

    return (
        <div className="space-y-3">
            <h2 className="font-sans font-bold text-lg text-primary flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5" /> Classifica Finale ({pizzas.length} pizze)
            </h2>

            <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
                {pizzasWithScores.map((pizza, index) => (
                    <Card key={pizza.id} className={`${index === 0 ? 'border-primary box-glow-orange' : ''}`}>
                        <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                                <div className="text-2xl font-display text-primary min-w-[2rem] text-center">
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{pizza.emoji || '🍕'}</span>
                                        <div className="truncate">
                                            <div className="font-russo text-sm truncate">{pizza.brand} - {pizza.flavor}</div>
                                            <div className="text-[10px] text-muted-foreground">
                                                Pizza #{pizza.number} • {pizza.voteCount} voti
                                                {pizza.registeredByPlayer && (
                                                    <span className="text-primary"> • {pizza.registeredByPlayer.username}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-display text-xl text-secondary">{pizza.averageScore.toFixed(2)}</div>
                                    <div className="text-[10px] text-muted-foreground">pts</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
