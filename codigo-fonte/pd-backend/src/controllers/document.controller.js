const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const { PDFDocument } = require("pdf-lib");
const { sendNewDocumentEmail } = require('../services/emailService');


// 🔤 Função para padronizar nomes (remove acentos, quebra de linha e deixa em caixa alta)
const normalize = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

exports.uploadDocument = async (req, res) => {
  try {
    const { type, month, year, userId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Arquivo não enviado" });
    }

    if (!type || !month || !year || !userId) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const filename = req.file.originalname;
    const tempPath = req.file.path;

    const uploadDir = path.join(__dirname, "..", "uploads");

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
        userId: parseInt(userId),
      },
    });

    res.status(201).json({ message: "Documento enviado com sucesso", document });
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

exports.uploadBulkPayslips = async (req, res) => {
  try {
    const { month, year } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Arquivo PDF não enviado" });
    }

    const tempPath = req.file.path;
    const buffer = fs.readFileSync(tempPath);

    const pdfDoc = await PDFDocument.load(buffer);
    const totalPages = pdfDoc.getPageCount();

    const users = await prisma.user.findMany();

    let processed = 0;
    const uploadDir = path.join(__dirname, "..", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (let i = 0; i < totalPages; i++) {
      const singleDoc = await PDFDocument.create();
      const [page] = await singleDoc.copyPages(pdfDoc, [i]);
      singleDoc.addPage(page);
      const pdfBytes = await singleDoc.save();

      // 📄 Extrai texto da página com pdf-parse
      const extracted = await pdfParse(Buffer.from(pdfBytes));
      const pageText = extracted.text || "";
      const normalizedPageText = normalize(pageText);

      const matchedUser = users.find((u) =>
        normalizedPageText.includes(normalize(u.name))
      );

      if (!matchedUser) {
        console.warn(`❌ Página ${i + 1} — nenhum colaborador encontrado`);
        continue;
      }

      // 📂 Salva arquivo
      const filename = `holerite_${matchedUser.id}_${Date.now()}.pdf`;
      const targetPath = path.join(uploadDir, filename);
      fs.writeFileSync(targetPath, pdfBytes);

      // 💾 Salva no banco
      await prisma.document.create({
        data: {
          type: "HOLERITE",
          filename,
          url: `/uploads/${filename}`,
          month: parseInt(month),
          year: parseInt(year),
          userId: matchedUser.id,
        },
      });

      // ✉️ Envia e-mail para o colaborador
      try {
        await sendNewDocumentEmail(
          matchedUser.email,
          matchedUser.name,
          "HOLERITE",
          month,
          year
        );
        console.log(`📧 E-mail enviado para ${matchedUser.email}`);
      } catch (emailErr) {
        console.warn(`⚠️ Falha ao enviar e-mail para ${matchedUser.email}:`, emailErr.message);
      }

      processed++;
      console.log(`✅ Página ${i + 1} vinculada a ${matchedUser.name}`);
    }

    return res.status(201).json({ message: `${processed} holerites processados com sucesso` });
  } catch (error) {
    console.error("Erro no upload em massa:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};


exports.getMyDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, month, year } = req.query;

    const where = { userId };

    if (type) where.type = type;
    if (month) where.month = parseInt(month);
    if (year) where.year = parseInt(year);

    const documents = await prisma.document.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(documents);
  } catch (error) {
    console.error("Erro ao listar documentos do usuário:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const { type, month, year } = req.query;

    const where = {};

    if (type) where.type = type;
    if (month) where.month = parseInt(month);
    if (year) where.year = parseInt(year);

    const documents = await prisma.document.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(documents);
  } catch (error) {
    console.error("Erro ao listar documentos:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};
exports.downloadDocument = async (req, res) => {
  try {
    const documentId = parseInt(req.params.id);
    const userId = req.user.id;
    const userRole = req.user.role;

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return res.status(404).json({ error: "Documento não encontrado" });
    }

    // 🔐 Permissão: admin pode tudo, usuário comum só seu próprio documento
    if (userRole !== 'ADMIN' && document.userId !== userId) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const filePath = path.join(__dirname, '..', 'uploads', document.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Arquivo não encontrado no servidor" });
    }

    res.download(filePath, document.filename); // envia como download
  } catch (error) {
    console.error("Erro ao fazer download:", error);
    res.status(500).json({ error: "Erro interno ao baixar o documento" });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const documentId = parseInt(req.params.id);

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return res.status(404).json({ error: "Documento não encontrado" });
    }

    // 🧹 Remove o arquivo físico
    const filePath = path.join(__dirname, '..', 'uploads', document.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 🗑️ Remove o registro do banco
    await prisma.document.delete({
      where: { id: documentId },
    });

    res.json({ message: "Documento excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir documento:", error);
    res.status(500).json({ error: "Erro interno ao excluir documento" });
  }
};


