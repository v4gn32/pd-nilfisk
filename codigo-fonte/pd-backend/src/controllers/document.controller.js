import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
const prisma = new PrismaClient();

export const uploadDocument = async (req, res) => {
  const { type, month, year, userId } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'Arquivo não enviado' });

  try {
    const saved = await prisma.document.create({
      data: {
        type,
        month: parseInt(month),
        year: parseInt(year),
        filename: file.filename,
        url: `/uploads/${file.filename}`,
        userId: parseInt(userId)
      }
    });
    return res.status(201).json(saved);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao salvar documento' });
  }
};