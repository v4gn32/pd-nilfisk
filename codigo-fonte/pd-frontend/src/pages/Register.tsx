import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, KeyRound, AlertCircle } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';

interface RegisterProps {
  onRegister: (name: string, email: string, password: string) => void;
  isLoading: boolean;
  error: string | null;
}

const Register: React.FC<RegisterProps> = ({ onRegister, isLoading, error }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(name, email, password);
  };

  return (
    <div className="min-h-screen bg-[#28313F] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Nilfisk</h1>
          <p className="text-gray-400 mt-2">Portal de Documentos</p>
        </div>
        
        <Card className="bg-white/10 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-center text-white">Criar Conta</CardTitle>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md flex items-start">
                <AlertCircle className="text-red-400 mr-2 flex-shrink-0 mt-0.5\" size={16} />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    label="Nome Completo"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    fullWidth
                    required
                    className="bg-white/5 border-gray-700 text-white placeholder-gray-500"
                  />
                  <User className="absolute right-3 top-9 text-gray-500" size={18} />
                </div>
                
                <div className="relative">
                  <Input
                    label="E-mail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    fullWidth
                    required
                    className="bg-white/5 border-gray-700 text-white placeholder-gray-500"
                  />
                  <Mail className="absolute right-3 top-9 text-gray-500" size={18} />
                </div>
                
                <div className="relative">
                  <Input
                    label="Senha"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Crie uma senha"
                    fullWidth
                    required
                    className="bg-white/5 border-gray-700 text-white placeholder-gray-500"
                  />
                  <KeyRound className="absolute right-3 top-9 text-gray-500" size={18} />
                </div>
                
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                  className="bg-[#38AFD9] hover:bg-[#38AFD9]/90 text-white"
                >
                  Cadastrar
                </Button>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Já tem uma conta? <Link to="/login" className="text-[#38AFD9] hover:underline">Entrar</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;