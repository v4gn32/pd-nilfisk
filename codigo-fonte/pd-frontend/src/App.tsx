import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";

// Contextos
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { UserSettingsProvider } from "./contexts/UserSettingsContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Tipos
import { Document, User } from "./types";

// Páginas
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import UploadPage from "./pages/UploadPage";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

// Componentes
import Sidebar from "./components/Sidebar";

// Spinner simples (você pode trocar por componente visual customizado)
const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-[#38AFD9]"></div>
  </div>
);

// Layout principal com Sidebar
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar user={user} onLogout={logout} />
      <div className="flex-1 ml-0 md:ml-64 overflow-auto">{children}</div>
    </div>
  );
};

// Rota protegida
const ProtectedRoute = ({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Spinner />;

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && user?.role !== "ADMIN") return <Navigate to="/dashboard" />;

  return <AppLayout>{children}</AppLayout>;
};

// Rotas principais com dados reais
const AppRoutes = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const headers = { Authorization: `Bearer ${token}` };

        // Buscar documentos
        const docRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/documents/me`,
          { headers }
        );
        if (isMounted) setDocuments(docRes.data);

        // Buscar usuários (admin)
        const userRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/users`,
          { headers }
        );
        if (isMounted) setUsers(userRes.data);
      } catch (err: any) {
        console.error("Erro ao buscar dados:", err);

        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login"; // Redireciona forçadamente
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" /> : <Login />}
      />

      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" /> : <Register />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard user={user!} documents={documents} users={users} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <Documents documents={documents} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload"
        element={
          <ProtectedRoute adminOnly>
            <UploadPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute adminOnly>
            <Users />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

// App principal
const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <UserSettingsProvider>
        <Router>
          <AppRoutes />
        </Router>
      </UserSettingsProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
