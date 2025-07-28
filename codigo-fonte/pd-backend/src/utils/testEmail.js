require("dotenv").config();
const path = require("path");

// Atualize esse caminho conforme a localização real do seu arquivo que exporta `sendNewDocumentEmail`
const { sendNewDocumentEmail } = require("../services/emailService.js");

(async () => {
  try {
    const emailDestino = "msantos@nilfisk.com"; // coloque aqui um e-mail real para teste
    const nomeUsuario = "Michel Santos";
    const tipoDocumento = "Holerite";
    const mes = 7; // Julho
    const ano = 2025;

    await sendNewDocumentEmail(
      emailDestino,
      nomeUsuario,
      tipoDocumento,
      mes,
      ano
    );
    console.log("✅ E-mail de teste enviado com sucesso.");
  } catch (error) {
    console.error("❌ Erro ao enviar o e-mail de teste:", error.message);
  }
})();
