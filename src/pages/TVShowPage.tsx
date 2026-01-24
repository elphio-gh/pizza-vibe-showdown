import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { TVShowView } from '@/components/tv/TVShowView';

const TVShowPage: React.FC = () => {
  const { role } = useRole();

  if (role !== 'tv') {
    return <Navigate to="/" replace />;
  }

  return <TVShowView />;
};

export default TVShowPage;
