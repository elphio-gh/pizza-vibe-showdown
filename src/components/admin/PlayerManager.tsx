import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePlayers } from '@/hooks/usePlayers';
import { Player } from '@/types/database';
import { Trash2, Edit2, Check, X, Users, Plus, Circle } from 'lucide-react';
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

export const PlayerManager: React.FC = () => {
  const { players, createPlayer, updatePlayer, deletePlayer, isLoading } = usePlayers();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<Player | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleEdit = (player: Player) => {
    setEditingId(player.id);
    setEditForm(player.username);
  };

  const handleSave = async (id: string) => {
    if (editForm.trim()) {
      await updatePlayer.mutateAsync({ id, username: editForm.trim() });
      setEditingId(null);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      await deletePlayer.mutateAsync(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const handleCreate = async () => {
    if (newPlayerName.trim()) {
      await createPlayer.mutateAsync(newPlayerName.trim());
      setNewPlayerName('');
      setShowCreate(false);
    }
  };

  return (
    <>
      <Card className="bg-card border-2 border-accent/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-2xl text-accent flex items-center gap-3">
            <Users className="w-8 h-8" />
            Gestione Giocatori ({players.length})
          </CardTitle>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setShowCreate(!showCreate)}
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          >
            <Plus className="w-4 h-4 mr-1" />
            Nuovo
          </Button>
        </CardHeader>
        <CardContent className="space-y-3 max-h-96 overflow-y-auto">
          {showCreate && (
            <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg border border-accent/30">
              <Input
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Nome giocatore"
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
              <Button size="icon" variant="ghost" onClick={handleCreate}>
                <Check className="w-4 h-4 text-green-500" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => { setShowCreate(false); setNewPlayerName(''); }}>
                <X className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          )}
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-4xl animate-spin-slow">👥</div>
            </div>
          ) : players.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nessun giocatore registrato</p>
          ) : (
            players.map((player) => (
              <div
                key={player.id}
                className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
              >
                <Circle 
                  className={`w-3 h-3 ${player.is_online ? 'text-green-500 fill-green-500' : 'text-muted-foreground'}`} 
                />
                
                {editingId === player.id ? (
                  <>
                    <Input
                      value={editForm}
                      onChange={(e) => setEditForm(e.target.value)}
                      className="flex-1"
                      placeholder="Nome"
                      onKeyDown={(e) => e.key === 'Enter' && handleSave(player.id)}
                    />
                    <Button size="icon" variant="ghost" onClick={() => handleSave(player.id)}>
                      <Check className="w-4 h-4 text-green-500" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                      <X className="w-4 h-4 text-destructive" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <span className="font-russo">{player.username}</span>
                      {player.is_confirmed && (
                        <span className="ml-2 text-xs text-green-500">✓ Confermato</span>
                      )}
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(player)}>
                      <Edit2 className="w-4 h-4 text-secondary" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setDeleteConfirm(player)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare questo giocatore?</AlertDialogTitle>
            <AlertDialogDescription>
              Stai per eliminare <strong>{deleteConfirm?.username}</strong>.
              <br /><br />
              ⚠️ Verranno eliminati anche:
              <ul className="list-disc ml-6 mt-2">
                <li>Tutte le pizze registrate da questo giocatore</li>
                <li>Tutti i voti espressi da questo giocatore</li>
              </ul>
              <br />
              Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
