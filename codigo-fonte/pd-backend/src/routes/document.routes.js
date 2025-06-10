import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Configuração do multer (armazenamento local temporário)
const upload = multer({ dest: 'uploads/' });

// 🔹 GET: Listar documentos com filtros
router.get('/', async (req, res) => {
  try {
    const { type, month, year, userId } = req.query;

    const filters = {
      ...(type && type !== 'ALL' ? { type } : {}),
      ...(month ? { month: parseInt(month) } : {}),
      ...(year ? { year: parseInt(year) } : {}),
      ...(userId ? { userId: parseInt(userId) } : {}),
    };

    const documents = await prisma.document.findMany({
      where: filters,
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(documents);
  } catch (err) {
    console.error('Erro ao buscar documentos:', err);
    res.status(500).json({ error: 'Erro ao buscar documentos' });
  }
});

// 🔹 POST: Upload de novo documento
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { type, month, year, userId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Arquivo não enviado' });
    }

    // Salvar metadados no banco
    const document = await prisma.document.create({
      data: {
        filename: file.originalname,
        filepath: file.path,
        type,
        month: parseInt(month),
        year: parseInt(year),
        userId: parseInt(userId),
        createdAt: new Date()
      }
    });

    res.status(201).json(document);
  } catch (err) {
    console.error('Erro no upload:', err);
    res.status(500).json({ error: 'Erro ao fazer upload do documento' });
  }
});

// 🔹 GET: Baixar documento por ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const document = await prisma.document.findUnique({ where: { id } });

    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    const filePath = path.resolve(document.filepath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Arquivo não encontrado no servidor' });
    }

    res.download(filePath, document.filename);
  } catch (err) {
    console.error('Erro ao baixar documento:', err);
    res.status(500).json({ error: 'Erro ao baixar documento' });
  }
});

export default router;
