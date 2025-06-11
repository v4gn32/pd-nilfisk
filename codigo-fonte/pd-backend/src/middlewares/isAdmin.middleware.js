// src/middlewares/isAdmin.middleware.js
module.exports = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acesso negado: apenas administradores podem fazer isso.' });
  }
  next();
};
