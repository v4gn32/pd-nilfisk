const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');

exports.uploadDocument = async (req, res) => {
  try {
    const { type, month, year, userId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Arquivo não enviado' });
    }

    if (!type || !month || !year || !userId) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const filename = req.file.originalname;
    const tempPath = req.file.path;

    const uploadDir = path.join(__dirname, '..', 'uploads');

    // 🛡️ Garante que a pasta uploads/ exista
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const targetPath = path.join(uploadDir, filename);
    fs.renameSync(tempPath, targetPath);

    const fileUrl = `/uploads/${filename}`;

    const document = await prisma.document.create({
      data: {
        type,
        filename,
        url: fileUrl,
        month: parseInt(month),
        year: parseInt(year),
        userId: parseInt(userId)
      }
    });

    res.status(201).json({ message: 'Documento enviado com sucesso', document });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};
