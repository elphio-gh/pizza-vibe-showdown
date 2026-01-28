// Pagina di atterraggio (Landing Page) dell'applicazione.
// Qui l'utente sceglie se entrare come Giocatore, Admin o visualizzare la TV.
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { RoleButton } from '@/components/landing/RoleButton';
import { useRoleAuth } from '@/hooks/useLocalStorage';
import { User, Shield, Tv } from 'lucide-react'; // Icone moderne

const Index: React.FC = () => {
  const navigate = useNavigate(); // Hook per cambiare pagina via codice
  const { setRole } = useRole();
  const { isRoleAuthenticated } = useRoleAuth();

  // Funzione chiamata quando si clicca su "GIOCATORE"
  const handlePlayerClick = () => {
    if (isRoleAuthenticated('player')) {
      // Se è già loggato, lo portiamo alla selezione del profilo
      navigate('/player-rejoin');
    } else {
      // Altrimenti deve prima inserire la password/nome
      navigate('/player-login');
    }
  };

  // Funzione per l'accesso Admin
  const handleAdminClick = () => {
    if (isRoleAuthenticated('admin')) {
      setRole('admin');
      navigate('/admin');
    } else {
      navigate('/admin-login');
    }
  };

  // Funzione per visualizzare l'interfaccia TV (quella che vedono tutti sul grande schermo)
  const handleTVClick = () => {
    setRole('tv');
    navigate('/tv');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      {/* Intestazione con animazioni CSS */}
      <div className="text-center mb-12 animate-bounce-in">
        <div className="text-[100px] md:text-[150px] mb-4 animate-float">🍕</div>
        <h1 className="font-display text-5xl md:text-7xl bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-4">
          TONY BUITONY CUP
        </h1>
        <p className="font-russo text-xl md:text-2xl text-muted-foreground">
          🏆 La sfida delle pizze surgelate! 🏆
        </p>
      </div>

      {/* Pulsanti per scegliere il ruolo */}
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
        <div className="hidden md:block">
          <RoleButton
            icon={Tv}
            label="TV SHOW"
            emoji="📺"
            onClick={handleTVClick}
            variant="pink"
            size="small"
          />
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="font-russo text-sm text-muted-foreground">
          Vota le migliori pizze surgelate con stile! 😎🎸
        </p>
      </div>
    </div>
  );
};

export default Index;
