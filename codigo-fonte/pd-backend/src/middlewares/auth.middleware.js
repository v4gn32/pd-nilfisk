const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Autenticação
function authenticate(req, res, next) {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token && req.query.token) {
    token = req.query.token;
  }

  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token inválido" });
  }
}

// ✅ Autorização
function authorize(roles = []) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Acesso negado" });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
