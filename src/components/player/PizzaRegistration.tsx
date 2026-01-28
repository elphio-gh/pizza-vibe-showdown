import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePizzas } from '@/hooks/usePizzas';
import { useRole } from '@/contexts/RoleContext';
import { Plus, Package, Smile } from 'lucide-react';
import { getPizzaEmoji, getAvailableEmojis } from '@/lib/pizzaUtils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PizzaRegistrationProps {
  onSuccess?: () => void;
}

export const PizzaRegistration: React.FC<PizzaRegistrationProps> = ({ onSuccess }) => {
  const [brand, setBrand] = useState('');
  const [flavor, setFlavor] = useState('');
  const [manualEmoji, setManualEmoji] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const { playerId } = useRole();
  const { pizzas, createPizza } = usePizzas({ disableRealtime: true });

  // Calculate used emojis
  const usedEmojis = useMemo(() => {
    return new Set(pizzas.map(p => p.emoji || getPizzaEmoji(p.flavor, p.number)));
  }, [pizzas]);

  const availableEmojis = useMemo(() => getAvailableEmojis(usedEmojis), [usedEmojis]);

  // Derived current emoji (manual or auto-generated)
  // Note: We use a temporary seed '0' for preview if we don't have a number yet
  const currentEmoji = manualEmoji || getPizzaEmoji(flavor, '0');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand.trim() || !flavor.trim() || isSubmitting) return;

    // Check if the current emoji is already taken (edge case if they picked one that got taken)
    if (usedEmojis.has(currentEmoji)) {
      // In a real app we might show an error, but here we'll just let the backend/logic handle it 
      // or user will see it in the list. ideally we should block.
      // For now let's rely on the auto-picker availability logic or user choice.
    }

    setIsSubmitting(true);
    try {
      await createPizza.mutateAsync({
        brand: brand.trim(),
        flavor: flavor.trim(),
        emoji: manualEmoji, // Pass the manual emoji if set
        registered_by: playerId || undefined,
      });
      setBrand('');
      setFlavor('');
      setManualEmoji(null);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating pizza:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-card border-2 border-secondary/50 box-glow-yellow">
      <CardHeader>
        <CardTitle className="font-sans font-bold text-2xl text-secondary flex items-center gap-3">
          <Plus className="w-8 h-8" />
          Registra una Pizza
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="font-sans font-bold text-sm text-muted-foreground">Marca</label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
              <Input
                type="text"
                placeholder="Es. Buitoni, Italpizza, Cameo..."
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="pl-12 font-sans font-bold"
                maxLength={50}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-sans font-bold text-sm text-muted-foreground">Gusto</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">
                {/* Emoji Preview / Picker Trigger */}
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
                  <PopoverContent className="w-64 p-2 bg-popover border-border">
                    <div className="space-y-2">
                      <h4 className="font-bold text-sm text-center">Scegli un'emoji unica</h4>
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
                              className="text-2xl hover:bg-accent rounded p-1 transition-colors"
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
                          className="w-full text-xs"
                          onClick={() => setManualEmoji(null)}
                        >
                          Resetta (Automatico)
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </span>
              <Input
                type="text"
                placeholder="Es. Margherita, 4 Formaggi..."
                value={flavor}
                onChange={(e) => setFlavor(e.target.value)}
                className="pl-12 font-sans font-bold"
                maxLength={50}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 ml-1 italic">
              * Clicca sull'emoji per sceglierne una personalizzata!
            </p>
          </div>

          <Button
            type="submit"
            disabled={!brand.trim() || !flavor.trim() || isSubmitting}
            className="w-full font-sans font-bold text-lg bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            {isSubmitting ? 'Registrando...' : 'REGISTRA PIZZA 🍕'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

