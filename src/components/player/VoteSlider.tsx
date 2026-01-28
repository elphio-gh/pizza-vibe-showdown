import React from 'react';
import { Slider } from '@/components/ui/slider';

interface VoteSliderProps {
  label: string;
  emoji: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const getValueColor = (value: number): string => {
  if (value <= 3) return 'text-destructive';
  if (value <= 5) return 'text-secondary';
  if (value <= 7) return 'text-primary';
  return 'text-green-500';
};

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

      <Slider
        value={[value]}
        onValueChange={([newValue]) => onChange(newValue)}
        min={1}
        max={10}
        step={1}
        disabled={disabled}
        className="py-4"
      />

      <div className="flex justify-between text-xs text-muted-foreground font-russo">
        <span>1</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  );
};
