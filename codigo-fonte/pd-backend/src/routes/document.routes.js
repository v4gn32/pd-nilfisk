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

module.exports = router;
