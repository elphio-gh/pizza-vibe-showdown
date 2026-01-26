import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { RoleButton } from '@/components/landing/RoleButton';
import { PasswordModal } from '@/components/landing/PasswordModal';
import { useRoleAuth, useCurrentSession } from '@/hooks/useLocalStorage';
import { usePlayers } from '@/hooks/usePlayers';
import { User, Shield, Tv } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { setRole, setPlayerId, setPlayerName } = useRole();
  const { isRoleAuthenticated, setRoleAuthenticated } = useRoleAuth();
  const { currentPlayerId, currentPlayerName, setCurrentPlayerId, setCurrentPlayerName, clearSession } = useCurrentSession();
  const { players } = usePlayers();
  
  const [passwordModal, setPasswordModal] = useState<'admin' | 'tv' | 'player' | null>(null);
  const [showRejoinDialog, setShowRejoinDialog] = useState(false);
  const [showPlayerList, setShowPlayerList] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    if (currentPlayerId && currentPlayerName) {
      // User has a saved session
      setShowRejoinDialog(true);
    }
  }, []);

  const handlePlayerClick = () => {
    // If already authenticated as player
    if (isRoleAuthenticated('player')) {
      if (currentPlayerId && currentPlayerName) {
        setShowRejoinDialog(true);
      } else {
        setShowPlayerList(true);
      }
    } else {
      setPasswordModal('player');
    }
  };

  const handleAdminClick = () => {
    if (isRoleAuthenticated('admin')) {
      setRole('admin');
      navigate('/admin');
    } else {
      setPasswordModal('admin');
    }
  };

  const handleTVClick = () => {
    if (isRoleAuthenticated('tv')) {
      setRole('tv');
      navigate('/tv');
    } else {
      setPasswordModal('tv');
    }
  };

  const handlePasswordSuccess = () => {
    if (passwordModal === 'admin') {
      setRoleAuthenticated('admin');
      setRole('admin');
      navigate('/admin');
    } else if (passwordModal === 'tv') {
      setRoleAuthenticated('tv');
      setRole('tv');
      navigate('/tv');
    } else if (passwordModal === 'player') {
      setRoleAuthenticated('player');
      if (currentPlayerId && currentPlayerName) {
        setShowRejoinDialog(true);
      } else {
        setShowPlayerList(true);
      }
    }
    setPasswordModal(null);
  };

  const handleRejoinConfirm = () => {
    setPlayerId(currentPlayerId);
    setPlayerName(currentPlayerName);
    setRole('player');
    setShowRejoinDialog(false);
    navigate('/player');
  };

  const handleRejoinDecline = () => {
    clearSession();
    setShowRejoinDialog(false);
    setShowPlayerList(true);
  };

  const handleSelectPlayer = (player: { id: string; username: string }) => {
    setPlayerId(player.id);
    setPlayerName(player.username);
    setCurrentPlayerId(player.id);
    setCurrentPlayerName(player.username);
    setRole('player');
    setShowPlayerList(false);
    navigate('/player');
  };

  const handleCreateNewPlayer = () => {
    setShowPlayerList(false);
    setRole('player');
    navigate('/player');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="text-center mb-12 animate-bounce-in">
        <div className="text-[100px] md:text-[150px] mb-4 animate-float">🍕</div>
        <h1 className="font-display text-5xl md:text-7xl gradient-pizza bg-clip-text text-transparent mb-4">
          TONY BUITONY CUP
        </h1>
        <p className="font-game text-xl md:text-2xl text-muted-foreground">
          La sfida delle pizze surgelate! 🏆
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full max-w-4xl justify-center items-center">
        <RoleButton
          icon={User}
          label="GIOCATORE"
          emoji="🎮"
          onClick={handlePlayerClick}
          variant="orange"
        />
        <RoleButton
          icon={Shield}
          label="ADMIN"
          emoji="👑"
          onClick={handleAdminClick}
          variant="blue"
          size="small"
        />
        <RoleButton
          icon={Tv}
          label="TV SHOW"
          emoji="📺"
          onClick={handleTVClick}
          variant="pink"
          size="small"
        />
      </div>

      <div className="mt-12 text-center">
        <p className="font-game text-sm text-muted-foreground">
          Vota le migliori pizze surgelate con stile! 😎🎸
        </p>
      </div>

      <PasswordModal
        isOpen={!!passwordModal}
        onClose={() => setPasswordModal(null)}
        onSuccess={handlePasswordSuccess}
        title={
          passwordModal === 'admin' 
            ? 'Accesso Admin' 
            : passwordModal === 'tv' 
            ? 'Accesso TV Show' 
            : 'Accesso Giocatore'
        }
        role={passwordModal || 'player'}
      />

      {/* Rejoin Dialog */}
      <Dialog open={showRejoinDialog} onOpenChange={setShowRejoinDialog}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-center">
              🍕 Bentornato!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p className="font-game text-lg">
              Sei tu <span className="text-primary font-bold">{currentPlayerName}</span>?
            </p>
            <div className="flex gap-4">
              <Button
                onClick={handleRejoinConfirm}
                className="flex-1 font-game gradient-pizza text-primary-foreground"
              >
                Sì, sono io! ✓
              </Button>
              <Button
                onClick={handleRejoinDecline}
                variant="outline"
                className="flex-1 font-game"
              >
                No, cambia
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Player Selection Dialog */}
      <Dialog open={showPlayerList} onOpenChange={setShowPlayerList}>
        <DialogContent className="bg-card border-border max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-center">
              👥 Chi sei?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="font-game text-sm text-muted-foreground text-center">
              Seleziona il tuo profilo o creane uno nuovo
            </p>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {players.map((player) => (
                <Card
                  key={player.id}
                  onClick={() => handleSelectPlayer(player)}
                  className="cursor-pointer hover:border-primary transition-colors"
                >
                  <CardContent className="py-3 flex items-center gap-3">
                    <div className="text-2xl">
                      {player.is_online ? '🟢' : '⚪'}
                    </div>
                    <span className="font-game text-lg">{player.username}</span>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              onClick={handleCreateNewPlayer}
              className="w-full font-game gradient-pizza text-primary-foreground"
            >
              ➕ Crea Nuovo Profilo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
