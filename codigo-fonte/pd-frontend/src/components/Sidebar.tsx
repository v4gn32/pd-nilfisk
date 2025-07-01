import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  Upload,
  Users,
  Settings,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { User } from "../types";
import { useTheme } from "../contexts/ThemeContext";

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-[#28313F] text-white min-h-screen p-6 hidden md:block">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-1">Nilfisk</h2>
        <p className="text-sm text-gray-400">Portal de Documentos</p>
      </div>

      <nav className="space-y-2">
        <SidebarLink
          to="/dashboard"
          icon={<Home size={18} />}
          active={isActive("/dashboard")}
        >
          Início
        </SidebarLink>

        <SidebarLink
          to="/documents"
          icon={<FileText size={18} />}
          active={isActive("/documents")}
        >
          Meus Documentos
        </SidebarLink>

        {user.role === "ADMIN" && (
          <>
            <SidebarLink
              to="/upload"
              icon={<Upload size={18} />}
              active={isActive("/upload")}
            >
              Upload
            </SidebarLink>

            <SidebarLink
              to="/users"
              icon={<Users size={18} />}
              active={isActive("/users")}
            >
              Usuários
            </SidebarLink>

            <SidebarLink
              to="/settings"
              icon={<Settings size={18} />}
              active={isActive("/settings")}
            >
              Configurações
            </SidebarLink>
          </>
        )}
      </nav>

      <div className="mt-10 space-y-4">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition"
        >
          {theme === "dark" ? (
            <>
              <Sun size={18} className="text-yellow-400" />
              Tema Claro
            </>
          ) : (
            <>
              <Moon size={18} className="text-gray-300" />
              Tema Escuro
            </>
          )}
        </button>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-sm text-red-400 hover:text-red-200 transition"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  );
};

const SidebarLink: React.FC<{
  to: string;
  icon: React.ReactNode;
  active: boolean;
  children: React.ReactNode;
}> = ({ to, icon, active, children }) => (
  <Link
    to={to}
    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition
      ${
        active ? "bg-white text-[#28313F]" : "hover:bg-white/10 text-white/80"
      }`}
  >
    {icon}
    {children}
  </Link>
);

export default Sidebar;
