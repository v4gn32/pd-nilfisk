const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendNewDocumentEmail = async (to, name, type, month, year) => {
  await transporter.sendMail({
    from: '"Nilfisk RH" <no-reply@nilfisk.com>',
    to,
    subject: `Novo documento disponível: ${type}`,
    html: `<p>Olá, ${name},</p>
      <p>Um novo documento (${type}) referente a <strong>${month}/${year}</strong> foi disponibilizado no portal.</p>
      <p>Acesse sua conta para visualizar.</p>
      <p>Equipe Nilfisk</p>`
  });
};
