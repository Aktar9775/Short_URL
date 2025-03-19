const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
     host:'smtp.gmail.com',
     port:'465',
      auth: {
        user: 'sohelaktar9775@gmail.com',
        pass: 'xvko ackp mgjt mcwi'
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const info = await transporter.sendMail({
      from: '"URL Shortner"',
      to,
      subject,
      text,
    });

   
  } catch (error) {
    console.error(` Error sending email: ${error.message}`);
    throw new Error('Email sending failed');
  }
};

module.exports = sendEmail;
