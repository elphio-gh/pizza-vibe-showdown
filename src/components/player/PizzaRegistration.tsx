import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePizzas } from '@/hooks/usePizzas';
import { useRole } from '@/contexts/RoleContext';
import { Plus, Package } from 'lucide-react';

interface PizzaRegistrationProps {
  onSuccess?: () => void;
}

export const PizzaRegistration: React.FC<PizzaRegistrationProps> = ({ onSuccess }) => {
  const [brand, setBrand] = useState('');
  const [flavor, setFlavor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { playerId } = useRole();
  // Disabilita realtime per evitare crash su iOS Safari
  const { createPizza } = usePizzas({ disableRealtime: true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand.trim() || !flavor.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createPizza.mutateAsync({
        brand: brand.trim(),
        flavor: flavor.trim(),
        registered_by: playerId || undefined,
      });
      setBrand('');
      setFlavor('');
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
            <label className="font-russo text-sm text-muted-foreground">Marca</label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
              <Input
                type="text"
                placeholder="Es. Buitoni, Italpizza, Cameo..."
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="pl-12 font-russo"
                maxLength={50}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-russo text-sm text-muted-foreground">Gusto</label>
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
