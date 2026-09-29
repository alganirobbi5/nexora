import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logout, refreshUser } from '@/lib/auth';
import type { User, LoginPayload, RegisterPayload } from '@/lib/auth';

export type { User } from '@/lib/auth';

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginPayload) => Promise<User>;
  register: (data: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User>;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (data: LoginPayload): Promise<User> => {
    const loggedInUser = await login(data);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (data: RegisterPayload): Promise<User> => {
    const registeredUser = await register(data);
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = async () => {
    await logout();
    setUser(null);
  };

  const refreshUser = async (): Promise<User> => {
    const updatedUser = await refreshUser();
    setUser(updatedUser);
    return updatedUser;
  };

  const isAuthenticated = !!user;

  // Initial session check on mount
  useEffect(() => {
    getCurrentUser().then((usr) => {
      setUser(usr);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};