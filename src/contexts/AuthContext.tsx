import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername || password !== '123456') {
      return false;
    }
    setUser({ username: trimmedUsername });
    return true;
  };

  const logout = (): void => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
}
