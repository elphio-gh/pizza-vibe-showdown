import React, { useMemo } from 'react';
import { Pizza, Vote, Player } from '@/types/database';
import { calculateRecords, calculateRankings, calculatePlayerStats, calculateCategoryStats } from '@/utils/statsCalculations';
import { Card, CardContent } from '@/components/ui/card';
import { Award } from 'lucide-react';

interface RecordsTabProps {
    pizzas: Pizza[];
    votes: Vote[];
    players: Player[];
}

export const RecordsTab: React.FC<RecordsTabProps> = ({ pizzas, votes, players }) => {
    const records = useMemo(() => {
        // Need all intermediate stats for records
        const pizzasWithScores = calculateRankings(pizzas, votes, players);
        const playerStats = calculatePlayerStats(players, votes, pizzas);
        const categoryStats = calculateCategoryStats(votes);

        return calculateRecords(votes, pizzas, players, pizzasWithScores, playerStats, categoryStats);
    }, [pizzas, votes, players]);

    return (
        <div className="space-y-3">
            <h2 className="font-sans font-bold text-lg text-primary flex items-center gap-2 mb-4">
                <Award className="w-5 h-5" /> Record & Fun Facts
            </h2>

            <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">

                {/* Voto più alto */}
                {records.highestSingleVote && (
                    <Card className="border-secondary">
                        <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">🚀</span>
                                <span className="font-russo text-sm">Voto più alto</span>
                            </div>
                            <div className="text-2xl font-display text-secondary">
                                {records.highestSingleVote.score.toFixed(2)}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                                {(() => {
                                    const p = pizzas.find(px => px.id === records.highestSingleVote.pizza_id);
                                    return p ? `${p.brand} - ${p.flavor}` : 'Unknown Pizza';
                                })()} -
                                dato da {players.find(p => p.id === records.highestSingleVote.player_id)?.username}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Voto più basso */}
                {records.lowestSingleVote && (
                    <Card className="border-destructive">
                        <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">💀</span>
                                <span className="font-russo text-sm">Voto più basso</span>
                            </div>
                            <div className="text-2xl font-display text-destructive">
                                {records.lowestSingleVote.score.toFixed(2)}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                                {(() => {
                                    const p = pizzas.find(px => px.id === records.lowestSingleVote.pizza_id);
                                    return p ? `${p.brand} - ${p.flavor}` : 'Unknown Pizza';
                                })()} -
                                dato da {players.find(p => p.id === records.lowestSingleVote.player_id)?.username}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Pizza controversa */}
                {records.mostControversial && (
                    <Card className="border-purple-500/50">
                        <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">⚡</span>
                                <span className="font-russo text-sm">La più controversa</span>
                            </div>
                            <div className="font-russo text-lg">
                                {records.mostControversial.brand}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                                Varianza molto alta nei voti
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Pizza che mette d'accordo */}
                {records.mostAgreed && (
                    <Card className="border-green-500/50">
                        <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">🤝</span>
                                <span className="font-russo text-sm">Quella che mette d'accordo</span>
                            </div>
                            <div className="font-russo text-lg">
                                {records.mostAgreed.brand}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                                Voti molto simili tra loro
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Miglior Tony Factor */}
                {records.theRocker && (
                    <Card className="border-primary/50">
                        <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">🎸</span>
                                <span className="font-russo text-sm">Il Rocker (Max Tony Factor)</span>
                            </div>
                            <div className="font-russo text-lg">
                                {records.theRocker.username}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                                Media Tony Factor: {records.theRocker.categoryAverages.tony_factor.toFixed(2)}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Esteta */}
                {records.theAesthete && (
                    <Card className="border-blue-500/50">
                        <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">👀</span>
                                <span className="font-russo text-sm">L'Esteta (Max Aspetto)</span>
                            </div>
                            <div className="font-russo text-lg">
                                {records.theAesthete.username}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                                Media Aspetto: {records.theAesthete.categoryAverages.aspetto.toFixed(2)}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};
