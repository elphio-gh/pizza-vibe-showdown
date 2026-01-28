import React, { useState, useEffect, useMemo } from 'react';
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
import { getPizzaEmoji, getAvailableEmojis } from '@/lib/pizzaUtils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

export const MyPizzaDialog: React.FC = () => {
  const { playerId } = useRole();
  // Disabilita realtime per evitare crash su iOS Safari
  const { pizzas, createPizza, updatePizza, deletePizza } = usePizzas({ disableRealtime: true });

  const [open, setOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [brand, setBrand] = useState('');
  const [flavor, setFlavor] = useState('');
  const [manualEmoji, setManualEmoji] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  // Find player's pizza
  const myPizza = pizzas.find(p => p.registered_by === playerId);

  // Calculate available emojis
  const usedEmojis = useMemo(() => {
    return new Set(
      pizzas
        .filter(p => !myPizza || p.id !== myPizza.id)
        .map(p => p.emoji || getPizzaEmoji(p.flavor, p.number))
    );
  }, [pizzas, myPizza]);

  const availableEmojis = useMemo(() => getAvailableEmojis(usedEmojis), [usedEmojis]);

  // Sync form with existing pizza
  useEffect(() => {
    if (myPizza) {
      setBrand(myPizza.brand);
      setFlavor(myPizza.flavor);
      setManualEmoji(myPizza.emoji || null);
    } else {
      setBrand('');
      setFlavor('');
      setManualEmoji(null);
    }
  }, [myPizza, open]);

  const currentEmoji = manualEmoji || (myPizza?.emoji) || getPizzaEmoji(flavor, myPizza?.number || '0');

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
          registered_by: playerId,
          emoji: manualEmoji
        });
      } else {
        // Create new
        await createPizza.mutateAsync({
          brand: brand.trim(),
          flavor: flavor.trim(),
          registered_by: playerId || undefined,
          emoji: manualEmoji
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
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl z-20">
                  <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="hover:scale-110 transition-transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full"
                        title="Clicca per cambiare emoji"
                      >
                        {currentEmoji}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2 bg-popover z-50">
                      <h4 className="font-bold text-sm text-center mb-2">Scegli Emoji</h4>
                      <ScrollArea className="h-48">
                        <div className="grid grid-cols-5 gap-2 p-1">
                          {availableEmojis.map(emoji => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                setManualEmoji(emoji);
                                setIsEmojiOpen(false);
                              }}
                              className="text-2xl hover:bg-accent rounded p-1"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </ScrollArea>
                      {manualEmoji && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-xs mt-2"
                          onClick={() => setManualEmoji(null)}
                        >
                          Reset
                        </Button>
                      )}
                    </PopoverContent>
                  </Popover>
                </span>
                <Input
                  type="text"
                  placeholder="Es. Margherita, 4 Formaggi..."
                  value={flavor}
                  onChange={(e) => setFlavor(e.target.value)}
                  className="pl-12 font-russo"
                  maxLength={50}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 ml-1">
                * Clicca sull'emoji per cambiarla se quella automatica non ti piace.
              </p>
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
