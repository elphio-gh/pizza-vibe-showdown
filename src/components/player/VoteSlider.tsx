// VoteSlider - Slider per votare le pizze
// Usa input type="range" nativo invece di Radix Slider per compatibilità iOS Safari
import React from 'react';

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
  return (
    <div className="space-y-3 p-4 bg-muted/30 rounded-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <span className="font-russo text-sm">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-display text-3xl ${getValueColor(value)} animate-count-up`}>
            {value}
          </span>
          <span className="text-2xl">{getValueEmoji(value)}</span>
        </div>
      </div>

      {/* Input range nativo - funziona correttamente su iOS Safari */}
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        disabled={disabled}
        className="native-slider w-full h-3 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          // Permette scroll verticale mentre si usa lo slider
          touchAction: 'pan-y',
        }}
      />

      <div className="flex justify-between text-xs text-muted-foreground font-russo">
        <span>1</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  );
};
