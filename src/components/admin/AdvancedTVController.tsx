import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTVCommands } from '@/hooks/useTVCommands';
import { usePizzas } from '@/hooks/usePizzas';
import { useVotes } from '@/hooks/useVotes';
import { calculatePizzaScore, getRankedPizzas, PizzaWithScore } from '@/types/database';
import {
  Tv, Play, Trophy, RotateCcw, ChevronRight, ChevronLeft,
  Pause, List, MapPin
} from 'lucide-react';

export const AdvancedTVController: React.FC = () => {
  const { tvCommand, setWaiting, setReveal, setWinner, nextPosition, prevPosition, setPosition, resetGame, isLoading } = useTVCommands();
  const { pizzas } = usePizzas();
  const { votes } = useVotes();

  const currentCommand = tvCommand?.command || 'waiting';
  const currentPosition = tvCommand?.current_position || 0;

  // Calculate ranked pizzas
  const pizzasWithScores: PizzaWithScore[] = pizzas.map((pizza) => {
    const pizzaVotes = votes.filter((v) => v.pizza_id === pizza.id);
    return {
      ...pizza,
      averageScore: calculatePizzaScore(pizzaVotes),
      voteCount: pizzaVotes.length,
      votes: pizzaVotes,
    };
  });

  const rankedGroups = [...getRankedPizzas(pizzasWithScores)].reverse();
  const flatRanked = rankedGroups.flat();

  return (
    <Card className="bg-card border-2 border-destructive/50 box-glow-pink">
      <CardHeader>
        <CardTitle className="font-display text-2xl text-destructive flex items-center gap-3">
          <Tv className="w-8 h-8" />
          Regia TV Avanzata
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="p-4 bg-muted/30 rounded-lg text-center">
          <p className="font-russo text-sm text-muted-foreground mb-2">Stato attuale:</p>
          <p className="font-display text-2xl text-foreground">
            {currentCommand.toUpperCase()}
            {currentCommand === 'reveal' && ` (${currentPosition + 1}/${flatRanked.length})`}
          </p>
        </div>

        {/* Main Controls */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={setWaiting}
            disabled={isLoading || currentCommand === 'waiting'}
            className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground"
          >
            <Pause className="w-5 h-5" />
            Attesa
          </Button>

          <Button
            onClick={setReveal}
            disabled={isLoading}
            className="flex items-center gap-2 bg-accent hover:bg-accent/80 text-accent-foreground"
          >
            <Play className="w-5 h-5" />
            Reveal
          </Button>

          <Button
            onClick={prevPosition}
            disabled={isLoading || currentCommand !== 'reveal' || currentPosition <= 0}
            className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          >
            <ChevronLeft className="w-5 h-5" />
            Indietro
          </Button>

          <Button
            onClick={nextPosition}
            disabled={isLoading || currentCommand !== 'reveal' || currentPosition >= flatRanked.length - 1}
            className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          >
            <ChevronRight className="w-5 h-5" />
            Avanti
          </Button>
        </div>

        {/* Winner Button */}
        <Button
          onClick={setWinner}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 gradient-pizza text-primary-foreground py-6"
        >
          <Trophy className="w-6 h-6" />
          MOSTRA VINCITORE! 🏆
        </Button>

        {/* Pizza Position Indicator (read-only) */}
        <div className="space-y-2">
          <Label className="font-russo text-sm flex items-center gap-2">
            <List className="w-4 h-4" />
            Posizione Corrente
          </Label>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {flatRanked.map((pizza, index) => (
              <div
                key={pizza.id}
                className={`w-full flex items-center justify-start p-2 rounded font-russo text-sm ${index === currentPosition && currentCommand === 'reveal'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/30 text-muted-foreground'
                  }`}
              >
                <MapPin className="w-3 h-3 mr-2" />
                #{pizza.number} {pizza.brand} - {pizza.averageScore.toFixed(1)}⭐
                {index === currentPosition && currentCommand === 'reveal' && (
                  <span className="ml-auto text-xs bg-background text-foreground px-2 py-0.5 rounded">
                    📍 QUI
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Reset */}
        <Button
          onClick={resetGame}
          variant="destructive"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          RESET GARA
        </Button>
      </CardContent>
    </Card>
  );
};
