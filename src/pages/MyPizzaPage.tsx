import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { usePizzas } from '@/hooks/usePizzas';
import { useCurrentSession } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Package, Trash2, AlertTriangle } from 'lucide-react';

import { getPizzaEmoji, getAvailableEmojis } from '@/lib/pizzaUtils';

const MyPizzaPage: React.FC = () => {
    const navigate = useNavigate();
    const { playerId, role, setRole, setPlayerId, setPlayerName } = useRole();
    const { currentPlayerId, currentPlayerName } = useCurrentSession();

    // Disabilita realtime per evitare crash su iOS Safari
    const { pizzas, createPizza, updatePizza, deletePizza } = usePizzas({ disableRealtime: true });

    const [brand, setBrand] = useState('');
    const [flavor, setFlavor] = useState('');
    const [manualEmoji, setManualEmoji] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Find player's pizza
    const myPizza = pizzas.find(p => p.registered_by === playerId);

    // Calculate used emojis (excluding current pizza's emoji if editing, so it can be re-selected)
    const usedEmojis = useMemo(() => {
        return new Set(
            pizzas
                .filter(p => p.id !== myPizza?.id) // Exclude current pizza when editing
                .map(p => p.emoji || getPizzaEmoji(p.flavor, p.number))
        );
    }, [pizzas, myPizza?.id]);

    const availableEmojis = useMemo(() => getAvailableEmojis(usedEmojis), [usedEmojis]);

    // Derived current emoji (manual > DB saved > auto-generated if available > random from available)
    const currentEmoji = useMemo(() => {
        // If user manually selected one, use it
        if (manualEmoji) return manualEmoji;
        // If editing and pizza has a saved emoji, use it
        if (myPizza?.emoji) return myPizza.emoji;
        // Try auto-generated based on flavor
        const autoEmoji = getPizzaEmoji(flavor, myPizza?.number);
        // If auto-generated is available, use it
        if (!usedEmojis.has(autoEmoji)) return autoEmoji;
        // Otherwise pick first available
        return availableEmojis[0] || '🍕';
    }, [manualEmoji, myPizza?.emoji, myPizza?.number, flavor, usedEmojis, availableEmojis]);

    // Sync form with existing pizza
    useEffect(() => {
        if (myPizza) {
            setBrand(myPizza.brand);
            setFlavor(myPizza.flavor);
            setManualEmoji(myPizza.emoji || null);
        }
    }, [myPizza]);

    // Restore session if needed
    useEffect(() => {
        if (!role && currentPlayerId && currentPlayerName) {
            setPlayerId(currentPlayerId);
            setPlayerName(currentPlayerName);
            setRole('player');
        }
    }, [role, currentPlayerId, currentPlayerName, setPlayerId, setPlayerName, setRole]);

    // Redirect if not a player (only after check)
    useEffect(() => {
        if (role !== 'player' && role !== null) {
            navigate('/');
        }
    }, [role, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!brand.trim() || !flavor.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            if (myPizza) {
                await updatePizza.mutateAsync({
                    id: myPizza.id,
                    brand: brand.trim(),
                    flavor: flavor.trim(),
                    emoji: currentEmoji,
                    registered_by: playerId
                });
            } else {
                await createPizza.mutateAsync({
                    brand: brand.trim(),
                    flavor: flavor.trim(),
                    emoji: currentEmoji,
                    registered_by: playerId || undefined,
                });
            }
            navigate('/player');
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
            navigate('/player');
        } catch (error) {
            console.error('Error deleting pizza:', error);
        }
    };

    if (role === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin text-4xl">🍕</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header */}
            <div className="p-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/player')}
                    className="flex items-center gap-2 text-muted-foreground"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Torna indietro
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col px-6 pt-2 pb-8">
                <div className="space-y-6 max-w-md mx-auto w-full">
                    {/* Title */}
                    <div className="text-center space-y-2">
                        {/* Tap to randomize emoji - Mobile friendly! */}
                        <button
                            type="button"
                            onClick={() => {
                                if (availableEmojis.length > 0) {
                                    const randomIndex = Math.floor(Math.random() * availableEmojis.length);
                                    setManualEmoji(availableEmojis[randomIndex]);
                                }
                            }}
                            className="text-6xl animate-float hover:scale-125 active:scale-90 transition-transform cursor-pointer focus:outline-none mx-auto block"
                            title="Tap per cambiare emoji"
                        >
                            {currentEmoji}
                        </button>
                        <p className="text-xs text-muted-foreground italic">
                            👆 Tap per cambiare emoji!
                        </p>
                        <h1 className="font-display text-3xl text-secondary">
                            {myPizza ? 'La tua Pizza' : 'Registra Pizza'}
                        </h1>
                        {myPizza && (
                            <p className="font-sans font-bold text-muted-foreground">
                                Pizza #{myPizza.number}
                            </p>
                        )}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label className="font-sans font-bold text-sm text-muted-foreground">Marca</Label>
                            <div className="relative">
                                <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                                <Input
                                    type="text"
                                    placeholder="Es. Buitoni, Italpizza, Cameo..."
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    className="pl-12 py-6 text-lg font-sans font-bold"
                                    maxLength={50}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="font-sans font-bold text-sm text-muted-foreground">Gusto</Label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🍕</span>
                                <Input
                                    type="text"
                                    placeholder="Es. Margherita, 4 Formaggi..."
                                    value={flavor}
                                    onChange={(e) => setFlavor(e.target.value)}
                                    className="pl-12 py-6 text-lg font-sans font-bold"
                                    maxLength={50}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={!brand.trim() || !flavor.trim() || isSubmitting}
                            className="w-full py-6 font-sans font-bold text-xl bg-secondary text-secondary-foreground hover:bg-secondary/90"
                        >
                            {isSubmitting ? 'Salvando...' : myPizza ? 'SALVA MODIFICHE ✓' : 'REGISTRA PIZZA 🍕'}
                        </Button>
                    </form>

                    {/* Delete Section */}
                    {myPizza && !showDeleteConfirm && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full py-4 font-sans font-bold text-destructive border-destructive/50 hover:bg-destructive/10"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Elimina la mia pizza
                        </Button>
                    )}

                    {/* Delete Confirmation - inline, not popup */}
                    {showDeleteConfirm && (
                        <div className="p-4 bg-destructive/10 border-2 border-destructive/50 rounded-lg space-y-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-sans font-bold text-foreground">
                                        Eliminare la pizza #{myPizza?.number}?
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {myPizza?.brand} - {myPizza?.flavor}
                                        <br />
                                        ⚠️ Verranno eliminati anche tutti i voti ricevuti.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 font-sans font-bold"
                                >
                                    Annulla
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    className="flex-1 font-sans font-bold"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Elimina
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyPizzaPage;
