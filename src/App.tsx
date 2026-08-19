import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookmarkProvider } from './context/BookmarkContext';
import { router } from './router';

export function App() {
  return (
    <AuthProvider>
      <BookmarkProvider>
        <RouterProvider router={router} />
      </BookmarkProvider>
    </AuthProvider>
  );
}

export default App;
