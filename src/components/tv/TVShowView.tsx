import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTVCommands } from '@/hooks/useTVCommands';
import { WaitingMode } from './WaitingMode';
import { RevealMode } from './RevealMode';
import { WinnerCelebration } from './WinnerCelebration';
import { Maximize, Minimize } from 'lucide-react';

export const TVShowView: React.FC = () => {
  const { tvCommand } = useTVCommands();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentCommand = tvCommand?.command || 'waiting';

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const renderContent = () => {
    switch (currentCommand) {
      case 'reveal':
      case 'next':
        return <RevealMode />;
      case 'winner':
        return <WinnerCelebration />;
      case 'reset':
      case 'waiting':
      default:
        return <WaitingMode />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Button
        onClick={toggleFullscreen}
        className="fixed top-4 right-4 z-50 bg-muted/50 hover:bg-muted text-foreground"
        size="icon"
      >
        {isFullscreen ? (
          <Minimize className="w-6 h-6" />
        ) : (
          <Maximize className="w-6 h-6" />
        )}
      </Button>

      {renderContent()}
    </div>
  );
};
