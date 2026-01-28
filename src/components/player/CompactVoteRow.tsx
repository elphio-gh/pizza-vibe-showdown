// CompactVoteRow - Componente compatto per votare le pizze
// Layout orizzontale per ridurre lo spazio verticale mantenendo touch-friendliness
import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface CompactVoteRowProps {
    label: string;
    emoji: string;
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
}

// Colore del valore in base al punteggio
const getValueColor = (value: number): string => {
    if (value <= 3) return 'text-destructive';
    if (value <= 5) return 'text-secondary';
    if (value <= 7) return 'text-primary';
    return 'text-green-500';
};

export const CompactVoteRow: React.FC<CompactVoteRowProps> = ({
    label,
    emoji,
    value,
    onChange,
    disabled = false,
}) => {
    // Decrementa il valore (minimo 1)
    const handleDecrement = () => {
        if (value > 1 && !disabled) {
            onChange(value - 1);
        }
    };

    // Incrementa il valore (massimo 10)
    const handleIncrement = () => {
        if (value < 10 && !disabled) {
            onChange(value + 1);
        }
    };

    return (
        <div className="flex items-center justify-between py-1.5 px-2 bg-muted/30 rounded-lg">
            {/* Label con emoji */}
            <div className="flex items-center gap-2 min-w-[100px]">
                <span className="text-xl">{emoji}</span>
                <span className="font-russo text-xs">{label}</span>
            </div>

            {/* Controlli +/- con valore */}
            <div className="flex items-center gap-2">
                {/* Tasto - */}
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleDecrement}
                    disabled={disabled || value <= 1}
                    className="h-11 w-11 rounded-full border-2 border-primary/50 hover:border-primary hover:bg-primary/10 active:scale-95 transition-all touch-manipulation"
                >
                    <Minus className="h-4 w-4" />
                </Button>

                {/* Valore numerico centrale */}
                <div className="min-w-[2rem] text-center">
                    <span className={`font-display text-2xl ${getValueColor(value)}`}>
                        {value}
                    </span>
                </div>

                {/* Tasto + */}
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleIncrement}
                    disabled={disabled || value >= 10}
                    className="h-11 w-11 rounded-full border-2 border-primary/50 hover:border-primary hover:bg-primary/10 active:scale-95 transition-all touch-manipulation"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};
