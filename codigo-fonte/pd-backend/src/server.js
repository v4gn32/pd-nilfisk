require('dotenv').config(); // Carrega as variáveis do .env

const express = require('express');
const app = express();

const authRoutes = require('./src/routes/auth.routes');

// Middlewares
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);

// Porta dinâmica
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
