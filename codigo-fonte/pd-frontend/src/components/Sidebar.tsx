import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Upload, 
  Settings, 
  Menu, 
  X, 
  LogOut 
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  
  const isAdmin = user?.role === 'ADMIN';
  
  const navItems = [
    { 
      name: 'Painel', 
      path: '/dashboard', 
      icon: <LayoutDashboard size={20} />,
      showFor: 'all'
    },
    { 
      name: 'Meus Documentos', 
      path: '/documents', 
      icon: <FileText size={20} />,
      showFor: 'all'
    },
    { 
      name: 'Enviar Documentos', 
      path: '/upload', 
      icon: <Upload size={20} />,
      showFor: 'admin'
    },
    { 
      name: 'Gerenciar Usuários', 
      path: '/users', 
      icon: <Users size={20} />,
      showFor: 'admin'
    },
    { 
      name: 'Configurações', 
      path: '/settings', 
      icon: <Settings size={20} />,
      showFor: 'all'
    }
  ];
  
  const toggleCollapse = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);
  
  const filteredNavItems = navItems.filter(item => 
    item.showFor === 'all' || (item.showFor === 'admin' && isAdmin)
  );

  return (
    <>
      {/* Botão do menu mobile */}
      <button 
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-[#28313F] text-white md:hidden"
        onClick={toggleMobile}
      >
        <Menu size={24} />
      </button>
      
      {/* Overlay mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`
          fixed top-0 left-0 h-full bg-[#28313F] text-white z-50
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Botão fechar (apenas mobile) */}
        <button 
          className="absolute top-4 right-4 p-2 md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <X size={24} />
        </button>
        
        {/* Logo */}
        <div className="p-6 flex justify-center items-center">
          <div className="text-2xl font-bold whitespace-nowrap">
            {!collapsed && <span>Portal Nilfisk</span>}
            {collapsed && <span>PN</span>}
          </div>
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
                    ${location.pathname === item.path 
                      ? 'bg-[#38AFD9]/20 text-[#38AFD9]' 
                      : 'hover:bg-[#38AFD9]/10'
                    }
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Usuário e logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {!collapsed && user && (
            <div className="mb-4 px-4 py-2">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          )}
          
          <button
            onClick={onLogout}
            className="flex items-center justify-center w-full p-3 rounded-md hover:bg-red-500/20 text-red-400"
          >
            <LogOut size={20} className="mr-3" />
            {!collapsed && <span>Sair</span>}
          </button>
          
          {/* Botão de colapso (apenas desktop) */}
          <button
            className="hidden md:flex items-center justify-center w-full mt-4 p-2 rounded-md hover:bg-[#38AFD9]/10"
            onClick={toggleCollapse}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;