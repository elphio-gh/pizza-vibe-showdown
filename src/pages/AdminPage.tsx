import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { Navigation } from '@/components/shared/Navigation';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { PizzaManager } from '@/components/admin/PizzaManager';
import { PlayerManager } from '@/components/admin/PlayerManager';
import { VoteManager } from '@/components/admin/VoteManager';
import { AdvancedTVController } from '@/components/admin/AdvancedTVController';
import { ResetGameButton } from '@/components/admin/ResetGameButton';
import { PizzaRegistration } from '@/components/player/PizzaRegistration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { role } = useRole();

  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 pt-20 pb-8 space-y-6">
        <div className="mb-6">
          <h1 className="font-display text-4xl text-accent text-glow-blue">
            Admin Dashboard 👑
          </h1>
          <p className="font-game text-muted-foreground">
            Gestisci la competizione Tony Buitony Cup
          </p>
        </div>

        <AdminDashboard />

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <AdvancedTVController />
            <PizzaRegistration />
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
            <PlayerManager />
            <PizzaManager />
            <VoteManager />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
