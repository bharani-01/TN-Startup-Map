import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { BookmarkProvider } from './context/BookmarkContext';
import { router } from './router';

export function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BookmarkProvider>
          <RouterProvider router={router} />
        </BookmarkProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
