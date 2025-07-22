import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Upload,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import ThemeToggle from "./ui/ThemeToggle";
import { User } from "../types";

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  showFor: "all" | "admin" | "user";
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  // Menu de navegação
  const navItems: NavItem[] = [
    {
      name: "Painel",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      showFor: "all",
    },
    {
      name: "Meus Documentos",
      path: "/documents",
      icon: <FileText size={20} />,
      showFor: "user",
    },
    {
      name: "Gerenciar Documentos",
      path: "/admin-documents",
      icon: <FileText size={20} />,
      showFor: "admin",
    },
    {
      name: "Enviar Documentos",
      path: "/upload",
      icon: <Upload size={20} />,
      showFor: "admin",
    },
    {
      name: "Gerenciar Usuários",
      path: "/users",
      icon: <Users size={20} />,
      showFor: "admin",
    },
    {
      name: "Configurações",
      path: "/settings",
      icon: <Settings size={20} />,
      showFor: "all",
    },
  ];

  // Filtra os menus com base na role
  const filteredNavItems = navItems.filter(
    (item) =>
      item.showFor === "all" ||
      (item.showFor === "admin" && isAdmin) ||
      (item.showFor === "user" && !isAdmin)
  );

  const toggleCollapse = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  return (
    <>
      {/* Botão para abrir menu mobile */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-[#28313F] dark:bg-gray-800 text-white md:hidden"
        onClick={toggleMobile}
        aria-label="Abrir menu"
      >
        <Menu size={24} />
      </button>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white z-50
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Botão fechar menu mobile */}
        <button
          className="absolute top-4 right-4 p-2 md:hidden text-gray-600 dark:text-gray-300"
          onClick={() => setMobileOpen(false)}
          aria-label="Fechar menu"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="p-6 flex justify-center items-center border-b border-gray-200 dark:border-gray-700">
          <span className="text-2xl font-bold whitespace-nowrap text-[#38AFD9]">
            {collapsed ? "PN" : "Portal Nilfisk"}
          </span>
        </div>

        {/* Navegação */}
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center p-3 rounded-md transition-colors
                    ${
                      location.pathname === item.path
                        ? "bg-[#38AFD9]/20 text-[#38AFD9] dark:bg-[#38AFD9]/30"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }
                  `}
                  title={item.name}
                >
                  <span className="mr-3">{item.icon}</span>
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Alternador de tema */}
        <div className="px-4 mt-6">
          <div
            className={`flex ${
              collapsed ? "justify-center" : "justify-between items-center"
            }`}
          >
            {!collapsed && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tema
              </span>
            )}
            <ThemeToggle />
          </div>
        </div>

        {/* Informações do usuário e logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          {!collapsed && user && (
            <div className="mb-4 px-4 py-2">
              <p className="text-sm font-medium truncate text-gray-900 dark:text-white">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>
          )}

          <button
            onClick={onLogout}
            className="flex items-center justify-center w-full p-3 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
            aria-label="Sair"
          >
            <LogOut size={20} className="mr-3" />
            {!collapsed && <span>Sair</span>}
          </button>

          {/* Botão de recolher/expandir menu */}
          <button
            className="hidden md:flex items-center justify-center w-full mt-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            onClick={toggleCollapse}
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            <Menu size={20} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
