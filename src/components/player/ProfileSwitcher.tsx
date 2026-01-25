import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRole } from '@/contexts/RoleContext';
import { useRecentProfiles, useCurrentSession } from '@/hooks/useLocalStorage';
import { usePlayers } from '@/hooks/usePlayers';
import { generateRandomNickname } from '@/types/database';
import { User, RefreshCw, History, Plus, Edit2 } from 'lucide-react';

export const ProfileSwitcher: React.FC = () => {
  const { playerId, playerName, setPlayerId, setPlayerName } = useRole();
  const { profiles, addProfile, removeProfile } = useRecentProfiles();
  const { setCurrentPlayerId, setCurrentPlayerName } = useCurrentSession();
  const { createPlayer } = usePlayers();
  
  const [isOpen, setIsOpen] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [mode, setMode] = useState<'view' | 'edit' | 'create'>('view');

  const handleRandomNickname = () => {
    setNewNickname(generateRandomNickname());
  };

  const handleCreateProfile = async () => {
    if (!newNickname.trim()) return;
    
    setIsCreating(true);
    try {
      const player = await createPlayer.mutateAsync(newNickname.trim());
      setPlayerId(player.id);
      setPlayerName(player.username);
      setCurrentPlayerId(player.id);
      setCurrentPlayerName(player.username);
      addProfile({ id: player.id, username: player.username });
      setNewNickname('');
      setMode('view');
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating profile:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSwitchProfile = (profile: { id: string; username: string }) => {
    setPlayerId(profile.id);
    setPlayerName(profile.username);
    setCurrentPlayerId(profile.id);
    setCurrentPlayerName(profile.username);
    addProfile({ id: profile.id, username: profile.username });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-2 text-primary hover:text-primary/80"
        >
          <User className="w-4 h-4" />
          <span className="font-game text-sm">{playerName || 'Profilo'}</span>
          <Edit2 className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-card border-2 border-primary/50">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-primary flex items-center gap-2">
            <User className="w-6 h-6" />
            Gestione Profilo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {mode === 'view' && (
            <>
              {/* Current Profile */}
              {playerName && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                  <p className="font-game text-sm text-muted-foreground">Profilo attuale:</p>
                  <p className="font-display text-xl text-primary">{playerName}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setMode('create')}
                  className="flex-1 flex items-center gap-2 bg-secondary text-secondary-foreground"
                >
                  <Plus className="w-4 h-4" />
                  Nuovo Profilo
                </Button>
                <Button
                  onClick={() => setMode('edit')}
                  variant="outline"
                  className="flex-1 flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Cambia Nickname
                </Button>
              </div>

              {/* Recent Profiles */}
              {profiles.length > 0 && (
                <div className="space-y-2">
                  <p className="font-game text-sm text-muted-foreground flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Profili recenti:
                  </p>
                  <div className="space-y-2">
                    {profiles.map(profile => (
                      <Button
                        key={profile.id}
                        variant="ghost"
                        className="w-full justify-start font-game"
                        onClick={() => handleSwitchProfile(profile)}
                        disabled={profile.id === playerId}
                      >
                        {profile.username}
                        {profile.id === playerId && (
                          <span className="ml-2 text-xs text-primary">(attuale)</span>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {(mode === 'create' || mode === 'edit') && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  placeholder="Inserisci nickname..."
                  className="flex-1 font-game"
                  maxLength={30}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRandomNickname}
                  title="Genera nickname casuale"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMode('view');
                    setNewNickname('');
                  }}
                  className="flex-1"
                >
                  Annulla
                </Button>
                <Button
                  onClick={handleCreateProfile}
                  disabled={!newNickname.trim() || isCreating}
                  className="flex-1 gradient-pizza text-primary-foreground"
                >
                  {isCreating ? 'Creazione...' : 'Conferma'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
