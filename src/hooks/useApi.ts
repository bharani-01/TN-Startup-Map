import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
}

export function useApi() {
  const { token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async <T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        let url = endpoint.startsWith('http') ? endpoint : `/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

        if (options.params) {
          const searchParams = new URLSearchParams();
          Object.entries(options.params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              searchParams.append(key, String(value));
            }
          });
          const queryString = searchParams.toString();
          if (queryString) {
            url += `${url.includes('?') ? '&' : '?'}${queryString}`;
          }
        }

        const headers = new Headers(options.headers || {});
        if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
          headers.set('Content-Type', 'application/json');
        }

        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }

        const response = await fetch(url, {
          ...options,
          headers,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || `Request failed with status ${response.status}`);
        }

        return data.data;
      } catch (err: any) {
        const msg = err.message || 'An unexpected error occurred';
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { request, loading, error };
}
