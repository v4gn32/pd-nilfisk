require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require("./src/routes/auth.routes");

app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/auth", authRoutes);

// Teste
app.get("/", (req, res) => {
  res.send("PD Nilfisk backend funcionando!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
