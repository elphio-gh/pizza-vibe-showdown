import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePizzas } from '@/hooks/usePizzas';
import { usePlayers } from '@/hooks/usePlayers';
import { Pizza } from '@/types/database';
import { Trash2, Edit2, Check, X, Pizza as PizzaIcon, Plus, UserCheck } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const PizzaManager: React.FC = () => {
  const { pizzas, createPizza, updatePizza, deletePizza, isLoading } = usePizzas();
  const { players } = usePlayers();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ brand: '', flavor: '', registered_by: '' as string | null });
  const [deleteConfirm, setDeleteConfirm] = useState<Pizza | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newPizza, setNewPizza] = useState({ brand: '', flavor: '', registered_by: '' as string | null });

  const getPlayerName = (playerId: string | null) => {
    if (!playerId) return 'Nessuno';
    const player = players.find(p => p.id === playerId);
    return player?.username || 'Unknown';
  };

  const handleEdit = (pizza: Pizza) => {
    setEditingId(pizza.id);
    setEditForm({ 
      brand: pizza.brand, 
      flavor: pizza.flavor, 
      registered_by: pizza.registered_by || '' 
    });
  };

  const handleSave = async (id: string) => {
    await updatePizza.mutateAsync({ 
      id, 
      brand: editForm.brand,
      flavor: editForm.flavor,
      registered_by: editForm.registered_by || null
    });
    setEditingId(null);
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      await deletePizza.mutateAsync(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const handleCreate = async () => {
    if (newPizza.brand.trim() && newPizza.flavor.trim()) {
      await createPizza.mutateAsync({
        brand: newPizza.brand.trim(),
        flavor: newPizza.flavor.trim(),
        registered_by: newPizza.registered_by || undefined
      });
      setNewPizza({ brand: '', flavor: '', registered_by: '' });
      setShowCreate(false);
    }
  };

  return (
    <>
      <Card className="bg-card border-2 border-primary/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-2xl text-primary flex items-center gap-3">
            <PizzaIcon className="w-8 h-8" />
            Gestione Pizze ({pizzas.length})
          </CardTitle>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setShowCreate(!showCreate)}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-1" />
            Nuova
          </Button>
        </CardHeader>
        <CardContent className="space-y-3 max-h-96 overflow-y-auto">
          {showCreate && (
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/30 space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  value={newPizza.brand}
                  onChange={(e) => setNewPizza({ ...newPizza, brand: e.target.value })}
                  placeholder="Marca"
                  className="flex-1"
                />
                <Input
                  value={newPizza.flavor}
                  onChange={(e) => setNewPizza({ ...newPizza, flavor: e.target.value })}
                  placeholder="Gusto"
                  className="flex-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <Select 
                  value={newPizza.registered_by || ''} 
                  onValueChange={(value) => setNewPizza({ ...newPizza, registered_by: value || null })}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Portata da..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nessuno</SelectItem>
                    {players.map(player => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="icon" variant="ghost" onClick={handleCreate}>
                  <Check className="w-4 h-4 text-green-500" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => { setShowCreate(false); setNewPizza({ brand: '', flavor: '', registered_by: '' }); }}>
                  <X className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-4xl animate-spin-slow">🍕</div>
            </div>
          ) : pizzas.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nessuna pizza registrata</p>
          ) : (
            pizzas.map((pizza) => (
              <div
                key={pizza.id}
                className="flex flex-col gap-2 p-3 bg-muted/30 rounded-lg"
              >
                {editingId === pizza.id ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-lg text-primary">#{pizza.number}</span>
                      <Input
                        value={editForm.brand}
                        onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                        className="flex-1"
                        placeholder="Marca"
                      />
                      <Input
                        value={editForm.flavor}
                        onChange={(e) => setEditForm({ ...editForm, flavor: e.target.value })}
                        className="flex-1"
                        placeholder="Gusto"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-muted-foreground" />
                      <Select 
                        value={editForm.registered_by || ''} 
                        onValueChange={(value) => setEditForm({ ...editForm, registered_by: value || null })}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Portata da..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Nessuno</SelectItem>
                          {players.map(player => (
                            <SelectItem key={player.id} value={player.id}>
                              {player.username}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button size="icon" variant="ghost" onClick={() => handleSave(pizza.id)}>
                        <Check className="w-4 h-4 text-green-500" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                        <X className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="font-display text-lg text-primary">#{pizza.number}</span>
                    <div className="flex-1">
                      <div className="font-game">{pizza.brand} - {pizza.flavor}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        Portata da: {getPlayerName(pizza.registered_by)}
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(pizza)}>
                      <Edit2 className="w-4 h-4 text-secondary" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setDeleteConfirm(pizza)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare questa pizza?</AlertDialogTitle>
            <AlertDialogDescription>
              Stai per eliminare Pizza #{deleteConfirm?.number} ({deleteConfirm?.brand} - {deleteConfirm?.flavor}).
              <br /><br />
              ⚠️ Verranno eliminati anche tutti i voti associati a questa pizza.
              <br /><br />
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
