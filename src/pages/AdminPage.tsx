import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { Navigation } from '@/components/shared/Navigation';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { PizzaManager } from '@/components/admin/PizzaManager';
import { VoteManager } from '@/components/admin/VoteManager';
import { AdvancedTVController } from '@/components/admin/AdvancedTVController';
import { PizzaRegistration } from '@/components/player/PizzaRegistration';

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
          </div>
          <div className="space-y-6">
            <PizzaManager />
            <VoteManager />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
