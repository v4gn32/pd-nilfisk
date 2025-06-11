require('dotenv').config(); // Carrega as variáveis do .env

const express = require('express');
const app = express();
const path = require('path');

const authRoutes = require('./src/routes/auth.routes');
const documentRoutes = require('./src/routes/document.routes');
const userRoutes = require('./src/routes/user.routes');

// Middleware apenas onde precisa
app.use('/api/auth', express.json());
app.use('/api/users', express.json()); // ✅ necessário para criar usuários via JSON

// Linha para servir os arquivos públicos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes);

// Porta dinâmica
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}🚀`);
});
