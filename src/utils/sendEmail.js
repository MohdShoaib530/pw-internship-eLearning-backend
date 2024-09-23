import nodemailer from 'nodemailer';

import envVar from '../config/config.js';

const sendEamil = async function (subject, message, email) {
  const transporter = nodemailer.createTransport({
    host: envVar.smtpHost,
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: envVar.smtpUsrename,
      pass: envVar.smtpPassword
    }
  });

  return transporter.sendMail({
    to: 'moshoaib9621910125@gmail.com',
    from: envVar.smtpFromEmail,
    subject,
    html: message
  });
};

export default sendEamil;
