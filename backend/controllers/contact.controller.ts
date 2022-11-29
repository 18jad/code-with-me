const AuthController = require("./auth.controller");
const authController = new AuthController();
import { Request } from "express";
import { contactHTML } from "../views/contact.html";
const sendEmail = require("../utils/emailTransporter");
const sendResponse = require("../utils/sendResponse");

// Interfaces
interface IEmail {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface IMailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const validateEmail = (email: string): Boolean => {
  return authController.validateEmail(email);
};

class ContactController {
  /**
   * @description Validate name length
   * @param name {string} - Name of the sender
   * @returns {Boolean} - Returns true if name is valid
   */
  validateName(name: string): Boolean {
    return Boolean(name && Number(name?.length) > 2);
  }

  /**
   * @description Validate subject length
   * @param subject {string} - Subject of the email
   * @returns {Boolean} - Returns true if subject is valid
   */
  validateSubject(subject: string): Boolean {
    return Boolean(subject && Number(subject?.length) > 5);
  }

  /**
   * @description Validate message length
   * @param message {string} - Message of the email
   * @returns {Boolean} - Returns true if message is valid
   */
  valideMessage(message: string): Boolean {
    return Boolean(message && Number(message?.length) > 10);
  }

  /**
   * @description Validate email
   * @param data {Request} - Request data
   * @returns {Promise} - Returns a promise
   */
  validate(data: Request): Promise<IEmail> {
    const { name, email, subject, message } = data.body as IEmail;
    return new Promise((resolve, reject) => {
      if (this.validateName(name)) {
        if (validateEmail(email)) {
          if (this.validateSubject(subject)) {
            if (this.valideMessage(message)) {
              resolve({ name, email, subject, message });
            } else {
              reject({ message: "Message is too short" });
            }
          } else {
            reject({ message: "Subject is too short" });
          }
        } else {
          reject({ message: "Invalid email" });
        }
      } else {
        reject({ message: "Name is too short" });
      }
    });
  }

  /**
   * @description Send contact me email
   * @param request {Request} - Request data
   * @param response {Response} - Response data
   */
  sendEmail(request: Request, response: Response): void {
    this.validate(request)
      .then((result) => {
        const { name, email, subject, message } = result as IEmail;
        const email_username = process.env.EMAIL_USERNAME;
        const email_password = process.env.EMAIL_PASSWORD;
        if (email_username && email_password) {
          const mailOptions: IMailOptions = {
            from: email_username,
            to: email_password,
            subject: subject,
            html: contactHTML(name, email, message),
          };
          sendEmail(mailOptions, (error: any, info: any) => {
            if (error) {
              sendResponse(response, false, "Something went wrong", {
                error: error,
              });
            } else {
              sendResponse(response, true, "Email sent successfully");
            }
          });
        } else {
          sendResponse(response, false, "Something went wrong");
        }
      })
      .catch(({ message }) => {
        sendResponse(response, false, message);
      });
  }
}

module.exports = ContactController;
