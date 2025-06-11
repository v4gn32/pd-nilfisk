const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticate = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/isAdmin.middleware');

// ✅ Apenas admins podem acessar essa rota
router.post('/', authenticate, isAdmin, userController.createUser);

module.exports = router;
