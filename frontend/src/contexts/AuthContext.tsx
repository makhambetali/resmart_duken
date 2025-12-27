// @/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, authService, User, LoginData, RegisterData } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authService.getUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (authService.isAuthenticated()) {
      try {
        const userData = await authApi.getCurrentUser();
        setUser(userData);
        authService.setUser(userData);
      } catch (error) {
        console.error('Failed to load user:', error);
        authService.clearTokens();
        setUser(null);
      }
    }
    setIsLoading(false);
  };

  const login = async (data: LoginData) => {
    const response = await authApi.login(data);
    authService.setTokens(response);
    setUser(response.user);
    authService.setUser(response.user);
  };

  const register = async (data: RegisterData) => {
    const response = await authApi.register(data);
    authService.setTokens(response);
    setUser(response.user);
    authService.setUser(response.user);
  };

  const logout = async () => {
    try {
      const refreshToken = authService.getRefreshToken();
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authService.clearTokens();
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.profile?.role === 'admin',
        isEmployee: user?.profile?.role === 'employee',
        // Добавьте если нужно:
        userStore: user?.profile?.store || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};