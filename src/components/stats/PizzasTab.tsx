import React, { useMemo, useState } from 'react';
import { Pizza, Vote, Player } from '@/types/database';
import { calculateRankings, calculatePizzaDetails } from '@/utils/statsCalculations';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Pizza as PizzaIcon, ChevronDown, ChevronRight } from 'lucide-react';

interface PizzasTabProps {
    pizzas: Pizza[];
    votes: Vote[];
    players: Player[];
}

export const PizzasTab: React.FC<PizzasTabProps> = ({ pizzas, votes, players }) => {
    const [expandedPizzas, setExpandedPizzas] = useState<Set<string>>(new Set());

    const pizzaDetailedStats = useMemo(() => {
        // We need rankings first to get scores
        const pizzasWithScores = calculateRankings(pizzas, votes, players);
        return calculatePizzaDetails(pizzasWithScores);
    }, [pizzas, votes, players]);

    const togglePizza = (id: string) => {
        setExpandedPizzas(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <div className="space-y-3">
            <h2 className="font-sans font-bold text-lg text-primary flex items-center gap-2 mb-4">
                <PizzaIcon className="w-5 h-5" /> Dettaglio Pizze ({pizzas.length})
            </h2>

            <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
                {pizzaDetailedStats.map((item, index) => (
                    <Collapsible
                        key={item.pizza.id}
                        open={expandedPizzas.has(item.pizza.id)}
                        onOpenChange={() => togglePizza(item.pizza.id)}
                    >
                        <Card className={index === 0 ? 'border-primary' : ''}>
                            <CollapsibleTrigger className="w-full">
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="text-xl">{item.pizza.emoji || '🍕'}</div>
                                        <div className="flex-1 min-w-0 text-left">
                                            <div className="font-russo text-sm truncate">{item.pizza.brand} - {item.pizza.flavor}</div>
                                        </div>
                                        <div className="font-display text-lg text-secondary">{item.pizza.averageScore.toFixed(2)}</div>
                                        {expandedPizzas.has(item.pizza.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </div>
                                </CardContent>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <CardContent className="pt-0 pb-3 px-3">
                                    <div className="border-t border-border pt-3 space-y-2">
                                        {item.categoryDetails.map(cat => (
                                            <div key={cat.name} className="flex items-center gap-2">
                                                <span className="text-sm">{cat.emoji}</span>
                                                <span className="font-russo text-xs flex-1">{cat.name}</span>
                                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                                                        style={{ width: `${(cat.average / 10) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="font-display text-sm text-secondary min-w-[2.5rem] text-right">{cat.average.toFixed(1)}</span>
                                            </div>
                                        ))}
                                        <div className="text-[10px] text-muted-foreground pt-2 flex justify-between">
                                            <span>{item.pizza.voteCount} voti totali</span>
                                            {item.pizza.registeredByPlayer && (
                                                <span>di {item.pizza.registeredByPlayer.username}</span>
                                            )}
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
