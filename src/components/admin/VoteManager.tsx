import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useVotes } from '@/hooks/useVotes';
import { usePizzas } from '@/hooks/usePizzas';
import { usePlayers } from '@/hooks/usePlayers';
import { Vote, calculateVoteScore } from '@/types/database';
import { Trash2, Vote as VoteIcon } from 'lucide-react';
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

export const VoteManager: React.FC = () => {
  const { votes, deleteVote, isLoading } = useVotes();
  const { pizzas } = usePizzas();
  const { players } = usePlayers();
  const [deleteConfirm, setDeleteConfirm] = useState<Vote | null>(null);

  const getPizzaName = (pizzaId: string) => {
    const pizza = pizzas.find(p => p.id === pizzaId);
    return pizza ? `#${pizza.number} ${pizza.brand}` : 'Unknown';
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

  return (
    <>
      <Card className="bg-card border-2 border-secondary/50">
        <CardHeader>
          <CardTitle className="font-display text-2xl text-secondary flex items-center gap-3">
            <VoteIcon className="w-8 h-8" />
            Gestione Voti ({votes.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-4xl animate-spin-slow">🗳️</div>
            </div>
          ) : votes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nessun voto registrato</p>
          ) : (
            votes.map((vote) => (
              <div
                key={vote.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-russo text-sm">
                    <span className="text-primary">{getPizzaName(vote.pizza_id)}</span>
                    <span className="text-muted-foreground mx-2">da</span>
                    <span className="text-accent">{getPlayerName(vote.player_id)}</span>
                  </div>
                  <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                    <span>📸 {vote.aspetto}</span>
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
            ))
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
