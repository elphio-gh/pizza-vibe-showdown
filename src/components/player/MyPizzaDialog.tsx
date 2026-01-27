import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePizzas } from '@/hooks/usePizzas';
import { useRole } from '@/contexts/RoleContext';
import { Pizza as PizzaIcon, Package, Edit2, Trash2 } from 'lucide-react';
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

export const MyPizzaDialog: React.FC = () => {
  const { playerId } = useRole();
  const { pizzas, createPizza, updatePizza, deletePizza } = usePizzas();
  
  const [open, setOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [brand, setBrand] = useState('');
  const [flavor, setFlavor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find player's pizza
  const myPizza = pizzas.find(p => p.registered_by === playerId);

  // Sync form with existing pizza
  useEffect(() => {
    if (myPizza) {
      setBrand(myPizza.brand);
      setFlavor(myPizza.flavor);
    } else {
      setBrand('');
      setFlavor('');
    }
  }, [myPizza, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand.trim() || !flavor.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (myPizza) {
        // Update existing
        await updatePizza.mutateAsync({
          id: myPizza.id,
          brand: brand.trim(),
          flavor: flavor.trim(),
          registered_by: playerId
        });
      } else {
        // Create new
        await createPizza.mutateAsync({
          brand: brand.trim(),
          flavor: flavor.trim(),
          registered_by: playerId || undefined,
        });
      }
      setOpen(false);
    } catch (error) {
      console.error('Error saving pizza:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!myPizza) return;
    try {
      await deletePizza.mutateAsync(myPizza.id);
      setShowDeleteConfirm(false);
      setOpen(false);
    } catch (error) {
      console.error('Error deleting pizza:', error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={`font-russo ${myPizza ? 'border-accent text-accent' : 'border-secondary text-secondary'}`}
          >
            <PizzaIcon className="w-4 h-4 mr-1" />
            {myPizza ? 'La mia Pizza' : '+ Registra Pizza'}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-secondary flex items-center gap-2">
              <PizzaIcon className="w-6 h-6" />
              {myPizza ? 'Modifica la tua Pizza' : 'Registra la tua Pizza'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="font-russo text-sm text-muted-foreground">Marca</Label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                <Input
                  type="text"
                  placeholder="Es. Dr. Oetker, Buitoni..."
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="pl-12 font-russo"
                  maxLength={50}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-russo text-sm text-muted-foreground">Gusto</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">🍕</span>
                <Input
                  type="text"
                  placeholder="Es. Margherita, 4 Formaggi..."
                  value={flavor}
                  onChange={(e) => setFlavor(e.target.value)}
                  className="pl-12 font-russo"
                  maxLength={50}
                />
              </div>
            </div>

            {myPizza && (
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="font-russo text-xs text-muted-foreground">
                  Pizza #{myPizza.number} registrata
                </p>
              </div>
            )}

            <DialogFooter className="flex-col sm:flex-row gap-2">
              {myPizza && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="sm:mr-auto"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Elimina
                </Button>
              )}
              <Button
                type="submit"
                disabled={!brand.trim() || !flavor.trim() || isSubmitting}
                className="font-display bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                {isSubmitting ? 'Salvando...' : myPizza ? (
                  <>
                    <Edit2 className="w-4 h-4 mr-1" />
                    Salva Modifiche
                  </>
                ) : (
                  'REGISTRA PIZZA 🍕'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare la tua pizza?</AlertDialogTitle>
            <AlertDialogDescription>
              Stai per eliminare la tua Pizza #{myPizza?.number} ({myPizza?.brand} - {myPizza?.flavor}).
              <br /><br />
              ⚠️ Verranno eliminati anche tutti i voti ricevuti.
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
