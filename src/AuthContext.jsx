import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const testUsers = {
  admin: {
    name: 'Admin System',
    email: 'admin@teste.com',
    password: 'Admin123',
    role: 'admin',
  },
  user: {
    name: 'Luan Penha',
    email: 'teste@teste.com',
    password: 'Senha123',
    role: 'user',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (payload) => {
    if (typeof payload === 'string') {
      setUser({ name: payload, role: 'user' });
      return { success: true };
    }

    if (payload?.email && payload?.password) {
      const adminMatch = payload.email === testUsers.admin.email && payload.password === testUsers.admin.password;
      const userMatch = payload.email === testUsers.user.email && payload.password === testUsers.user.password;

      if (adminMatch) {
        setUser(testUsers.admin);
        return { success: true };
      }
      if (userMatch) {
        setUser(testUsers.user);
        return { success: true };
      }
      return { success: false, message: 'E-mail ou senha inválidos.' };
    }

    return { success: false, message: 'Credenciais incompletas.' };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
