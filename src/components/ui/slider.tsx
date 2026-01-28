import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    // pan-y: permette scroll verticale ma lascia che lo slider gestisca i movimenti orizzontali (drag)
    // touch-none era troppo aggressivo e bloccava completamente il touch su iOS Safari
    className={cn("relative flex w-full select-none items-center", className)}
    style={{ touchAction: 'pan-y' }}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    {/* pan-y sul thumb per permettere il drag orizzontale su iOS Safari */}
    <SliderPrimitive.Thumb
      className="block h-10 w-10 rounded-full border-4 border-primary bg-background shadow-lg ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'pan-y' }}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
