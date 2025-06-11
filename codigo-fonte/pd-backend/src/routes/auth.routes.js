const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
