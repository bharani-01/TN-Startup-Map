import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface BookmarkContextType {
  bookmarkedIds: string[];
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (id: string) => { success: boolean; requiresAuth?: boolean; added?: boolean };
  clearBookmarks: () => void;
  count: number;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const storageKey = user ? `tn_bookmarks_${user.id}` : 'tn_bookmarks';

  // Load bookmarks on mount or when user changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setBookmarkedIds(JSON.parse(saved));
      } else {
        // Fallback to legacy global bookmarks if user logs in
        const fallback = localStorage.getItem('tn_bookmarks');
        if (fallback) {
          setBookmarkedIds(JSON.parse(fallback));
        } else {
          setBookmarkedIds([]);
        }
      }
    } catch {
      setBookmarkedIds([]);
    }
  }, [user, storageKey]);

  const isBookmarked = (id: string): boolean => {
    return bookmarkedIds.includes(id);
  };

  const toggleBookmark = (id: string) => {
    if (!isAuthenticated) {
      return { success: false, requiresAuth: true };
    }

    let next: string[];
    let added = false;
    if (bookmarkedIds.includes(id)) {
      next = bookmarkedIds.filter((item) => item !== id);
    } else {
      next = [...bookmarkedIds, id];
      added = true;
    }

    setBookmarkedIds(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      localStorage.setItem('tn_bookmarks', JSON.stringify(next));
    } catch (e) {
      console.warn('Could not persist bookmark to storage:', e);
    }

    return { success: true, added };
  };

  const clearBookmarks = () => {
    setBookmarkedIds([]);
    try {
      localStorage.removeItem(storageKey);
      localStorage.removeItem('tn_bookmarks');
    } catch (e) {
      console.warn('Could not clear bookmarks:', e);
    }
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarkedIds,
        isBookmarked,
        toggleBookmark,
        clearBookmarks,
        count: bookmarkedIds.length,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};
