import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Public Experience
import { PublicLayout } from './app/public/layouts/PublicLayout';
import { HomePage } from './app/public/pages/HomePage';
import { MapPage } from './app/public/pages/MapPage';
import { StartupsPage } from './app/public/pages/StartupsPage';
import { StartupDetailPage } from './app/public/pages/StartupDetailPage';
import { DistrictExplorerPage } from './app/public/pages/DistrictExplorerPage';
import { DistrictDetailPage } from './app/public/pages/DistrictDetailPage';
import { SubmitStartupPage } from './app/public/pages/SubmitStartupPage';
import { LoginPage } from './app/public/pages/LoginPage';
import { RegisterPage } from './app/public/pages/RegisterPage';
import { BookmarksPage } from './app/public/pages/BookmarksPage';
import { BlogListPage } from './app/public/pages/BlogListPage';
import { BlogDetailPage } from './app/public/pages/BlogDetailPage';
import { WriteArticlePage } from './app/public/pages/WriteArticlePage';
import { SupportPage } from './app/public/pages/SupportPage';
import { JobsPage } from './app/public/pages/JobsPage';
import { TermsPage } from './app/public/pages/TermsPage';
import { PrivacyPolicyPage } from './app/public/pages/PrivacyPolicyPage';

// Founder Experience
import { FounderLayout } from './app/founder/layouts/FounderLayout';
import { FounderDashboard } from './app/founder/pages/FounderDashboard';
import { FounderEditProfile } from './app/founder/pages/FounderEditProfile';
import { FounderJobsManager } from './app/founder/pages/FounderJobsManager';

// Admin Experience
import { AdminLayout } from './app/admin/layouts/AdminLayout';
import { AdminOverview } from './app/admin/pages/AdminOverview';
import { AdminSubmissions } from './app/admin/pages/AdminSubmissions';
import { AdminClaims } from './app/admin/pages/AdminClaims';
import { AdminStartups } from './app/admin/pages/AdminStartups';
import { AdminBlogs } from './app/admin/pages/AdminBlogs';
import { AdminUsers } from './app/admin/pages/AdminUsers';
import { AdminJobs } from './app/admin/pages/AdminJobs';
import { AdminAuditLogs } from './app/admin/pages/AdminAuditLogs';
import { AdminStartupDetail } from './app/admin/pages/AdminStartupDetail';
import { AdminFeedback } from './app/admin/pages/AdminFeedback';
import { AdminErrorLogs } from './app/admin/pages/AdminErrorLogs';
import { AdminAnalytics } from './app/admin/pages/AdminAnalytics';

export const router = createBrowserRouter([
  // Public Domain Routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'startups', element: <StartupsPage /> },
      { path: 'startups/:slug', element: <StartupDetailPage /> },
      { path: 'districts', element: <Navigate to="/map" replace /> },
      { path: 'districts/:slug', element: <DistrictDetailPage /> },
      { path: 'blog', element: <BlogListPage /> },
      { path: 'blog/new', element: <WriteArticlePage /> },
      { path: 'blog/edit/:id', element: <WriteArticlePage /> },
      { path: 'blog/:slug', element: <BlogDetailPage /> },
      { path: 'support', element: <SupportPage /> },
      { path: 'submit', element: <SubmitStartupPage /> },
      { path: 'bookmarks', element: <BookmarksPage /> },
      { path: 'jobs', element: <JobsPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'privacy', element: <PrivacyPolicyPage /> },
    ],
  },

  // Founder Domain Routes (Protected)
  {
    path: '/founder',
    element: <FounderLayout />,
    children: [
      { index: true, element: <Navigate to="/founder/dashboard" replace /> },
      { path: 'dashboard', element: <FounderDashboard /> },
      { path: 'edit', element: <FounderEditProfile /> },
      { path: 'jobs', element: <FounderJobsManager /> },
    ],
  },

  // Admin Domain Routes (Protected)
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminOverview /> },
      { path: 'analytics', element: <AdminAnalytics /> },
      { path: 'submissions', element: <AdminSubmissions /> },
      { path: 'claims', element: <AdminClaims /> },
      { path: 'startups', element: <AdminStartups /> },
      { path: 'startups/:id', element: <AdminStartupDetail /> },
      { path: 'blogs', element: <AdminBlogs /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'jobs', element: <AdminJobs /> },
      { path: 'audit-logs', element: <AdminAuditLogs /> },
      { path: 'feedback', element: <AdminFeedback /> },
      { path: 'errors', element: <AdminErrorLogs /> },
    ],
  },

  // Catch-all fallback
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
