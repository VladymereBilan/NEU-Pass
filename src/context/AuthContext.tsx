import React, { createContext, useContext, useMemo, useState } from 'react';
import { User, UserRole } from '../types/User';
import { AuthService } from '../services/AuthService';

interface AuthContextValue {
  user: User | null;
  role: UserRole | null;
  login: (username: string, password: string) => Promise<User | null>;
  signUp: (username: string, password: string) => Promise<User | null>;
  logout: () => void;
  updateProfileImage: (uri: string | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    const result = await AuthService.login(username, password);
    setUser(result);
    return result;
  };

  const signUp = async (username: string, password: string) => {
    const result = await AuthService.signUp(username, password);
    setUser(result);
    return result;
  };

  const logout = () => setUser(null);

  const updateProfileImage = async (uri: string | null) => {
    if (!user) return;
    await AuthService.updateProfileImage(user.userId, uri);
    setUser({ ...user, profileImageUri: uri });
  };

  const value = useMemo(
    () => ({ user, role: user?.role ?? null, login, signUp, logout, updateProfileImage }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthContext is not ready');
  return ctx;
};
