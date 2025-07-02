import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, KeyRound, AlertCircle } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/Card";
import { useAuth } from "../contexts/AuthContext";

const Login: React.FC = () => {
  const { login, isAuthenticated, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-[#28313F] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Nilfisk</h1>
          <p className="text-gray-400 mt-2">Portal de Documentos</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border border-gray-700">
          <CardHeader>
            <CardTitle className="text-center text-white">Entrar</CardTitle>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-900/40 border border-red-700 rounded-md flex items-start">
                <AlertCircle className="text-red-400 mr-2 mt-0.5" size={16} />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  label="E-mail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  required
                  autoComplete="email"
                  fullWidth
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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                  autoComplete="current-password"
                  fullWidth
                  className="bg-white/5 border-gray-700 text-white placeholder-gray-500"
                />
                <KeyRound
                  className="absolute right-3 top-9 text-gray-500"
                  size={18}
                />
              </div>

              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                className="bg-[#38AFD9] hover:bg-[#38AFD9]/90 text-white"
              >
                Entrar
              </Button>
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
