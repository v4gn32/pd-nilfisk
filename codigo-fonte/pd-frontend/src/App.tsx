import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { UserSettingsProvider } from "./contexts/UserSettingsContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import UploadPage from "./pages/UploadPage";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Sidebar from "./components/Sidebar";
import { mockDocuments, getUserDocuments } from "./data/mockData";
import { Document } from "./types";

// Layout com Sidebar para rotas autenticadas
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen bg-[#EFF0F2]">
      <Sidebar user={user} onLogout={logout} />
      <div className="flex-1 ml-0 md:ml-64 overflow-auto">{children}</div>
    </div>
  );
};

// Componente de rota protegida
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

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user?.role !== "ADMIN") {
    return <Navigate to="/dashboard" />;
  }

  return <AppLayout>{children}</AppLayout>;
};

// Componente principal do App
const AppContent = () => {
  const { user, login, register } = useAuth();
  const [documents] = useState<Document[]>(mockDocuments);

  const handleLogin = (email: string, password: string) => {
    return login(email, password);
  };

  const handleRegister = (name: string, email: string, password: string) => {
    return register(name, email, password);
  };

  const handleDocumentDownload = (document: Document) => {
    console.log("Baixando documento:", document);
    alert(`Baixando: ${document.fileUrl}`);
  };

  const userDocuments = user ? getUserDocuments(user.id) : [];

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
            <Dashboard user={user!} documents={userDocuments} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <Documents
              documents={userDocuments}
              onDownload={handleDocumentDownload}
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

function App() {
  return (
    <AuthProvider>
      <UserSettingsProvider>
        <Router>
          <AppContent />
        </Router>
      </UserSettingsProvider>
    </AuthProvider>
  );
}

export default App;
