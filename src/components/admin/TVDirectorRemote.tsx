import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTVCommands } from '@/hooks/useTVCommands';
import { usePizzas } from '@/hooks/usePizzas';
import { useVotes } from '@/hooks/useVotes';
import { calculatePizzaScore, getRankedPizzas, PizzaWithScore } from '@/types/database';
import {
    Tv, Trophy, RotateCcw, ChevronRight, ChevronLeft,
    Pause, StopCircle, Loader2
} from 'lucide-react';

export const TVDirectorRemote: React.FC = () => {
    const {
        tvCommand,
        setStopTelevolto,
        setPause,
        setReveal,
        setPreWinner,
        setWinner,
        nextPosition,
        prevPosition,
        setPosition,
        resetGame,
        isPending
    } = useTVCommands();
    const { pizzas } = usePizzas();
    const { votes } = useVotes();

    const currentCommand = tvCommand?.command || 'waiting';
    const currentPosition = tvCommand?.current_position || 0;

    // Calculate ranked pizzas (from worst to best)
    const { flatRanked, totalPositions, currentPizzaInfo, currentRank, isAtLastBeforeWinner, canShowWinner, topGroupSize, rankedGroups } = useMemo(() => {
        const pizzasWithScores: PizzaWithScore[] = pizzas.map((pizza) => {
            const pizzaVotes = votes.filter((v) => v.pizza_id === pizza.id);
            return {
                ...pizza,
                averageScore: calculatePizzaScore(pizzaVotes),
                voteCount: pizzaVotes.length,
                votes: pizzaVotes,
            };
        });

        // Reverse to go from worst to best
        const rankedGroups = [...getRankedPizzas(pizzasWithScores)].reverse();
        const flat = rankedGroups.flat();
        const total = flat.length;

        // Get current pizza info
        let pizzaInfo = null;
        let rank = 0;

        if (currentPosition > 0 && currentPosition <= flat.length) {
            const pizza = flat[currentPosition - 1];
            if (pizza) {
                pizzaInfo = pizza;

                // Calculate actual rank (position from best, not index)
                // Since we're reversed, first in flat = worst, last in flat = best
                // So rank = totalPositions - currentPosition + 1
                rank = total - currentPosition + 1;
            }
        }

        // Check if we're at the last position before winner
        // The winning group is the last group in rankedGroups (since it's reversed: worst -> best)
        const topGroup = rankedGroups.length > 0 ? rankedGroups[rankedGroups.length - 1] : [];
        const topGroupSize = topGroup.length;

        // If we are at the position just before the top group starts
        // topGroupSize = 1 -> stop at total - 1
        // topGroupSize = 2 -> stop at total - 2
        const atLastBeforeWinner = currentPosition === total - topGroupSize && total > topGroupSize;

        // Can show winner if we're at "pre_winner" state
        const canWinner = currentCommand === 'pre_winner';

        return {
            flatRanked: flat,
            totalPositions: total,
            currentPizzaInfo: pizzaInfo,
            currentRank: rank,
            isAtLastBeforeWinner: atLastBeforeWinner,
            canShowWinner: canWinner,
            topGroupSize,
            rankedGroups,
        };
    }, [pizzas, votes, currentPosition, currentCommand]);

    // Calculate next position considering ex-aequo groups
    // This function finds the start of the next group in the ranking
    const getNextGroupPosition = (): number => {
        if (currentPosition <= 0) return 1;

        let positionCounter = 0;
        for (const group of rankedGroups) {
            const groupEnd = positionCounter + group.length;

            // If current position is within this group, return the next group's start
            if (currentPosition > positionCounter && currentPosition <= groupEnd) {
                return groupEnd + 1;
            }
            positionCounter = groupEnd;
        }
        return currentPosition + 1;
    };

    // Calculate previous position considering ex-aequo groups
    // This function finds the start of the previous group in the ranking
    const getPrevGroupPosition = (): number => {
        if (currentPosition <= 1) return 1;

        let positionCounter = 0;
        let prevGroupStart = 1;

        for (const group of rankedGroups) {
            const groupStart = positionCounter + 1;
            const groupEnd = positionCounter + group.length;

            // If current position is within this group, go back to previous group's start
            if (currentPosition > positionCounter && currentPosition <= groupEnd) {
                return prevGroupStart;
            }

            prevGroupStart = groupStart;
            positionCounter = groupEnd;
        }
        return 1;
    };

    // Determine if we should transition to pre_winner on next
    const handleNext = () => {
        if (isAtLastBeforeWinner && currentCommand === 'reveal') {
            // At last position, next goes to pre-winner state
            setPreWinner();
        } else {
            const nextPos = getNextGroupPosition();
            // Only proceed if we're still before the winner threshold
            if (nextPos <= totalPositions - (topGroupSize || 1)) {
                setPosition(nextPos);
            }
        }
    };

    const handlePrev = () => {
        if (currentCommand === 'pre_winner') {
            // Go back from pre-winner to last non-winner position
            setPosition(totalPositions - topGroupSize);
        } else {
            const prevPos = getPrevGroupPosition();
            setPosition(prevPos);
        }
    };

    // Get status display text
    const getStatusDisplay = () => {
        switch (currentCommand) {
            case 'stop_televote':
                return { text: 'STOP TELEVOTO', color: 'text-destructive', bg: 'bg-destructive/20' };
            case 'pause':
                return { text: 'PAUSA', color: 'text-yellow-500', bg: 'bg-yellow-500/20' };
            case 'reveal':
                return { text: `POSIZIONE ${currentRank}`, color: 'text-primary', bg: 'bg-primary/20' };
            case 'pre_winner':
                return { text: 'AND THE WINNER IS...', color: 'text-accent', bg: 'bg-accent/20' };
            case 'winner':
                return { text: 'VINCITORE!', color: 'text-secondary', bg: 'bg-secondary/20' };
            case 'waiting':
            default:
                return { text: 'ATTESA', color: 'text-muted-foreground', bg: 'bg-muted/30' };
        }
    };

    const status = getStatusDisplay();
    const isInRevealFlow = currentCommand === 'reveal' || currentCommand === 'pre_winner';
    const canGoBack = isInRevealFlow && (currentPosition > 1 || currentCommand === 'pre_winner');
    const canGoForward = isInRevealFlow && currentPosition < totalPositions && currentCommand !== 'pre_winner';

    return (
        <Card className="bg-card border-2 border-destructive/50 box-glow-pink">
            <CardHeader className="pb-3">
                <CardTitle className="font-display text-2xl text-destructive flex items-center gap-3">
                    <Tv className="w-8 h-8" />
                    🎬 REGIA TV - Telecomando
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                {/* Current Status Display */}
                <div className={`p-4 rounded-xl text-center ${status.bg} border border-border`}>
                    <p className="font-russo text-sm text-muted-foreground mb-1">Stato TV</p>
                    <p className={`font-display text-3xl ${status.color}`}>
                        {isPending && <Loader2 className="inline w-6 h-6 mr-2 animate-spin" />}
                        {status.text}
                    </p>
                </div>

                {/* Main Control Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        onClick={setStopTelevolto}
                        disabled={isPending || currentCommand === 'stop_televote'}
                        className="flex items-center justify-center gap-2 h-16 bg-destructive hover:bg-destructive/80 text-destructive-foreground text-lg font-russo"
                    >
                        <StopCircle className="w-6 h-6" />
                        STOP TELEVOTO
                    </Button>

                    <Button
                        onClick={setPause}
                        disabled={isPending || currentCommand === 'pause'}
                        className="flex items-center justify-center gap-2 h-16 bg-yellow-600 hover:bg-yellow-600/80 text-white text-lg font-russo"
                    >
                        <Pause className="w-6 h-6" />
                        PAUSA ☕
                    </Button>
                </div>

                {/* Navigation Section */}
                <div className="pt-3 border-t border-border">
                    <p className="font-russo text-sm text-muted-foreground text-center mb-3">
                        ─── NAVIGAZIONE CLASSIFICA ───
                    </p>

                    {/* Start Reveal Button */}
                    {!isInRevealFlow && (
                        <Button
                            onClick={() => setReveal()}
                            disabled={isPending || totalPositions === 0}
                            className="w-full mb-3 flex items-center justify-center gap-2 h-14 bg-primary hover:bg-primary/80 text-primary-foreground text-lg font-russo"
                        >
                            ▶️ INIZIA REVEAL
                        </Button>
                    )}

                    {/* Navigation Arrows */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            onClick={handlePrev}
                            disabled={isPending || !canGoBack}
                            className="flex items-center justify-center gap-2 h-14 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-lg font-russo"
                        >
                            <ChevronLeft className="w-7 h-7" />
                            INDIETRO
                        </Button>

                        <Button
                            onClick={handleNext}
                            disabled={isPending || (!canGoForward && !isAtLastBeforeWinner)}
                            className="flex items-center justify-center gap-2 h-14 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-lg font-russo"
                        >
                            AVANTI
                            <ChevronRight className="w-7 h-7" />
                        </Button>
                    </div>
                </div>

                {/* Winner Button */}
                <Button
                    onClick={setWinner}
                    disabled={isPending || !canShowWinner}
                    className={`w-full flex items-center justify-center gap-3 py-8 text-xl font-display 
            ${canShowWinner
                            ? 'gradient-pizza text-primary-foreground animate-pulse-glow'
                            : 'bg-muted text-muted-foreground'
                        }`}
                >
                    <Trophy className="w-8 h-8" />
                    🏆 MOSTRA VINCITORE! 🏆
                </Button>

                {/* Position Tracker with Full Ranking */}
                <div className="p-4 bg-muted/30 rounded-xl border border-border">
                    <p className="font-russo text-sm text-muted-foreground text-center mb-2">
                        ═══ TRACKER - CLASSIFICA ═══
                    </p>

                    {/* Current Position Summary */}
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-russo text-lg text-foreground">
                            Posizione: <span className="text-primary font-bold">
                                {isInRevealFlow ? currentPosition : '-'}/{totalPositions}
                            </span>
                        </span>
                        {currentCommand === 'pre_winner' && (
                            <span className="font-russo text-lg text-accent animate-pulse">
                                🏆 SUSPENSE...
                            </span>
                        )}
                    </div>

                    {/* Full Ranking List */}
                    <div className="max-h-48 overflow-y-auto overflow-x-hidden space-y-1 mb-3">
                        {flatRanked.map((pizza, index) => {
                            const position = index + 1;
                            const rank = totalPositions - index; // Rank from best (1) to worst (N)
                            const isCurrentlyShowing = isInRevealFlow && position === currentPosition;
                            const isRevealed = isInRevealFlow && position <= currentPosition;
                            const isWinner = rank === 1;

                            return (
                                <div
                                    key={pizza.id}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-russo transition-all ${isCurrentlyShowing
                                        ? 'bg-primary text-primary-foreground scale-[1.02]'
                                        : isRevealed
                                            ? 'bg-muted/50 text-foreground'
                                            : 'bg-muted/20 text-muted-foreground'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className={`font-bold ${isWinner ? 'text-yellow-400' : ''}`}>
                                            {isWinner ? '🏆' : `#${rank}`}
                                        </span>
                                        <span className="truncate max-w-[120px]">
                                            {pizza.brand} - {pizza.flavor}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`font-bold ${pizza.averageScore >= 8 ? 'text-accent' :
                                            pizza.averageScore >= 6 ? 'text-secondary' :
                                                pizza.averageScore >= 4 ? 'text-primary' :
                                                    'text-destructive'
                                            }`}>
                                            {pizza.averageScore.toFixed(1)}⭐
                                        </span>
                                        {isCurrentlyShowing && (
                                            <span className="text-xs bg-background text-foreground px-1.5 py-0.5 rounded">
                                                📍
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Visual Progress Bar */}
                    {totalPositions > 0 && (
                        <div className="w-full bg-muted rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-300"
                                style={{
                                    width: `${isInRevealFlow
                                        ? ((currentPosition / totalPositions) * 100)
                                        : 0}%`
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Reset Button */}
                <Button
                    onClick={resetGame}
                    variant="destructive"
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 font-russo"
                >
                    <RotateCcw className="w-5 h-5" />
                    RESET GARA
                </Button>
            </CardContent>
        </Card>
    );
};
