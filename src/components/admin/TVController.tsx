import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTVCommands } from '@/hooks/useTVCommands';
import { Tv, Play, Trophy, RotateCcw, ChevronRight, Pause } from 'lucide-react';

export const TVController: React.FC = () => {
  const { tvCommand, setWaiting, setReveal, setWinner, nextPosition, resetGame, isLoading } = useTVCommands();

  const currentCommand = tvCommand?.command || 'waiting';
  const currentPosition = tvCommand?.current_position || 0;

  return (
    <Card className="bg-card border-2 border-destructive/50 box-glow-pink">
      <CardHeader>
        <CardTitle className="font-display text-2xl text-destructive flex items-center gap-3">
          <Tv className="w-8 h-8" />
          Regia TV
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted/30 rounded-lg text-center">
          <p className="font-game text-sm text-muted-foreground mb-2">Stato attuale:</p>
          <p className="font-display text-2xl text-foreground">
            {currentCommand.toUpperCase()} 
            {currentCommand === 'reveal' && ` (Pos: ${currentPosition})`}
          </p>
        </div>

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
            onClick={nextPosition}
            disabled={isLoading || currentCommand !== 'reveal'}
            className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          >
            <ChevronRight className="w-5 h-5" />
            Prossima
          </Button>

          <Button
            onClick={setWinner}
            disabled={isLoading}
            className="flex items-center gap-2 gradient-pizza text-primary-foreground"
          >
            <Trophy className="w-5 h-5" />
            Vincitore!
          </Button>
        </div>

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
