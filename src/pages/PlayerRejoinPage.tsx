import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { useCurrentSession } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, UserPlus } from 'lucide-react';

const PlayerRejoinPage: React.FC = () => {
    const navigate = useNavigate();
    const { setPlayerId, setPlayerName, setRole } = useRole();
    const { currentPlayerId, currentPlayerName, clearSession } = useCurrentSession();

    const handleRejoinConfirm = () => {
        setPlayerId(currentPlayerId);
        setPlayerName(currentPlayerName);
        setRole('player');
        navigate('/player');
    };

    const handleRejoinDecline = () => {
        clearSession();
        navigate('/player-select');
    };

    // If no saved session, redirect to player select
    React.useEffect(() => {
        if (!currentPlayerId || !currentPlayerName) {
            navigate('/player-select');
        }
    }, [currentPlayerId, currentPlayerName, navigate]);

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
            <div className="flex-1 flex flex-col px-6 pt-4 pb-8">
                <div className="space-y-8 max-w-sm mx-auto w-full">
                    {/* Icon & Title */}
                    <div className="text-center space-y-4">
                        <div className="text-7xl animate-bounce-in">🍕</div>
                        <h1 className="font-display text-4xl text-primary text-glow-orange">
                            Bentornato!
                        </h1>
                        <p className="text-xl font-russo text-foreground">
                            Sei tu <span className="text-primary font-bold">{currentPlayerName}</span>?
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <Button
                            onClick={handleRejoinConfirm}
                            className="w-full py-6 font-sans font-bold text-xl gradient-pizza text-primary-foreground box-glow-orange flex items-center justify-center gap-2"
                        >
                            <User className="w-6 h-6" />
                            Sì, sono io! ✓
                        </Button>

                        <Button
                            onClick={handleRejoinDecline}
                            variant="outline"
                            className="w-full py-6 font-russo text-lg flex items-center justify-center gap-2"
                        >
                            <UserPlus className="w-5 h-5" />
                            No, cambia profilo
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerRejoinPage;
