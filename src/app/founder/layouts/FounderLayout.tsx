import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { FounderNavbar } from '../components/FounderNavbar';
import { FounderSidebar } from '../components/FounderSidebar';
import { useAuth } from '../../../context/AuthContext';

export const FounderLayout: React.FC = () => {
  const { isAuthenticated, isFounder, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-apple-bg">
        <div className="w-8 h-8 border-4 border-apple-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !isFounder) {
    return <Navigate to="/login?redirect=/founder/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-apple-bg">
      <FounderNavbar />
      <div className="flex-1 flex">
        <FounderSidebar />
        <main className="flex-1 p-6 sm:p-10 max-w-6xl overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
