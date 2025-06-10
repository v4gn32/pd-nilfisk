import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: "Email já cadastrado" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return res
      .status(201)
      .json({
        message: "Usuário criado com sucesso",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    return res.status(500).json({ error: "Erro no servidor" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Senha incorreta" });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res
      .status(200)
      .json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    return res.status(500).json({ error: "Erro no login" });
  }
};
