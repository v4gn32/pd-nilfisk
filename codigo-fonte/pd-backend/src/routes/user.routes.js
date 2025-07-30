const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");
const { resetPassword } = require("../controllers/user.controller");

// ✅ Apenas admins podem acessar essa rota
router.post("/", authenticate, isAdmin, userController.createUser);

// ✅ Obter todos os usuários (admin)
router.get("/", authenticate, isAdmin, userController.getAllUsers);

// ✅ Atualizar usuário
router.put("/:id", authenticate, isAdmin, userController.updateUser);

// ✅ Deletar usuário
router.delete("/:id", authenticate, isAdmin, userController.deleteUser);

// ✅ Reset de senha
router.patch("/:id/reset-password", authenticate, authorize(["ADMIN"]), resetPassword);


module.exports = router;
