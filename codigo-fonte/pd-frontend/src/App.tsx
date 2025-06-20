import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { UserSettingsProvider } from "./contexts/UserSettingsContext";

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
import { Document, User } from "./types";

// Layout com sidebar
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="flex h-screen bg-[#EFF0F2]">
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && user?.role !== "ADMIN") return <Navigate to="/dashboard" />;

  return <AppLayout>{children}</AppLayout>;
};

// Conteúdo principal
const AppContent = () => {
  const { user, login, register } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingDocs, setLoadingDocs] = useState<boolean>(true);

  // 📥 Buscar documentos
  const fetchDocuments = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/documents/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDocuments(response.data);
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
    } finally {
      setLoadingDocs(false);
    }
  };

  // 👥 Buscar usuários (admin)
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(response.data);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    }
  };

  // 🎯 Efeito para buscar dados após login
  useEffect(() => {
    if (user) {
      fetchDocuments();
      fetchUsers();
    }
  }, [user]);

  const handleLogin = (email: string, password: string) =>
    login(email, password);

  const handleRegister = (name: string, email: string, password: string) =>
    register(name, email, password);

  const handleDocumentDownload = (document: Document) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Token não encontrado");

    const url = `${import.meta.env.VITE_API_URL}/documents/${
      document.id
    }/download?token=${token}`;
    window.location.href = url;
  };

  const handleDocumentView = (document: Document) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Token não encontrado");

    const url = `${import.meta.env.VITE_API_URL}/documents/${
      document.id
    }/view?token=${token}`;
    window.open(url, "_blank");
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/dashboard" />
          ) : (
            <Login onLogin={handleLogin} isLoading={false} error={null} />
          )
        }
      />

      <Route
        path="/register"
        element={
          user ? (
            <Navigate to="/dashboard" />
          ) : (
            <Register
              onRegister={handleRegister}
              isLoading={false}
              error={null}
            />
          )
        }
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
            <Documents
              documents={documents}
              onDownload={handleDocumentDownload}
              onView={handleDocumentView}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload"
        element={
          <ProtectedRoute adminOnly>
            <UploadPage onUploadSuccess={fetchDocuments} />
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
  <AuthProvider>
    <UserSettingsProvider>
      <Router>
        <AppContent />
      </Router>
    </UserSettingsProvider>
  </AuthProvider>
);

export default App;
