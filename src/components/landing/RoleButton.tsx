import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleButtonProps {
  icon: LucideIcon;
  label: string;
  emoji: string;
  onClick: () => void;
  variant: 'orange' | 'blue' | 'pink';
  size?: 'default' | 'small';
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
  variant,
  size = 'default' 
}) => {
  const isSmall = size === 'small';

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-full max-w-xs rounded-2xl transition-all duration-300 transform',
        'flex flex-col items-center', 
        'border-4 border-foreground/20',
        variantStyles[variant],
        isSmall ? 'p-3 gap-2' : 'p-8 gap-4' 
      )}
    >
      <div className={cn("animate-float", isSmall ? "text-xl" : "text-5xl")}>{emoji}</div>
      <Icon className={cn(isSmall ? "w-8 h-8" : "w-16 h-16")} />
      <span className={cn("font-display tracking-wide", isSmall ? "text-lg" : "text-3xl")}>{label}</span>
    </button>
  );
};
