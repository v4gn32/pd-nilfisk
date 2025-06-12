const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const documentController = require('../controllers/document.controller');
const authenticate = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/isAdmin.middleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'temp')); // pasta temporária
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // nome com timestamp
  }
});

const upload = multer({ storage });

// 🔐 Rota protegida por autenticação
router.post(
  '/upload',
  authenticate,
  isAdmin, // ✅ adiciona aqui!
  upload.single('file'),
  documentController.uploadDocument
);

// 📤 Upload em massa de holerites (PDF com várias páginas)
router.post(
  '/bulk-holerites',
  authenticate,
  isAdmin,
  upload.single('file'),
  documentController.uploadBulkPayslips
);

// Listar documentos do usuário logado
router.get('/me', authenticate, documentController.getMyDocuments);

// Listar todos os documentos (com filtros) — somente ADMIN
router.get('/', authenticate, isAdmin, documentController.getAllDocuments);

// ❌ Excluir documento (somente admin)
router.delete('/:id', authenticate, isAdmin, documentController.deleteDocument);


module.exports = router;
