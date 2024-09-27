import nodemailer from 'nodemailer';

import envVar from '../configs/config.js';

const sendEmail = async function (email, subject, message) {
  const transporter = nodemailer.createTransport({
    host: envVar.smtpHost,
    port: envVar.smtpPort,
    secure: false,
    auth: {
      user: envVar.smtpUsrename,
      pass: envVar.smtpPassword
    }
  });
  return await transporter.sendMail({
    from: envVar.smtpFromEmail,
    to: email,
    subject: subject,
    html: message
  });
};

export default sendEmail;
