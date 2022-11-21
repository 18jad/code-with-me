// Imported packages
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

// Configuration
const username = process.env.EMAIL_USERNAME;
const password = process.env.EMAIL_PASSWORD;

// SMTP transporter object
const transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    tls: { rejectUnauthorized: false },
    auth: {
      user: username,
      pass: password,
    },
  }),
);

/**
 * @description Send email using specified mail options
 * @param mailOptions
 * @param cb
 * @returns {Promise<void>}
 * @throws {Error}
 * @example
 * sendEmail({
 *    from: "example@example.com",
 *    to: "example@example.com",
 *    subject: "Example subject",
 *    html: "<h1>Example HTML</h1>",
 *  }, (error, info) => {
 *    if (error) {
 *      console.log(error);
 *    } else {
 *      console.log(info);
 *  }
 */
const sendEmail = (mailOptions: Object, cb: Function) => {
  transporter.sendMail(mailOptions, cb);
};

module.exports = sendEmail;
