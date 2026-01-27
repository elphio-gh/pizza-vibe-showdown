import React from 'react';
import { usePlayers } from '@/hooks/usePlayers';
import { useRole } from '@/contexts/RoleContext';
import { usePlayerPresence } from '@/hooks/usePlayerPresence';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckCircle, Circle, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ParticipantsListProps {
  onConfirmPresence: () => void;
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({ onConfirmPresence }) => {
  const { players, isLoading } = usePlayers();
  const { playerId } = useRole();
  const { confirmPresence } = usePlayerPresence();

  const currentPlayer = players.find(p => p.id === playerId);
  const isConfirmed = currentPlayer?.is_confirmed || false;

  const handleConfirm = async () => {
    await confirmPresence();
    onConfirmPresence();
  };

  const onlinePlayers = players.filter(p => p.is_online);
  const confirmedPlayers = players.filter(p => p.is_confirmed);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin text-4xl">🍕</div>
      </div>
    );
  }

  return (
    <Card className="bg-card border-2 border-primary/50 box-glow-orange">
      <CardHeader>
        <CardTitle className="font-display text-2xl text-primary flex items-center gap-3">
          <Users className="w-8 h-8" />
          Partecipanti ({confirmedPlayers.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Confirm Presence Button */}
        {!isConfirmed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={handleConfirm}
              className="w-full py-6 font-display text-xl gradient-pizza text-primary-foreground box-glow-orange"
            >
              <CheckCircle className="w-6 h-6 mr-2" />
              CONFERMO LA MIA PRESENZA! 🙋
            </Button>
          </motion.div>
        )}

        {isConfirmed && (
          <div className="p-4 bg-accent/20 rounded-lg border border-accent/50 text-center">
            <p className="font-russo text-accent flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Presenza confermata! Sei pronto a votare 🎉
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-4 justify-center">
          <div className="flex items-center gap-2 text-accent">
            <Wifi className="w-4 h-4" />
            <span className="font-russo text-sm">{onlinePlayers.length} online</span>
          </div>
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle className="w-4 h-4" />
            <span className="font-russo text-sm">{confirmedPlayers.length} confermati</span>
          </div>
        </div>

        {/* Participants Grid */}
        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
          <AnimatePresence>
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  p-3 rounded-lg border flex items-center gap-2
                  ${player.id === playerId ? 'bg-primary/20 border-primary' : 'bg-muted/30 border-muted'}
                  ${player.is_confirmed ? 'border-accent' : ''}
                `}
              >
                {player.is_online ? (
                  <Wifi className="w-4 h-4 text-accent flex-shrink-0" />
                ) : (
                  <WifiOff className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                )}
                <span className={`font-russo text-sm truncate ${player.is_online ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {player.username}
                </span>
                {player.is_confirmed && (
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 ml-auto" />
                )}
                {player.id === playerId && (
                  <span className="text-xs text-primary ml-auto">(tu)</span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {players.length === 0 && (
          <p className="text-center text-muted-foreground font-russo py-4">
            Nessun partecipante ancora... Sii il primo! 🎉
          </p>
        )}
      </CardContent>
    </Card>
  );
};
