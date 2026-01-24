import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePizzas } from '@/hooks/usePizzas';
import { Pizza } from '@/types/database';
import { Trash2, Edit2, Check, X, Pizza as PizzaIcon } from 'lucide-react';
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

export const PizzaManager: React.FC = () => {
  const { pizzas, updatePizza, deletePizza, isLoading } = usePizzas();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ brand: '', flavor: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<Pizza | null>(null);

  const handleEdit = (pizza: Pizza) => {
    setEditingId(pizza.id);
    setEditForm({ brand: pizza.brand, flavor: pizza.flavor });
  };

  const handleSave = async (id: string) => {
    await updatePizza.mutateAsync({ id, ...editForm });
    setEditingId(null);
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      await deletePizza.mutateAsync(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  return (
    <>
      <Card className="bg-card border-2 border-primary/50">
        <CardHeader>
          <CardTitle className="font-display text-2xl text-primary flex items-center gap-3">
            <PizzaIcon className="w-8 h-8" />
            Gestione Pizze ({pizzas.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-96 overflow-y-auto">
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
                className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
              >
                <span className="font-display text-lg text-primary">#{pizza.number}</span>
                
                {editingId === pizza.id ? (
                  <>
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
                    <Button size="icon" variant="ghost" onClick={() => handleSave(pizza.id)}>
                      <Check className="w-4 h-4 text-green-500" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                      <X className="w-4 h-4 text-destructive" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <span className="font-game">{pizza.brand}</span>
                      <span className="text-muted-foreground mx-2">-</span>
                      <span className="font-game">{pizza.flavor}</span>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(pizza)}>
                      <Edit2 className="w-4 h-4 text-secondary" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setDeleteConfirm(pizza)}>
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
            <AlertDialogTitle>Eliminare questa pizza?</AlertDialogTitle>
            <AlertDialogDescription>
              Stai per eliminare Pizza #{deleteConfirm?.number} ({deleteConfirm?.brand} - {deleteConfirm?.flavor}).
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
