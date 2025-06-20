const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const documentController = require("../controllers/document.controller");
const authenticate = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");

// 🗂️ Configuração de armazenamento temporário com multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "temp"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/**
 * ROTAS DE DOCUMENTOS
 */

// 📤 Upload individual de documento (somente admin)
router.post(
  "/upload",
  authenticate,
  isAdmin,
  upload.single("file"),
  documentController.uploadDocument
);

// 📤 Upload em massa de holerites (somente admin)
router.post(
  "/bulk-holerites",
  authenticate,
  isAdmin,
  upload.single("file"),
  documentController.uploadBulkPayslips
);

// 📄 Listar documentos do usuário logado
router.get("/me", authenticate, documentController.getMyDocuments);

// 📄 Listar todos os documentos (admin)
router.get("/", authenticate, isAdmin, documentController.getAllDocuments);

// 🗑️ Excluir documento por ID (admin)
router.delete("/:id", authenticate, isAdmin, documentController.deleteDocument);

// 👁️ Visualizar documento (abertura direta no navegador)
router.get("/:id/view", authenticate, documentController.viewDocument);

// 📥 Download de documento por ID
router.get("/:id/download", authenticate, documentController.downloadDocument);

module.exports = router;
