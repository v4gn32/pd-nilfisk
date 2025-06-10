import React, { useState } from 'react';
import { User as UserIcon, Pencil, Trash2, Search, Plus, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { User } from '../types';

interface UsersProps {
  users: User[];
  onDeleteUser?: (id: number) => void;
  onEditUser?: (user: User) => void;
  onAddUser?: (user: Omit<User, 'id'>) => void;
}

interface UserFormData {
  name: string;
  email: string;
  role: 'ADMIN' | 'COMMON';
  password: string;
}

const Users: React.FC<UsersProps> = ({ users, onDeleteUser, onEditUser, onAddUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'COMMON',
    password: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<UserFormData>>({});

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const errors: Partial<UserFormData> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'E-mail inválido';
    }
    
    if (!editingUser && !formData.password.trim()) {
      errors.password = 'Senha é obrigatória';
    } else if (!editingUser && formData.password.length < 6) {
      errors.password = 'Senha deve ter no mínimo 6 caracteres';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (editingUser) {
      onEditUser?.({
        ...editingUser,
        name: formData.name,
        email: formData.email,
        role: formData.role
      });
    } else {
      onAddUser?.({
        name: formData.name,
        email: formData.email,
        role: formData.role
      });
    }
    
    handleCloseModal();
  };

  const handleDelete = (user: User) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
      onDeleteUser?.(user.id);
    }
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        password: ''
      });
      setEditingUser(user);
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'COMMON',
        password: ''
      });
      setEditingUser(null);
    }
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'COMMON',
      password: ''
    });
    setFormErrors({});
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#28313F]">Gerenciamento de Usuários</h1>
        <Button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          Novo Usuário
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              fullWidth
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredUsers.map(user => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-[#28313F]/10">
                    <UserIcon className="text-[#28313F]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#28313F]">{user.name}</h3>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>{user.email}</p>
                      <p className="inline-flex items-center">
                        <span className={`
                          px-2 py-1 rounded-full text-xs
                          ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}
                        `}>
                          {user.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenModal(user)}
                    className="text-gray-500 hover:text-[#28313F]"
                  >
                    <Pencil size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(user)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <UserIcon className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum usuário encontrado</h3>
            <p className="text-gray-500">
              Tente ajustar sua busca ou adicione novos usuários.
            </p>
          </div>
        )}
      </div>

      {/* Modal de Adicionar/Editar Usuário */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-[#28313F]"
              >
                <X size={18} />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nome Completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={formErrors.name}
                  fullWidth
                />
                
                <Input
                  label="E-mail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={formErrors.email}
                  fullWidth
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Usuário
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'ADMIN' | 'COMMON' })}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38AFD9]"
                  >
                    <option value="COMMON">Usuário Comum</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
                
                {!editingUser && (
                  <Input
                    label="Senha"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    error={formErrors.password}
                    fullWidth
                  />
                )}
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Users;