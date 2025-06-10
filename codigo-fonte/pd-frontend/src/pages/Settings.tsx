import React, { useState } from 'react';
import { User, Bell, Lock, Globe, Moon, Sun } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { useUserSettings } from '../contexts/UserSettingsContext';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { settings, updateSettings, resetSettings } = useUserSettings();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordError('Erro ao alterar a senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#28313F] mb-6">Configurações</h1>

      <div className="grid gap-6">
        {/* Perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} />
              Perfil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Nome Completo"
                  defaultValue={user?.name}
                  disabled
                  fullWidth
                />
                <Input
                  label="CPF"
                  defaultValue={user?.cpf}
                  disabled
                  fullWidth
                />
              </div>
              <Input
                label="E-mail"
                type="email"
                defaultValue={user?.email}
                disabled
                fullWidth
              />
            </form>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell size={20} />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notificações por E-mail</h3>
                  <p className="text-sm text-gray-500">
                    Receba atualizações sobre novos documentos
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => updateSettings({
                      notifications: { ...settings.notifications, email: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#38AFD9]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#38AFD9]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notificações Push</h3>
                  <p className="text-sm text-gray-500">
                    Receba notificações no navegador
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => updateSettings({
                      notifications: { ...settings.notifications, push: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#38AFD9]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#38AFD9]"></div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aparência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {settings.theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
              Aparência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tema
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => updateSettings({ theme: 'light' })}
                    className={`
                      p-4 rounded-lg border-2 flex items-center gap-2
                      ${settings.theme === 'light' 
                        ? 'border-[#38AFD9] text-[#38AFD9] bg-[#38AFD9]/5' 
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Sun size={18} />
                    Claro
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSettings({ theme: 'dark' })}
                    className={`
                      p-4 rounded-lg border-2 flex items-center gap-2
                      ${settings.theme === 'dark' 
                        ? 'border-[#38AFD9] text-[#38AFD9] bg-[#38AFD9]/5' 
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Moon size={18} />
                    Escuro
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Idioma */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe size={20} />
              Idioma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selecione o Idioma
              </label>
              <select
                value={settings.language}
                onChange={(e) => updateSettings({ language: e.target.value as 'pt-BR' | 'en' })}
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38AFD9]"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en">English</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={20} />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Alterar Senha</h3>
                <form onSubmit={handlePasswordChange} className="grid gap-4">
                  <Input
                    type="password"
                    label="Senha Atual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Digite sua senha atual"
                    fullWidth
                  />
                  <Input
                    type="password"
                    label="Nova Senha"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Digite a nova senha"
                    fullWidth
                  />
                  <Input
                    type="password"
                    label="Confirmar Nova Senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme a nova senha"
                    error={passwordError}
                    fullWidth
                  />
                  <Button type="submit" isLoading={loading}>
                    Alterar Senha
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={resetSettings}
          >
            Restaurar Padrões
          </Button>
          <Button
            onClick={handleSaveProfile}
            isLoading={loading}
          >
            Salvar Alterações
          </Button>
        </div>

        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg">
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;