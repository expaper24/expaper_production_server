const nodemailer = require("nodemailer");
const { getHtml } = require("./htmlTemplate");
const sendMail = async (username, email, hashedId, res, isVerification) => {
  try {
    const htmlTemplate = getHtml(username, hashedId, isVerification);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Mail From ExPaper Admin",
      html: htmlTemplate,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(400).json({
          status: 'failed',
          message: error.message,
        });
      } else {
        console.log("Email sent " + info.response);
        res.status(201).json({
          status: "success",
          message: "Mail Sent",
        });
      }
    });
  } catch (e) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};

module.exports = sendMail;
