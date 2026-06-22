import { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch, clearAuth, getAuthToken, getAuthUser, setAuthToken, setAuthUser } from './services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = getAuthToken();
    const storedUser = getAuthUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (payload) => {
    try {
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: payload,
        auth: false,
      });

      const { token: accessToken, user: authenticatedUser } = response.data;
      setToken(accessToken);
      setUser(authenticatedUser);
      setAuthToken(accessToken);
      setAuthUser(authenticatedUser);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message || 'Falha ao autenticar.' };
    }
  };

  const register = async (payload) => {
    try {
      const response = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: payload,
        auth: false,
      });

      const { token: accessToken, user: registeredUser } = response.data;
      setToken(accessToken);
      setUser(registeredUser);
      setAuthToken(accessToken);
      setAuthUser(registeredUser);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message || 'Falha ao registrar.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    clearAuth();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
