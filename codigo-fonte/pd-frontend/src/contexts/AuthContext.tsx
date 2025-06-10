import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock API functions - would be replaced with real API calls
const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Admin credentials
  if (email === "admin@nilfisk.com" && password === "admin123") {
    return {
      id: 1,
      name: 'Administrador',
      email: 'admin@nilfisk.com',
      role: 'ADMIN'
    };
  } else if (email === "user@example.com" && password === "user123") {
    return {
      id: 2,
      name: 'Usuário Comum',
      email: 'user@example.com',
      role: 'COMMON'
    };
  }
  
  throw new Error('Credenciais inválidas');
};

const mockRegister = async (
  name: string, 
  email: string, 
  password: string
): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple validation
  if (!name || !email || !password) {
    throw new Error('Todos os campos são obrigatórios');
  }
  
  // Check email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Formato de email inválido');
  }
  
  // In a real app, this would create a new user in the database
  return {
    id: 3,
    name,
    email,
    role: 'COMMON'
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });
  
  // Check for saved auth on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        setAuthState({
          user: parsedAuth.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } catch (e) {
        localStorage.removeItem('auth');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const user = await mockLogin(email, password);
      
      const newAuthState = {
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
      
      setAuthState(newAuthState);
      localStorage.setItem('auth', JSON.stringify({
        user
      }));
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Falha no login'
      }));
    }
  };
  
  const register = async (name: string, email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const user = await mockRegister(name, email, password);
      
      const newAuthState = {
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
      
      setAuthState(newAuthState);
      localStorage.setItem('auth', JSON.stringify({
        user
      }));
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Falha no cadastro'
      }));
    }
  };
  
  const logout = () => {
    localStorage.removeItem('auth');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  };
  
  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};