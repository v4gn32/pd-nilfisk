const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.nilfisk.com.br",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendNewDocumentEmail = async (to, name, type, month, year) => {
  try {
    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    const subject = `📄 Novo documento disponível: ${type}`;
    const html = `
    <p>Olá <strong>${name}</strong>,</p>
    <p>Um novo documento do tipo <strong>${type}</strong> foi adicionado ao seu portal para o mês <strong>${
      monthNames[month - 1]
    }/${year}</strong>.</p>
    <p>Você pode acessá-lo diretamente no portal Nilfisk.</p>
    <br />
    <p>Atenciosamente,<br />Equipe Nilfisk</p>
  `;

    await transporter.sendMail({
      from: `"Portal Nilfisk" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`E-mail enviado para ${to} com sucesso!`);
  } catch (error) {
    console.error(`❌ Erro ao enviar e-mail para ${to}:`, error);
    throw new Error("Falha ao enviar e-mail de notificação");
  }
};
