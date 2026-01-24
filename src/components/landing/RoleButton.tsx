import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleButtonProps {
  icon: LucideIcon;
  label: string;
  emoji: string;
  onClick: () => void;
  variant: 'orange' | 'blue' | 'pink';
}

const variantStyles = {
  orange: 'box-glow-orange hover:scale-105 bg-gradient-to-br from-primary to-secondary text-primary-foreground',
  blue: 'box-glow-blue hover:scale-105 bg-gradient-to-br from-accent to-accent/70 text-accent-foreground',
  pink: 'box-glow-pink hover:scale-105 bg-gradient-to-br from-destructive to-destructive/70 text-destructive-foreground',
};

export const RoleButton: React.FC<RoleButtonProps> = ({ 
  icon: Icon, 
  label, 
  emoji, 
  onClick, 
  variant 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-full max-w-xs p-8 rounded-2xl transition-all duration-300 transform',
        'flex flex-col items-center gap-4',
        'border-4 border-foreground/20',
        variantStyles[variant]
      )}
    >
      <div className="text-5xl animate-float">{emoji}</div>
      <Icon className="w-16 h-16" />
      <span className="font-display text-3xl tracking-wide">{label}</span>
    </button>
  );
};
