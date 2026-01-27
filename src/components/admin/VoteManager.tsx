import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useVotes } from '@/hooks/useVotes';
import { usePizzas } from '@/hooks/usePizzas';
import { usePlayers } from '@/hooks/usePlayers';
import { Vote, calculateVoteScore } from '@/types/database';
import { Trash2, Vote as VoteIcon, ChevronDown, ChevronRight, User } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export const VoteManager: React.FC = () => {
  const { votes, deleteVote, isLoading } = useVotes();
  const { pizzas } = usePizzas();
  const { players } = usePlayers();
  const [deleteConfirm, setDeleteConfirm] = useState<Vote | null>(null);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

  // Group votes by player
  const votesByPlayer = useMemo(() => {
    const grouped = new Map<string, Vote[]>();

    votes.forEach(vote => {
      const existing = grouped.get(vote.player_id) || [];
      grouped.set(vote.player_id, [...existing, vote]);
    });

    return grouped;
  }, [votes]);

  const getPizzaName = (pizzaId: string) => {
    const pizza = pizzas.find(p => p.id === pizzaId);
    return pizza ? `#${pizza.number} ${pizza.brand} - ${pizza.flavor}` : 'Unknown';
  };

  const getPlayerName = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    return player?.username || 'Unknown';
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      await deleteVote.mutateAsync(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const toggleUserExpanded = (playerId: string) => {
    setExpandedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(playerId)) {
        newSet.delete(playerId);
      } else {
        newSet.add(playerId);
      }
      return newSet;
    });
  };

  return (
    <>
      <Card className="bg-card border-2 border-secondary/50">
        <CardHeader>
          <CardTitle className="font-display text-2xl text-secondary flex items-center gap-3">
            <VoteIcon className="w-8 h-8" />
            Gestione Voti ({votes.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-4xl animate-spin-slow">🗳️</div>
            </div>
          ) : votes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nessun voto registrato</p>
          ) : (
            Array.from(votesByPlayer.entries()).map(([playerId, playerVotes]) => {
              const isExpanded = expandedUsers.has(playerId);
              const playerName = getPlayerName(playerId);

              return (
                <Collapsible
                  key={playerId}
                  open={isExpanded}
                  onOpenChange={() => toggleUserExpanded(playerId)}
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-3 bg-primary/20 rounded-lg cursor-pointer hover:bg-primary/30 transition-colors">
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-primary" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-primary" />
                        )}
                        <User className="w-5 h-5 text-accent" />
                        <span className="font-russo text-lg text-accent">{playerName}</span>
                        <span className="text-sm text-muted-foreground">
                          ({playerVotes.length} {playerVotes.length === 1 ? 'voto' : 'voti'})
                        </span>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="ml-4 mt-2 space-y-2">
                      {playerVotes.map((vote) => (
                        <div
                          key={vote.id}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border-l-4 border-primary/40"
                        >
                          <div className="flex-1">
                            <div className="font-russo text-sm">
                              <span className="text-primary">{getPizzaName(vote.pizza_id)}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                              <span>👀 {vote.aspetto}</span>
                              <span>😋 {vote.gusto}</span>
                              <span>🥖 {vote.impasto}</span>
                              <span>🧀 {vote.farcitura}</span>
                              <span>🕶️ {vote.tony_factor}</span>
                              <span className="text-secondary font-bold ml-2">
                                = {calculateVoteScore(vote).toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <Button size="icon" variant="ghost" onClick={() => setDeleteConfirm(vote)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare questo voto?</AlertDialogTitle>
            <AlertDialogDescription>
              Stai per eliminare il voto di {deleteConfirm && getPlayerName(deleteConfirm.player_id)} per{' '}
              {deleteConfirm && getPizzaName(deleteConfirm.pizza_id)}.
              Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Annulla</Button>
            </AlertDialogCancel>
            <Button onClick={handleDelete} variant="destructive">
              Elimina
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
