// Pagina riservata all'Amministratore (colui che organizza la sfida).
// Da qui si possono gestire giocatori, pizze, voti e comandare la TV.
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { PizzaManager } from '@/components/admin/PizzaManager';
import { PlayerManager } from '@/components/admin/PlayerManager';
import { VoteManager } from '@/components/admin/VoteManager';
import { TVDirectorRemote } from '@/components/admin/TVDirectorRemote';
import { ResetGameButton } from '@/components/admin/ResetGameButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, LogOut } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { role, setRole, setPlayerId, setPlayerName } = useRole();
  const navigate = useNavigate();

  // Funzione per uscire dalla sessione admin
  const handleLogout = () => {
    setRole(null);
    setPlayerId(null);
    setPlayerName(null);
    navigate('/');
  };

  // Se l'utente non è un admin, lo rimandiamo alla home (protezione semplice).
  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 pt-6 pb-8 space-y-6">
      {/* Header con titolo e pulsante logout */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-3xl sm:text-4xl text-accent text-glow-blue">
            Admin Dashboard 👑
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive flex items-center gap-1.5 shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Esci</span>
          </Button>
        </div>
        <p className="font-russo text-muted-foreground mt-1">
          Gestisci la competizione Tony Buitony Cup
        </p>
      </div>

      {/* Riepilogo delle statistiche attuali */}
      <AdminDashboard />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Il "Telecomando" per cambiare quello che appare sulla TV */}
          <TVDirectorRemote />

          {/* Sezione per resettare tutto il database se qualcosa va storto */}
          <Card className="bg-card border-2 border-destructive/50">
            <CardHeader>
              <CardTitle className="font-display text-xl text-destructive flex items-center gap-3">
                <Settings className="w-6 h-6" />
                Azioni Pericolose
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResetGameButton />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          {/* Liste per gestire le varie entità del database */}
          <PlayerManager />
          <PizzaManager />
          <VoteManager />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

