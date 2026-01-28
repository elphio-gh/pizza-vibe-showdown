import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';


// Interface for RoleButton props.
// Now includes optional 'className' for custom styles and 'layout' for flex direction control.
interface RoleButtonProps {
  icon: LucideIcon;
  label: string;
  emoji: string;
  onClick: () => void;
  variant: 'orange' | 'blue' | 'pink';
  size?: 'default' | 'small';
  className?: string; // Allows overriding default styles (e.g. width, aspect-ratio)
  layout?: 'col' | 'row'; // Controls flex direction: 'col' (vertical) or 'row' (horizontal)
  shortcut?: string; // Optional keyboard shortcut hint to display
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
  size = 'default',
  layout = 'col',
  className,
  shortcut
}) => {
  const isSmall = size === 'small';

  return (
    <button
      onClick={onClick}
      className={cn(
        // touch-manipulation rimuove il delay di 300ms su iOS Safari
        'relative w-full transition-all duration-300 transform touch-manipulation',
        'flex items-center justify-center',
        layout === 'col' ? 'flex-col' : 'flex-row',
        'border-4 border-foreground/20 rounded-2xl',
        variantStyles[variant],
        isSmall ? 'p-3 gap-2' : 'p-8 gap-4',
        // Only apply max-w-xs if no specific max-width is provided in className (handled by tw-merge roughly, but explicit check or allow override via className is better)
        // We will remove max-w-xs from default and let parent handle it or add it back if className is empty? 
        // Better: include it by default but let className override it.
        'max-w-xs',
        className
      )}
    >
      <div className={cn("animate-float", isSmall ? "text-xl" : "text-5xl")}>{emoji}</div>
      <Icon className={cn(isSmall ? "w-8 h-8" : "w-16 h-16")} />

      <div className="flex flex-col items-center">
        <span className={cn("font-display tracking-wide uppercase", isSmall ? "text-lg" : "text-3xl")}>
          {label}
        </span>
        {shortcut && (
          <span className="font-russo text-sm opacity-80 mt-1 uppercase border border-current px-2 rounded-md">
            Premi {shortcut}
          </span>
        )}
      </div>
    </button>
  );
};
