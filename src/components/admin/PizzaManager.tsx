import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePizzas } from '@/hooks/usePizzas';
import { usePlayers } from '@/hooks/usePlayers';
import { Pizza } from '@/types/database';
import { Trash2, Edit2, Pizza as PizzaIcon, Plus, UserCheck, X } from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getPizzaEmoji, getAvailableEmojis } from "@/lib/pizzaUtils";
import { formatPizzaText } from '@/lib/stringUtils';

export const PizzaManager: React.FC = () => {
  const { pizzas, createPizza, updatePizza, deletePizza, isLoading } = usePizzas();
  const { players } = usePlayers();
  /* Emoji Logic for Admin */
  const [deleteConfirm, setDeleteConfirm] = useState<Pizza | null>(null);

  // Dialog states
  const [showDialog, setShowDialog] = useState(false);
  const [editingPizza, setEditingPizza] = useState<Pizza | null>(null);
  const [formData, setFormData] = useState({ brand: '', flavor: '', registered_by: '' as string | null, emoji: null as string | null });

  const usedEmojis = React.useMemo(() => {
    return new Set(
      pizzas
        .filter(p => !editingPizza || p.id !== editingPizza.id)
        .map(p => p.emoji || getPizzaEmoji(p.flavor, p.number))
    );
  }, [pizzas, editingPizza]);
  const availableEmojis = React.useMemo(() => getAvailableEmojis(usedEmojis), [usedEmojis]);
  const currentEmoji = formData.emoji || getPizzaEmoji(formData.flavor, '0');

  const getPlayerName = (playerId: string | null) => {
    if (!playerId) return 'Nessuno';
    const player = players.find(p => p.id === playerId);
    return player?.username || 'Unknown';
  };



  // ... (previous helper functions)

  const openCreateDialog = () => {
    setEditingPizza(null);
    setFormData({ brand: '', flavor: '', registered_by: '', emoji: null as string | null });
    setShowDialog(true);
  };

  const openEditDialog = (pizza: Pizza) => {
    setEditingPizza(pizza);
    setFormData({
      brand: pizza.brand,
      flavor: pizza.flavor,
      registered_by: pizza.registered_by || '',
      emoji: pizza.emoji
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!formData.brand.trim() || !formData.flavor.trim()) return;

    if (editingPizza) {
      await updatePizza.mutateAsync({
        id: editingPizza.id,
        brand: formData.brand.trim(),
        flavor: formData.flavor.trim(),
        registered_by: formData.registered_by || null,
        emoji: formData.emoji
      });
    } else {
      await createPizza.mutateAsync({
        brand: formData.brand.trim(),
        flavor: formData.flavor.trim(),
        registered_by: formData.registered_by || undefined,
        emoji: formData.emoji
      });
    }
    setShowDialog(false);
    setFormData({ brand: '', flavor: '', registered_by: '', emoji: null });
    setEditingPizza(null);
  };

  // ... (delete logic unchanged)

  const handleDelete = async () => {
    if (deleteConfirm) {
      await deletePizza.mutateAsync(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setFormData({ brand: '', flavor: '', registered_by: '', emoji: null });
    setEditingPizza(null);
  };

  return (
    <>
      <Card className="bg-card border-2 border-primary/50">
        {/* ... Card Content unchanged ... */}
        <CardContent className="space-y-3 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-4xl animate-spin-slow">🍕</div>
            </div>
          ) : pizzas.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nessuna pizza registrata</p>
          ) : (
            pizzas.map((pizza) => {
              // Calculate available emojis for this pizza (excluding other pizzas' emojis)
              const pizzaUsedEmojis = new Set(
                pizzas
                  .filter(p => p.id !== pizza.id)
                  .map(p => p.emoji || getPizzaEmoji(p.flavor, p.number))
              );
              const pizzaAvailableEmojis = getAvailableEmojis(pizzaUsedEmojis);

              return (
                <div
                  key={pizza.id}
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                >
                  <button
                    type="button"
                    onClick={async () => {
                      if (pizzaAvailableEmojis.length > 0) {
                        const randomIndex = Math.floor(Math.random() * pizzaAvailableEmojis.length);
                        const newEmoji = pizzaAvailableEmojis[randomIndex];
                        await updatePizza.mutateAsync({
                          id: pizza.id,
                          brand: pizza.brand,
                          flavor: pizza.flavor,
                          emoji: newEmoji,
                          registered_by: pizza.registered_by
                        });
                      }
                    }}
                    className="text-2xl hover:scale-125 active:scale-90 transition-transform cursor-pointer"
                    title="Tap per cambiare emoji"
                  >
                    {getPizzaEmoji(pizza.flavor, pizza.number, pizza.emoji)}
                  </button>
                  <div className="flex-1">
                    <div className="font-russo">{formatPizzaText(pizza.brand)} - {formatPizzaText(pizza.flavor)}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      Portata da: {getPlayerName(pizza.registered_by)}
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => openEditDialog(pizza)}>
                    <Edit2 className="w-4 h-4 text-secondary" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setDeleteConfirm(pizza)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-primary">
              {editingPizza ? `Modifica Pizza #${editingPizza.number}` : 'Nuova Pizza'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="font-russo text-sm">Marca</Label>
              <Input
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Es. Dr. Oetker, Buitoni..."
                className="font-russo"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-russo text-sm">Gusto & Emoji</Label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    if (availableEmojis.length > 0) {
                      const randomIndex = Math.floor(Math.random() * availableEmojis.length);
                      setFormData({ ...formData, emoji: availableEmojis[randomIndex] });
                    }
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xl hover:scale-125 active:scale-90 transition-transform cursor-pointer z-20"
                  title="Tap per cambiare emoji"
                >
                  {currentEmoji}
                </button>
                <Input
                  value={formData.flavor}
                  onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
                  placeholder="Es. Margherita, 4 Formaggi..."
                  className="font-russo pl-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-russo text-sm flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Portata da
              </Label>
              <Select
                value={formData.registered_by || 'none'}
                onValueChange={(value) => setFormData({ ...formData, registered_by: value === 'none' ? null : value })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Seleziona giocatore..." />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="none">Nessuno</SelectItem>
                  {players.map(player => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={handleCloseDialog}>
              <X className="w-4 h-4 mr-1" />
              Annulla
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.brand.trim() || !formData.flavor.trim()}
              className="bg-primary text-primary-foreground"
            >
              {editingPizza ? 'Salva Modifiche' : 'Crea Pizza'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare questa pizza?</AlertDialogTitle>
            <AlertDialogDescription>
              Stai per eliminare Pizza #{deleteConfirm?.number} ({formatPizzaText(deleteConfirm?.brand)} - {formatPizzaText(deleteConfirm?.flavor)}).
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
