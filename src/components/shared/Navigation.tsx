import React from 'react';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import { Home, User, Shield, Tv } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrentSession } from '@/hooks/useLocalStorage';

interface NavigationProps {
  showProfileSwitcher?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ showProfileSwitcher = false }) => {
  const { role, setRole, playerName, setPlayerId, setPlayerName } = useRole();
  const { clearSession } = useCurrentSession();
  const navigate = useNavigate();

  const handleGoHome = () => {
    setRole(null);
    setPlayerId(null);
    setPlayerName(null);
    clearSession();
    navigate('/');
  };

  const handleGoToMyPizza = () => {
    navigate('/my-pizza');
  };

  const handleGoToProfileSelect = () => {
    navigate('/player-select');
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'player':
        return <User className="w-4 h-4" />;
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'tv':
        return <Tv className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'player':
        return playerName || 'Giocatore';
      case 'admin':
        return 'Admin';
      case 'tv':
        return 'TV Show';
      default:
        return '';
    }
  };

  if (!role) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleGoHome}
          className="flex items-center gap-2 text-primary hover:text-primary/80"
        >
          <Home className="w-5 h-5" />
          <span className="font-display text-lg hidden sm:inline">Tony Buitony Cup</span>
        </Button>

        <div className="flex items-center gap-2">
          {/* Profile - navigates to player select page instead of opening dialog */}
          {showProfileSwitcher && role === 'player' ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoToProfileSelect}
              className="flex items-center gap-2 text-primary hover:text-primary/80"
            >
              <User className="w-4 h-4" />
              <span className="font-russo text-sm">{playerName || 'Profilo'}</span>
            </Button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
              {getRoleIcon()}
              <span className="font-russo text-sm">{getRoleLabel()}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
