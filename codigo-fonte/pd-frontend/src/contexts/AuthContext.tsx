import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "../utils/apiClient";
import { AuthState } from "../types";

// Tipagem do contexto para controle global da autenticação
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Criação do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider que envolverá o App
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  // Função para login
  const login = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      // Armazena token e usuário
      localStorage.setItem("token", token);
      localStorage.setItem("auth", JSON.stringify({ user }));

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      // Tratamento seguro para erros
      let msg = "Falha no login";
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as any).response?.data?.error
      ) {
        msg = (error as any).response.data.error;
      }

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: msg,
      }));
    }
  };

  // Função para cadastro
  const register = async (name: string, email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("auth", JSON.stringify({ user }));

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      let msg = "Falha no cadastro";
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as any).response?.data?.error
      ) {
        msg = (error as any).response.data.error;
      }

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: msg,
      }));
    }
  };

  // Executado ao carregar o app - busca perfil se token existir
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const response = await api.get("/auth/profile");
        const user = response.data;

        localStorage.setItem("auth", JSON.stringify({ user }));

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch {
        // Limpa o localStorage se o token for inválido
        localStorage.removeItem("auth");
        localStorage.removeItem("token");
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    };

    fetchProfile();
  }, []);

  // Função de logout
  const logout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para consumir o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
