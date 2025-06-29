require("dotenv").config(); // Carrega variáveis do .env

const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

// ✅ Servir arquivos públicos da pasta uploads (PDFs)
app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));

// ✅ Liberar frontend para conectar com backend
app.use(
  cors({
    origin: [
      "http://localhost:5173", // manter para testes locais
      "https://pdnilfisk.com", // novo: liberar produção
    ],
    credentials: true,
  })
);

// ✅ Middleware para aceitar JSON nas requisições
app.use(express.json());

// ✅ Rotas da API
const authRoutes = require("./src/routes/auth.routes");
const documentRoutes = require("./src/routes/document.routes");
const userRoutes = require("./src/routes/user.routes");

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/users", userRoutes);

// ✅ Iniciar servidor na porta .env ou 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 🚀`);
});
