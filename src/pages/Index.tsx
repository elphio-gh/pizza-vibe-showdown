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

  // Listener per la scorciatoia da tastiera 'T'
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora se l'utente sta scrivendo in un input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key.toLowerCase() === 't') {
        handleTVClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

      <div className="flex flex-col gap-6 w-full max-w-4xl items-center">

        {/* 
            TV SHOW BUTTON
            Desktop: Top Position, Full Width, Flatter Aspect Ratio (5:1)
            Layout: Row (Inline content)
        */}
        <div className="hidden md:flex w-full">
          <RoleButton
            icon={Tv}
            label="TV SHOW"
            emoji="📺"
            onClick={handleTVClick}
            variant="pink"
            className="w-full max-w-none aspect-[5/1] text-5xl shadow-2xl border-4 gap-6 hover:gap-8 transition-all"
            layout="row"
            size="default"
            shortcut="T"
          />
        </div>

        {/* Player & Admin Row */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
          <RoleButton
            icon={User}
            label="GIOCATORE"
            emoji="🎮"
            onClick={handlePlayerClick}
            variant="orange"
            className="w-full max-w-none aspect-[3/1] md:aspect-[7/1] flex-row p-4 gap-3 md:gap-4 [&_span]:text-lg md:[&_span]:text-2xl [&_svg]:w-8 [&_svg]:h-8 md:[&_svg]:w-12 md:[&_svg]:h-12"
            layout="row"
          />
          <RoleButton
            icon={Shield}
            label="ADMIN"
            emoji="👑"
            onClick={handleAdminClick}
            variant="blue"
            className="w-full max-w-none aspect-[6/1] md:aspect-[7/1] flex-row p-4 gap-3 md:gap-4 [&_span]:text-base md:[&_span]:text-2xl [&_svg]:w-5 [&_svg]:h-5 md:[&_svg]:w-12 md:[&_svg]:h-12"
            layout="row"
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
