// src/pages/Login.tsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, KeyRound, AlertCircle, Eye, EyeOff } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/Card";

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  isLoading: boolean;
  error: string | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            <CardTitle className="text-center text-white">Entrar</CardTitle>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md flex items-start">
                <AlertCircle
                  className="text-red-400 mr-2 flex-shrink-0 mt-0.5"
                  size={16}
                />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
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
                  <Mail
                    className="absolute right-3 top-9 text-gray-500"
                    size={18}
                  />
                </div>

                <div className="relative">
                  <Input
                    label="Senha"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    fullWidth
                    required
                    className="bg-white/5 border-gray-700 text-white placeholder-gray-500 pr-20"
                  />
                  <KeyRound
                    className="absolute right-12 top-9 text-gray-500"
                    size={18}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-200 transition-colors focus:outline-none"
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                  className="bg-[#38AFD9] hover:bg-[#38AFD9]/90 text-white"
                >
                  Entrar
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-[#38AFD9] hover:underline">
                Cadastre-se
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
