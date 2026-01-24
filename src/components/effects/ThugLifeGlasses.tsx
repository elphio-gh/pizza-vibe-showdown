import React from 'react';

export const ThugLifeGlasses: React.FC = () => {
  return (
    <div className="animate-glasses-drop">
      <svg
        viewBox="0 0 200 60"
        className="w-48 h-auto mx-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left lens */}
        <rect x="10" y="15" width="70" height="35" rx="3" fill="black" stroke="#333" strokeWidth="3" />
        
        {/* Right lens */}
        <rect x="120" y="15" width="70" height="35" rx="3" fill="black" stroke="#333" strokeWidth="3" />
        
        {/* Bridge */}
        <path d="M80 32 L120 32" stroke="#333" strokeWidth="4" strokeLinecap="round" />
        
        {/* Left arm */}
        <path d="M10 25 L0 20" stroke="#333" strokeWidth="4" strokeLinecap="round" />
        
        {/* Right arm */}
        <path d="M190 25 L200 20" stroke="#333" strokeWidth="4" strokeLinecap="round" />
        
        {/* Reflections */}
        <rect x="20" y="20" width="15" height="5" rx="2" fill="white" opacity="0.3" />
        <rect x="130" y="20" width="15" height="5" rx="2" fill="white" opacity="0.3" />
      </svg>
      <div className="text-center mt-2 font-display text-xl text-foreground">
        DEAL WITH IT 😎
      </div>
    </div>
  );
};
