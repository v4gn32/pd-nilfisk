const express = require('express');
const router = express.Router();

const { register, login, getProfile, changePassword } = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// Rota pública para cadastro
router.post('/register', register);

// Rota pública para login
router.post('/login', login);

// Rota protegida para obter perfil
router.get('/profile', authenticate, getProfile);

// 🔐 Rota protegida para alteração de senha
router.patch('/change-password', authenticate, changePassword);

// (Opcional) Alias da rota de perfil
// router.get('/me', authenticate, getProfile);

module.exports = router;
