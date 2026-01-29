import React, { useMemo } from 'react';
import { Pizza, Vote, Player, calculateVoteScore } from '@/types/database';
import { calculateCategoryStats, calculateRankings, calculatePizzaDetails } from '@/utils/statsCalculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface CategoriesTabProps {
    pizzas: Pizza[];
    votes: Vote[];
    players: Player[];
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({ pizzas, votes, players }) => {
    const { categoryStats, bestByCategory, intervalStats } = useMemo(() => {
        const catStats = calculateCategoryStats(votes);

        // We need rankings for best/worst
        const pizzasWithScores = calculateRankings(pizzas, votes, players);
        const pizzaDetailedStats = calculatePizzaDetails(pizzasWithScores);

        const bestByCat = ['aspetto', 'gusto', 'impasto', 'farcitura', 'tony_factor'].map(cat => {
            const sorted = [...pizzaDetailedStats].sort((a, b) =>
                b.categoryAverages[cat as keyof typeof b.categoryAverages] - a.categoryAverages[cat as keyof typeof a.categoryAverages]
            );
            return {
                category: cat,
                categoryName: cat === 'tony_factor' ? 'Tony Factor' : cat.charAt(0).toUpperCase() + cat.slice(1),
                emoji: cat === 'aspetto' ? '👀' : cat === 'gusto' ? '😋' : cat === 'impasto' ? '🍞' : cat === 'farcitura' ? '🧀' : '🎸',
                best: sorted[0],
                worst: sorted[sorted.length - 1]
            };
        });

        // Time calculations
        const votesByInterval = votes.reduce((acc, v) => {
            const date = new Date(v.created_at);
            const hour = date.getHours();
            const minute = date.getMinutes();

            // Arrotonda ai 15 minuti (0, 15, 30, 45)
            const intervalKey = `${hour}:${Math.floor(minute / 15) * 15 === 0 ? '00' : Math.floor(minute / 15) * 15}`;
            const sortKey = hour * 60 + Math.floor(minute / 15) * 15; // Per ordinamento

            if (!acc[sortKey]) acc[sortKey] = { label: intervalKey, votes: [] };
            acc[sortKey].votes.push(v);
            return acc;
        }, {} as Record<number, { label: string, votes: Vote[] }>);

        const timeStats = Object.entries(votesByInterval).map(([sortKey, data]) => ({
            sortKey: parseInt(sortKey),
            label: data.label,
            count: data.votes.length,
            average: data.votes.reduce((acc, v) => acc + calculateVoteScore(v), 0) / data.votes.length
        })).sort((a, b) => a.sortKey - b.sortKey);

        return {
            categoryStats: catStats,
            bestByCategory: bestByCat,
            intervalStats: timeStats
        };
    }, [pizzas, votes, players]);

    return (
        <div className="space-y-4">
            <h2 className="font-sans font-bold text-lg text-primary flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5" /> Analisi Categorie
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryStats.map(cat => (
                    <Card key={cat.name}>
                        <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{cat.emoji}</span>
                                    <span className="font-russo text-sm">{cat.name}</span>
                                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{cat.weight}</span>
                                </div>
                                <div className="font-display text-lg text-secondary">{cat.average.toFixed(2)}</div>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                                    style={{ width: `${(cat.average / 10) * 100}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                                <span>Min: {cat.min}</span>
                                <span>Max: {cat.max}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Miglior/Peggior pizza per categoria */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-russo">🏅 Best & Worst per Categoria</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {bestByCategory.map(item => (
                            <div key={item.category} className="flex flex-col gap-1 text-[11px] border-b border-border/50 pb-2 last:border-0 last:pb-0">
                                <div className="flex items-center gap-2">
                                    <span>{item.emoji}</span>
                                    <span className="font-russo flex-1">{item.categoryName}</span>
                                </div>
                                <div className="flex flex-col gap-1 pl-6">
                                    <div className="text-green-500 truncate">
                                        🥇 {item.best.pizza.brand} - {item.best.pizza.flavor}
                                    </div>
                                    <div className="text-red-500 truncate">
                                        💀 {item.worst.pizza.brand} - {item.worst.pizza.flavor}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Voti per ora */}
                {intervalStats.length > 1 && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-russo">⏰ Voti per Orario</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                {intervalStats.map(h => (
                                    <div key={h.label} className="flex items-center gap-2 text-[11px]">
                                        <span className="font-russo w-12">{h.label}</span>
                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full"
                                                style={{ width: `${(h.count / Math.max(...intervalStats.map(x => x.count))) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-muted-foreground">{h.count} voti</span>
                                        <span className="font-display text-secondary">{h.average.toFixed(1)}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};
