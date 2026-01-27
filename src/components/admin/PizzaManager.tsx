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

export const PizzaManager: React.FC = () => {
  const { pizzas, createPizza, updatePizza, deletePizza, isLoading } = usePizzas();
  const { players } = usePlayers();
  const [deleteConfirm, setDeleteConfirm] = useState<Pizza | null>(null);
  
  // Dialog states
  const [showDialog, setShowDialog] = useState(false);
  const [editingPizza, setEditingPizza] = useState<Pizza | null>(null);
  const [formData, setFormData] = useState({ brand: '', flavor: '', registered_by: '' as string | null });

  const getPlayerName = (playerId: string | null) => {
    if (!playerId) return 'Nessuno';
    const player = players.find(p => p.id === playerId);
    return player?.username || 'Unknown';
  };

  const openCreateDialog = () => {
    setEditingPizza(null);
    setFormData({ brand: '', flavor: '', registered_by: '' });
    setShowDialog(true);
  };

  const openEditDialog = (pizza: Pizza) => {
    setEditingPizza(pizza);
    setFormData({ 
      brand: pizza.brand, 
      flavor: pizza.flavor, 
      registered_by: pizza.registered_by || '' 
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
        registered_by: formData.registered_by || null
      });
    } else {
      await createPizza.mutateAsync({
        brand: formData.brand.trim(),
        flavor: formData.flavor.trim(),
        registered_by: formData.registered_by || undefined
      });
    }
    setShowDialog(false);
    setFormData({ brand: '', flavor: '', registered_by: '' });
    setEditingPizza(null);
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      await deletePizza.mutateAsync(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setFormData({ brand: '', flavor: '', registered_by: '' });
    setEditingPizza(null);
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
            onClick={openCreateDialog}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-1" />
            Nuova
          </Button>
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
                <div className="flex-1">
                  <div className="font-game">{pizza.brand} - {pizza.flavor}</div>
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
            ))
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
              <Label className="font-game text-sm">Marca</Label>
              <Input
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Es. Dr. Oetker, Buitoni..."
                className="font-game"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="font-game text-sm">Gusto</Label>
              <Input
                value={formData.flavor}
                onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
                placeholder="Es. Margherita, 4 Formaggi..."
                className="font-game"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="font-game text-sm flex items-center gap-2">
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
