require("dotenv").config(); // Carrega variáveis do .env

const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

// ✅ Libera requisições do frontend (localhost:5173)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Middleware para leitura de JSON em todas as rotas (não só auth/users)
app.use(express.json());

// ✅ Servir arquivos públicos da pasta uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Rotas da API
const authRoutes = require("./src/routes/auth.routes");
const documentRoutes = require("./src/routes/document.routes");
const userRoutes = require("./src/routes/user.routes");

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/users", userRoutes);

// ✅ Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 🚀`);
});
