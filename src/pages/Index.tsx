import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { RoleButton } from '@/components/landing/RoleButton';
import { PasswordModal } from '@/components/landing/PasswordModal';
import { User, Shield, Tv } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { setRole } = useRole();
  const [passwordModal, setPasswordModal] = useState<'admin' | 'tv' | null>(null);

  const handlePlayerClick = () => {
    setRole('player');
    navigate('/player');
  };

  const handleAdminClick = () => {
    setPasswordModal('admin');
  };

  const handleTVClick = () => {
    setPasswordModal('tv');
  };

  const handlePasswordSuccess = () => {
    if (passwordModal === 'admin') {
      setRole('admin');
      navigate('/admin');
    } else if (passwordModal === 'tv') {
      setRole('tv');
      navigate('/tv');
    }
    setPasswordModal(null);
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
        />
        <RoleButton
          icon={Tv}
          label="TV SHOW"
          emoji="📺"
          onClick={handleTVClick}
          variant="pink"
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
        title={passwordModal === 'admin' ? 'Accesso Admin' : 'Accesso TV Show'}
      />
    </div>
  );
};

export default Index;
