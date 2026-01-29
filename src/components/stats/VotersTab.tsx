import React, { useMemo, useState } from 'react';
import { Pizza, Vote, Player } from '@/types/database';
import { calculatePlayerStats } from '@/utils/statsCalculations';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { User, ChevronDown, ChevronRight } from 'lucide-react';

interface VotersTabProps {
    pizzas: Pizza[];
    votes: Vote[];
    players: Player[];
}

export const VotersTab: React.FC<VotersTabProps> = ({ pizzas, votes, players }) => {
    const [expandedPlayers, setExpandedPlayers] = useState<Set<string>>(new Set());

    const { playerStats, generousVoters, stingyVoters, participatingPlayers } = useMemo(() => {
        const stats = calculatePlayerStats(players, votes, pizzas);
        const generous = [...stats].sort((a, b) => b.averageGiven - a.averageGiven);
        const stingy = [...stats].sort((a, b) => a.averageGiven - b.averageGiven);
        return {
            playerStats: stats,
            generousVoters: generous,
            stingyVoters: stingy,
            participatingPlayers: stats.length
        };
    }, [players, votes, pizzas]);

    const togglePlayer = (id: string) => {
        setExpandedPlayers(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <div className="space-y-4">
            {/* Top 3 Generosi e Top 3 Tirchi */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Top 3 Generosi */}
                <Card className="bg-gradient-to-br from-green-500/10 to-transparent">
                    <CardContent className="p-2">
                        <div className="text-[10px] text-muted-foreground mb-2">🎁 Top 3 Generosi</div>
                        {generousVoters.slice(0, 3).map((voter, idx) => (
                            <div key={voter.id} className="flex items-center gap-1 mb-1">
                                <span className="text-xs">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                                <span className="font-russo text-xs truncate flex-1">{voter.username}</span>
                                <span className="font-display text-xs text-primary">{voter.averageGiven.toFixed(2)}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                {/* Top 3 Tirchi */}
                <Card className="bg-gradient-to-br from-red-500/10 to-transparent">
                    <CardContent className="p-2">
                        <div className="text-[10px] text-muted-foreground mb-2">😤 Top 3 Tirchi</div>
                        {stingyVoters.slice(0, 3).map((voter, idx) => (
                            <div key={voter.id} className="flex items-center gap-1 mb-1">
                                <span className="text-xs">{idx === 0 ? '💀' : idx === 1 ? '😬' : '😑'}</span>
                                <span className="font-russo text-xs truncate flex-1">{voter.username}</span>
                                <span className="font-display text-xs text-destructive">{voter.averageGiven.toFixed(2)}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <h3 className="font-sans font-bold text-sm text-primary flex items-center gap-2 mt-6 mb-3">
                <User className="w-4 h-4" /> Tutti i Votanti ({participatingPlayers})
            </h3>

            <div className="space-y-2 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
                {playerStats.map(player => (
                    <Collapsible
                        key={player.id}
                        open={expandedPlayers.has(player.id)}
                        onOpenChange={() => togglePlayer(player.id)}
                    >
                        <Card>
                            <CollapsibleTrigger className="w-full">
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="text-xl">
                                            {player.averageGiven >= 7 ? '💖' : player.averageGiven >= 6 ? '😊' : '😐'}
                                        </div>
                                        <div className="flex-1 min-w-0 text-left">
                                            <div className="font-russo text-sm">{player.username}</div>
                                            <div className="text-[10px] text-muted-foreground">
                                                {player.totalVotes} voti • media {player.averageGiven.toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="text-right text-[10px] text-muted-foreground">
                                            <div>max: {player.maxVote.toFixed(1)}</div>
                                            <div>min: {player.minVote.toFixed(1)}</div>
                                        </div>
                                        {expandedPlayers.has(player.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </div>
                                </CardContent>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <CardContent className="pt-0 pb-3 px-3">
                                    <div className="border-t border-border pt-3 space-y-3">
                                        {/* Medie per categoria */}
                                        <div>
                                            <div className="text-[10px] text-muted-foreground mb-2">Medie per categoria:</div>
                                            <div className="grid grid-cols-5 gap-1 text-center">
                                                <div>
                                                    <div className="text-sm">👀</div>
                                                    <div className="font-display text-xs">{player.categoryAverages.aspetto.toFixed(1)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm">😋</div>
                                                    <div className="font-display text-xs">{player.categoryAverages.gusto.toFixed(1)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm">🍞</div>
                                                    <div className="font-display text-xs">{player.categoryAverages.impasto.toFixed(1)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm">🧀</div>
                                                    <div className="font-display text-xs">{player.categoryAverages.farcitura.toFixed(1)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm">🎸</div>
                                                    <div className="font-display text-xs">{player.categoryAverages.tony_factor.toFixed(1)}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Lista voti dati */}
                                        <div>
                                            <div className="text-[10px] text-muted-foreground mb-2">Voti dati:</div>
                                            <div className="space-y-1 max-h-48 overflow-y-auto">
                                                {player.votesGiven.map((v, idx) => (
                                                    <div key={v.vote.id} className="flex items-center gap-2 text-[11px] bg-muted/30 rounded p-1.5">
                                                        <span className="font-russo w-4 text-center text-muted-foreground">{idx + 1}</span>
                                                        <span>{v.pizza.emoji || '🍕'}</span>
                                                        <span className="flex-1 truncate font-russo">{v.pizza.brand} - {v.pizza.flavor}</span>
                                                        <span className="font-display text-secondary">{v.score.toFixed(1)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </CollapsibleContent>
                        </Card>
                    </Collapsible>
                ))}
            </div>
        </div>
    );
};
