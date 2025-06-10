import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  try {
    const updated = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email, role },
    });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id: parseInt(id) } });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};
