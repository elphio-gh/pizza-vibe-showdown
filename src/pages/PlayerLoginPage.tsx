import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { useRoleAuth, useCurrentSession } from '@/hooks/useLocalStorage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const PLAYER_PASSWORD = 'pizza';

const PlayerLoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { setRole } = useRole();
    const { setRoleAuthenticated, isRoleAuthenticated } = useRoleAuth();
    const { currentPlayerId, currentPlayerName } = useCurrentSession();

    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // If already authenticated, redirect to player select
    useEffect(() => {
        if (isRoleAuthenticated('player')) {
            if (currentPlayerId && currentPlayerName) {
                navigate('/player-rejoin');
            } else {
                navigate('/player-select');
            }
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password.toLowerCase() === PLAYER_PASSWORD) {
            setRoleAuthenticated('player');
            setRole('player');
            if (currentPlayerId && currentPlayerName) {
                navigate('/player-rejoin');
            } else {
                navigate('/player-select');
            }
        } else {
            setError(true);
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header - fixed at top */}
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

            {/* Content - positioned in upper half to avoid keyboard */}
            <div className="flex-1 flex flex-col px-6 pt-4 pb-8">
                <div className="space-y-6 max-w-sm mx-auto w-full">
                    {/* Icon & Title */}
                    <div className="text-center space-y-4">
                        <div className="text-7xl animate-float">🎮</div>
                        <h1 className="font-display text-4xl text-primary text-glow-orange">
                            Accesso Giocatore
                        </h1>
                        <p className="text-muted-foreground font-russo">
                            Inserisci la password per entrare
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password..."
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError(false);
                                }}
                                className={`pl-12 pr-12 py-6 text-lg font-russo ${error ? 'border-destructive' : ''}`}
                                autoFocus
                                autoComplete="off"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {error && (
                            <p className="text-destructive text-sm text-center animate-shake font-russo">
                                🍕 Password sbagliata! Riprova...
                            </p>
                        )}

                        <Button
                            type="submit"
                            className="w-full py-6 font-display text-xl gradient-pizza text-primary-foreground box-glow-orange"
                        >
                            ENTRA 🚀
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PlayerLoginPage;
