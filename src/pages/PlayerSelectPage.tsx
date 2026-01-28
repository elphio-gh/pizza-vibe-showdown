import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { usePlayers } from '@/hooks/usePlayers';
import { useCurrentSession, useRecentProfiles } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, User, Plus } from 'lucide-react';
import { formatTitleCase } from '@/lib/stringUtils';

const PlayerSelectPage: React.FC = () => {
    const navigate = useNavigate();
    const { setPlayerId, setPlayerName, setRole } = useRole();
    const { setCurrentPlayerId, setCurrentPlayerName } = useCurrentSession();
    const { addProfile } = useRecentProfiles();
    // Disabilita realtime per evitare crash su iOS Safari, ma attiva polling ogni 60s
    const { players, createPlayer } = usePlayers({ disableRealtime: true, pollingInterval: 60000 });

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newNickname, setNewNickname] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleSelectPlayer = (player: { id: string; username: string }) => {
        setPlayerId(player.id);
        setPlayerName(player.username);
        setCurrentPlayerId(player.id);
        setCurrentPlayerName(player.username);
        addProfile({ id: player.id, username: player.username });
        setRole('player');
        navigate('/player');
    };

    const isDuplicate = React.useMemo(() => {
        if (!newNickname.trim()) return false;
        const normalizedNickname = newNickname.trim().toLowerCase();
        return players.some(p => p.username.toLowerCase() === normalizedNickname);
    }, [newNickname, players]);

    // Sort players alphabetically by username
    const sortedPlayers = React.useMemo(() => {
        return [...players].sort((a, b) =>
            a.username.toLowerCase().localeCompare(b.username.toLowerCase())
        );
    }, [players]);

    const handleCreatePlayer = async () => {
        if (!newNickname.trim() || isCreating || isDuplicate) return;

        setIsCreating(true);
        try {
            const player = await createPlayer.mutateAsync(newNickname.trim());
            handleSelectPlayer(player);
        } catch (error) {
            console.error('Error creating player:', error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header */}
            <div className="p-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-muted-foreground"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Indietro
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col px-4 pb-8 overflow-hidden">
                <div className="space-y-4 max-w-md mx-auto w-full flex flex-col h-full">
                    {/* Title */}
                    <div className="text-center space-y-2">
                        <div className="text-5xl">👥</div>
                        <h1 className="font-sans font-bold text-3xl text-primary">
                            Chi sei?
                        </h1>
                        <p className="font-sans text-sm text-muted-foreground">
                            Seleziona il tuo profilo o creane uno nuovo
                        </p>
                    </div>

                    {/* Create New Profile Button/Form */}
                    {!showCreateForm ? (
                        <Button
                            onClick={() => setShowCreateForm(true)}
                            className="w-full py-5 font-sans font-bold text-lg gradient-pizza text-primary-foreground flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Crea Nuovo Profilo
                        </Button>
                    ) : (
                        <div className="space-y-3 p-4 bg-card rounded-lg border-2 border-primary/50">
                            <Input
                                value={newNickname}
                                onChange={(e) => setNewNickname(e.target.value)}
                                placeholder="Il tuo nome..."
                                className="font-sans py-5 text-lg font-bold"
                                maxLength={30}
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        setNewNickname('');
                                    }}
                                    className="flex-1 font-sans font-bold"
                                >
                                    Annulla
                                </Button>
                                <Button
                                    onClick={handleCreatePlayer}
                                    disabled={!newNickname.trim() || isCreating || isDuplicate}
                                    className="flex-1 font-sans font-bold gradient-pizza text-primary-foreground"
                                >
                                    {isCreating ? 'Creazione...' : isDuplicate ? 'Già Esistente' : 'CREA 🚀'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Player List */}
                    <div className="flex-1 overflow-y-auto space-y-2 pb-4">
                        <p className="font-sans font-bold text-xs text-muted-foreground text-center sticky top-0 bg-background py-2">
                            Oppure seleziona un profilo esistente:
                        </p>
                        {players.length === 0 ? (
                            <p className="text-center text-muted-foreground font-sans py-8">
                                Nessun giocatore registrato
                            </p>
                        ) : (
                            sortedPlayers.map((player) => (
                                <Card
                                    key={player.id}
                                    onClick={() => handleSelectPlayer(player)}
                                    className="cursor-pointer hover:border-primary transition-colors active:scale-[0.98]"
                                >
                                    <CardContent className="py-4 flex items-center gap-3">
                                        <User className="w-5 h-5 text-primary" />
                                        <span className="font-sans font-bold text-lg flex-1">{formatTitleCase(player.username)}</span>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerSelectPage;
