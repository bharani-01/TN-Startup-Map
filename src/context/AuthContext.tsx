import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isUser: boolean;
  isFounder: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (name: string, email: string, password: string, roleIntent?: string, companyName?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('tn_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('tn_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = React.useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tn_token');
    localStorage.removeItem('tn_user');
    localStorage.removeItem('tn_active_startup_id');
  }, []);

  // Validate session on mount
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const storedToken = localStorage.getItem('tn_token');
      if (!storedToken) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        const data = await res.json();
        if (isMounted) {
          if (data.success && data.data) {
            setUser(data.data);
            setToken(storedToken);
            localStorage.setItem('tn_user', JSON.stringify(data.data));
          } else {
            // Token expired, malformed or revoked
            logout();
          }
        }
      } catch (err) {
        console.error('Session validation error:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [logout]);

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!data.success) {
        return { success: false, error: data.message || 'Login failed' };
      }

      const { user: authUser, token: authToken } = data.data;
      setUser(authUser);
      setToken(authToken);
      localStorage.setItem('tn_token', authToken);
      localStorage.setItem('tn_user', JSON.stringify(authUser));

      return { success: true, user: authUser };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during login' };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    roleIntent?: string,
    companyName?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, roleIntent, companyName }),
      });
      const data = await res.json();

      if (!data.success) {
        return { success: false, error: data.message || 'Registration failed' };
      }

      const { user: authUser, token: authToken } = data.data;
      setUser(authUser);
      setToken(authToken);
      localStorage.setItem('tn_token', authToken);
      localStorage.setItem('tn_user', JSON.stringify(authUser));

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during registration' };
    }
  };

  const role = user?.role;
  const isUser = role === 'USER';
  const isFounder = role === 'FOUNDER' || role === 'ADMIN' || role === 'SUPER_ADMIN';
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
  const isSuperAdmin = role === 'SUPER_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        isUser,
        isFounder,
        isAdmin,
        isSuperAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
