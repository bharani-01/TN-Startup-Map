import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AdminNavbar } from '../components/AdminNavbar';
import { AdminSidebar } from '../components/AdminSidebar';
import { useAuth } from '../../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-apple-dark text-white">
        <div className="w-8 h-8 border-4 border-apple-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/admin" replace />;
  }

  // Strict guard: Non-admins are immediately redirected to the landing page
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#161617] text-white">
      <AdminNavbar />
      <div className="flex-1 flex">
        <AdminSidebar />
        <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto bg-[#161617]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
