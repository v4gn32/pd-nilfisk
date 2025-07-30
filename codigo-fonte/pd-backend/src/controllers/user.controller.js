const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

// ✅ Criar novo usuário (ADMIN)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ error: "Dados obrigatórios não preenchidos" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim().toUpperCase(),
        email,
        password: hashedPassword,
        role: role.toUpperCase(),
      },
    });

    res
      .status(201)
      .json({ message: "Usuário criado com sucesso", user: newUser });
  } catch (error) {
    console.error("Erro ao criar usuário admin:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

// ✅ Obter todos os usuários (ADMIN)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { name: "asc" },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro interno ao buscar usuários" });
  }
};

// ✅ Atualizar usuário
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    const updated = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email, role },
    });

    return res.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
};

// ✅ Deletar usuário
exports.deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (user.email === "admin@nilfisk.com") {
      return res
        .status(403)
        .json({ message: "Esse usuário não pode ser excluído." });
    }

    // Verifica se o usuário tem documentos vinculados
    const hasDocuments = await prisma.document.findFirst({
      where: { userId: id },
    });

    if (hasDocuments) {
      return res.status(400).json({
        message:
          "Este usuário possui documentos vinculados e não pode ser excluído.",
      });
    }

    await prisma.user.delete({ where: { id } });

    return res.status(204).send(); // Sucesso sem conteúdo
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return res
      .status(500)
      .json({ message: "Erro interno ao excluir usuário." });
  }
};

// Resete de senha
exports.resetPassword = async (req, res) => {
  const userId = Number(req.params.id);
  const novaSenha = "123456";

  try {
    const hashedPassword = await bcrypt.hash(novaSenha, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.json({ message: "Senha redefinida com sucesso para 123456" });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    res.status(500).json({ error: "Erro ao redefinir a senha" });
  }
};
