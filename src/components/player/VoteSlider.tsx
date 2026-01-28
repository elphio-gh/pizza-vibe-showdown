// VoteSlider - Componente per votare le pizze con tasti + e -
// Sostituisce lo slider per massima compatibilità iOS/Android
import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface VoteSliderProps {
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

// Emoji in base al punteggio
const getValueEmoji = (value: number): string => {
  if (value <= 2) return '😢';
  if (value <= 4) return '😕';
  if (value <= 6) return '😐';
  if (value <= 8) return '😊';
  return '🤩';
};

export const VoteSlider: React.FC<VoteSliderProps> = ({
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
    <div className="p-4 bg-muted/30 rounded-xl">
      {/* Header con label ed emoji */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <span className="font-russo text-sm">{label}</span>
        </div>
        <span className="text-2xl">{getValueEmoji(value)}</span>
      </div>

      {/* Controlli + e - con valore al centro */}
      <div className="flex items-center justify-center gap-3">
        {/* Tasto - */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={disabled || value <= 1}
          className="h-14 w-14 rounded-full border-2 border-primary/50 hover:border-primary hover:bg-primary/10 active:scale-95 transition-all touch-manipulation"
        >
          <Minus className="h-6 w-6" />
        </Button>

        {/* Valore numerico centrale */}
        <div className="min-w-[5rem] text-center">
          <span className={`font-display text-5xl ${getValueColor(value)}`}>
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
          className="h-14 w-14 rounded-full border-2 border-primary/50 hover:border-primary hover:bg-primary/10 active:scale-95 transition-all touch-manipulation"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Indicatore scala */}
      <div className="flex justify-between text-xs text-muted-foreground font-russo mt-2 px-2">
        <span>Min 1</span>
        <span>Max 10</span>
      </div>
    </div>
  );
};
