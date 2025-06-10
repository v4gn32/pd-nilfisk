import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-[#28313F] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="text-center mb-12">
          <img 
            src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg" 
            alt="Nilfisk Logo" 
            className="w-32 h-32 mx-auto mb-8 rounded-full object-cover"
          />
          <h1 className="text-4xl font-bold text-white mb-4">
            Portal Nilfisk
          </h1>
          <p className="text-gray-400 text-lg">
            Acesse seus documentos de forma simples e segura
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/login" className="block">
            <Button 
              size="lg" 
              fullWidth 
              className="bg-[#38AFD9] hover:bg-[#38AFD9]/90"
            >
              Entrar
            </Button>
          </Link>
          
          <Link to="/register" className="block">
            <Button 
              variant="outline" 
              size="lg" 
              fullWidth 
              className="border-[#38AFD9] text-[#38AFD9] hover:bg-[#38AFD9]/10"
            >
              Criar Conta
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;