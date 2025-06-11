const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Dados obrigatórios não preenchidos' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role.toUpperCase()
      }
    });

    res.status(201).json({ message: 'Usuário criado com sucesso', user: newUser });
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};
