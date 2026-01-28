// Questo componente è la "Regia" della TV.
// Ascolta i comandi dell'Admin e decide cosa mostrare sullo schermo gigante.
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTVCommands } from '@/hooks/useTVCommands';
import { useRole } from '@/contexts/RoleContext';
import { useCurrentSession } from '@/hooks/useLocalStorage';
import { WaitingMode } from './WaitingMode';
import { RevealMode } from './RevealMode';
import { WinnerCelebration } from './WinnerCelebration';
import { StopTelevotoMode } from './StopTelevotoMode';
import { PauseMode } from './PauseMode';
import { PreWinnerMode } from './PreWinnerMode';
import { AnimatedBackground } from './AnimatedBackground';
import { QRCodeDisplay } from './QRCodeDisplay';
import { Maximize, Minimize } from 'lucide-react';

export const TVShowView: React.FC = () => {
  // Riceviamo i comandi in tempo reale dal database.
  const { tvCommand } = useTVCommands();
  const { setRole, setPlayerId, setPlayerName } = useRole();
  const { clearSession } = useCurrentSession();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Il comando attuale (default è 'waiting' se non c'è nulla).
  const currentCommand = tvCommand?.command || 'waiting';

  // Funzione per mettere l'app a tutto schermo (ottimo per la TV).
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Gestiamo i cambiamenti dello stato "Fullscreen" del browser.
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Scorciatoia da tastiera: premendo ESC torniamo alla schermata iniziale.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        setRole(null);
        setPlayerId(null);
        setPlayerName(null);
        clearSession();
        navigate('/');
      }
      // 'F' key shortcut to toggle fullscreen mode quickly
      if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate, setRole, setPlayerId, setPlayerName, clearSession]);

  // Questa funzione decide quale "Sottocomponente" mostrare in base al comando.
  const renderContent = () => {
    switch (currentCommand) {
      case 'stop_televote':
        return <StopTelevotoMode />;
      case 'pause':
        return <PauseMode />;
      case 'pre_winner':
        return <PreWinnerMode />;
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

  // Cambiamo anche lo sfondo in base alla situazione (es: coriandoli se c'è un vincitore).
  const getBackgroundVariant = (): 'default' | 'winner' | 'pre_winner' | 'stop' | 'pause' => {
    switch (currentCommand) {
      case 'winner':
        return 'winner';
      case 'pre_winner':
        return 'pre_winner';
      case 'stop_televote':
        return 'stop';
      case 'pause':
        return 'pause';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Sfondo animato (protegge anche gli schermi OLED dal burn-in!) */}
      <AnimatedBackground variant={getBackgroundVariant()} />

      {/* Pulsante per il tutto schermo */}
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

      {(currentCommand === 'waiting' || currentCommand === 'reset') && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2 animate-float">
          <QRCodeDisplay />
          <span className="font-russo text-xs text-muted-foreground whitespace-nowrap bg-background/80 px-2 py-1 rounded-md border border-border/50">
            ESC per uscire • F per Schermo Intero
          </span>
        </div>
      )}

      <div className="relative z-10">
        {renderContent()}
      </div>
    </div>
  );
};
