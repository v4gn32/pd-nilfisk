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

// Spinner simples (você pode substituir por um componente customizado)
const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-[#38AFD9]"></div>
  </div>
);

// Layout principal com Sidebar
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) return <Spinner />;
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

// Rotas principais com carregamento de dados sincronizado
const AppRoutes = () => {
  const { user, isLoading } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !user) return;

        const headers = { Authorization: `Bearer ${token}` };

        // Documentos
        const docRes = await axios.get(
          user.role === "ADMIN"
            ? `${import.meta.env.VITE_API_URL}/documents`
            : `${import.meta.env.VITE_API_URL}/documents/me`,
          { headers }
        );
        setDocuments(docRes.data);

        // Usuários (apenas admin)
        if (user.role === "ADMIN") {
          const userRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/users`,
            { headers }
          );
          setUsers(userRes.data);
        }

        setLoadingData(false);
      } catch (err: any) {
        console.error("Erro ao buscar dados:", err);
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    };

    if (!isLoading && user) {
      fetchData();
    }
  }, [user, isLoading]);

  if (isLoading || loadingData) {
    return <Spinner />;
  }

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
