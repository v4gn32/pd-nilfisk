// src/App.tsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Contextos
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { UserSettingsProvider } from "./contexts/UserSettingsContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Páginas
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import UploadPage from "./pages/UploadPage";
import AdminDocuments from "./pages/AdminDocuments";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

// Componentes
import Sidebar from "./components/Sidebar";

// Tipos e API
import api from "./services/api";
import { Document, User as UserType } from "./types";

// Notificações modernas
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Loader
const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-[#38AFD9]"></div>
  </div>
);

// Layout com Sidebar
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) return <Spinner />;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar user={user} onLogout={logout} />
      <div className="flex-1 ml-0 md:ml-64 overflow-auto">
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

// Rota protegida com controle de acesso
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

// Rotas da aplicação
const AppRoutes = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, usersRes] = await Promise.all([
          api.get("/documents"),
          api.get("/users"),
        ]);
        setDocuments(docsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };

    fetchData();
  }, []);

  const handleDownloadDocument = async (doc: Document) => {
    try {
      const response = await api.get(`/documents/${doc.id}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", doc.name || "documento.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Erro ao baixar documento:", err);
    }
  };

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
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-documents"
        element={
          <ProtectedRoute adminOnly>
            <AdminDocuments
              documents={documents}
              users={users}
              onDeleteDocument={(id) =>
                setDocuments((prev) => prev.filter((doc) => doc.id !== id))
              }
              onDownloadDocument={handleDownloadDocument}
            />
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

// App com provedores de contexto
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
