import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTVCommands } from '@/hooks/useTVCommands';
import { useRole } from '@/contexts/RoleContext';
import { useCurrentSession } from '@/hooks/useLocalStorage';
import { WaitingMode } from './WaitingMode';
import { RevealMode } from './RevealMode';
import { WinnerCelebration } from './WinnerCelebration';
import { AnimatedBackground } from './AnimatedBackground';
import { Maximize, Minimize } from 'lucide-react';

export const TVShowView: React.FC = () => {
  const { tvCommand } = useTVCommands();
  const { setRole, setPlayerId, setPlayerName } = useRole();
  const { clearSession } = useCurrentSession();
  const navigate = useNavigate();
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

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // ESC key listener to go back to landing page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Exit fullscreen if active
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        // Clear session and navigate to landing
        setRole(null);
        setPlayerId(null);
        setPlayerName(null);
        clearSession();
        navigate('/');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate, setRole, setPlayerId, setPlayerName, clearSession]);

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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background for burn-in protection */}
      <AnimatedBackground />
      
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

      {/* ESC hint */}
      <div className="fixed bottom-4 right-4 z-50 opacity-30 hover:opacity-80 transition-opacity">
        <span className="font-game text-xs text-muted-foreground">
          Premi ESC per uscire
        </span>
      </div>

      <div className="relative z-10">
        {renderContent()}
      </div>
    </div>
  );
};
