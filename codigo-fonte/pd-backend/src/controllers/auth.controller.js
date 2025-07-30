const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// 🔐 Cadastro de novo usuário
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const formattedName = name.trim().toUpperCase();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'E-mail já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: formattedName,
        email,
        password: hashedPassword,
        role: 'COMMON',
      },
    });

    // Gera token JWT após cadastro
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(201).json({
      message: 'Usuário registrado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// 🔐 Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// 👤 Obter perfil do usuário autenticado
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Extraído do token no middleware

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};



// 🔐 Altera a senha do usuário autenticado
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const passwordValid = await bcrypt.compare(currentPassword, user.password);
    if (!passwordValid)
      return res.status(401).json({ error: "Senha atual incorreta" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return res.json({ message: "Senha alterada com sucesso!" });
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    return res.status(500).json({ error: "Erro interno ao alterar a senha" });
  }
};
