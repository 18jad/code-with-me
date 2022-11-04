import { resetPassworHTML } from "./../config/resetPasswordHTML";
// Imported packages
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();
const sendResponse = require("../utils/sendResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../config/emailTransporter.config");
const crypto = require("crypto");

// Variables
const jwt_secret = process.env.JWT_SECRET_KEY;
const jwt_expires = process.env.JWT_EXPIRES_IN;

// Type
type User = {
  id?: Number;
  name: string;
  username: string;
  email: string;
  password: string;
};

// UserAuth class, contains validation, login and register methods
class UserAuth {
  private emailFilter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  public response: Response | null;
  public request: Request | null;

  constructor() {
    this.response = null;
    this.request = null;
  }

  /**
   * @description Check if email is valid (regex pattern)
   * @param email {string}
   * @returns {Boolean}
   */
  validateEmail(email: string): boolean {
    return Boolean(email.match(this.emailFilter));
  }

  /**
   * @description Check if password is valid (length >= 8)
   * @param password {string}
   * @returns {Boolean}
   */
  validatePassword(password: string): boolean {
    return Boolean(password.length >= 8);
  }

  /**
   * @description Check is username is valid (length >= 3)
   * @param username {string}
   * @returns {Boolean}
   */
  validateUsername(username: string) {
    return Boolean(username.length >= 3);
  }

  /**
   * @description Checks if email already exists in the database
   * @param email {string}
   * @returns {Promise<boolean>}
   */
  async checkEmail(email: string) {
    const isUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
      select: {
        id: true,
        password: false,
      },
    });
    return isUser ? true : false;
  }

  /**
   * @description Checks if the username already exists in the database
   * @param username {string}
   * @returns {Promise<boolean>}
   */
  async checkUsername(username: string) {
    const isUser = await prisma.user.findFirst({
      where: {
        username: username,
      },
      select: {
        id: true,
        password: false,
      },
    });
    return isUser ? true : false;
  }

  /**
   * @description Hash a given password
   * @param password {string}
   * @param salt {number} @default 10
   * @returns {Promise<string>}
   */
  async hashPassword(password: string, salt: number = 10) {
    return await bcrypt.hash(password, salt);
  }

  /**
   * @description Compare given password against hashed password
   * @param password {string}
   * @param toCompare {string}
   * @returns {Promise<boolean>}
   */
  async verifyPassword(password: string, toCompare: string) {
    return await bcrypt.compare(password, toCompare);
  }

  /**
   * @description Checks if the user inputs are valid, and if the user already exists in the database
   * @param data {Request}
   * @returns {Promise<User>}
   */
  validateRegister(data: Request): Promise<User> {
    const { name, username, email, password } = data.body;
    return new Promise(async (resolve, reject) => {
      // Validate email
      const isEmail = this.validateEmail(email);
      if (!isEmail) {
        reject("Email is not valid");
      } else {
        const isUser = await this.checkEmail(email);
        if (isUser) {
          reject("Email is already in use :(");
        }
      }

      // Validate username
      const isUsername = this.validateUsername(username);
      if (!isUsername) {
        reject("Username is too short 👉👈. Minimum is 3 characters");
      } else {
        const isUser = await this.checkUsername(username);
        if (isUser) {
          reject("Username is already in use :(");
        }
      }

      // Validate password
      const isPassword = this.validatePassword(password);
      if (!isPassword) {
        reject("Password is too short 👉👈. Minimum is 8 characters");
      }
      resolve({ name, username, email, password });
    });
  }

  /**
   * @description Checks if the user exists in the database and if the password is correct
   * @param data {Request}
   * @returns {Promise<User>}
   */
  validateLogin(data: Request): Promise<User> {
    const { email, password } = data.body;
    return new Promise(async (resolve, reject) => {
      // Validate email
      const isEmail = this.validateEmail(email);
      if (!isEmail) {
        reject("Email is not valid");
      } else {
        const user = (await prisma.user.findUnique({
          where: {
            email: email,
          },
        })) as User;
        // Check if user is found
        if (user) {
          // Verify password
          const checkCredential = await this.verifyPassword(
            password,
            user?.password,
          );
          if (!checkCredential) {
            reject("Email or password is incorrect");
          } else {
            // Empty password before sending response
            user.password = "";
            resolve(user);
          }
        } else {
          reject("Email or password is incorrect");
        }
      }
    });
  }

  /**
   * @description Register a new user after validating it using validateRegister method
   * @param request {Request}
   * @param response {Response}
   */
  async register(request: Request, response: Response) {
    this.response = response;
    this.request = request;
    this.validateRegister(request)
      .then(async (result) => {
        const newUser = await prisma.user.create({
          data: {
            name: result.name,
            username: result.username,
            email: result.email,
            password: await this.hashPassword(result.password),
            avatar: `https://avatars.dicebear.com/api/initials/${result.username}.svg`, // generate random avatar
          },
        });
        if (newUser) {
          sendResponse(response, true, "User created successfully");
        } else {
          sendResponse(response, false, "Something went wrong", {
            log: newUser,
          });
        }
      })
      .catch((error) => {
        sendResponse(response, false, "Validation Failed", { error: error });
      });
  }

  /**
   * @description Login user after validating it using validateLogin method
   * @param request {Request}
   * @param response {Response}
   */
  async login(request: Request, response: Response) {
    this.response = response;
    this.request = request;
    this.validateLogin(request)
      .then(async (result) => {
        try {
          const token = jwt.sign(
            {
              id: result.id,
              name: result.name,
              username: result.username,
              email: result.email,
            },
            jwt_secret,
            {
              expiresIn: jwt_expires,
            },
          );
          sendResponse(response, true, "Sign in successfully done.", {
            user: {
              result,
              authToken: token,
            },
          });
        } catch (error) {
          sendResponse(response, false, "Something went wrong", {
            error: error,
          });
        }
      })
      .catch((error) => {
        sendResponse(response, false, "Validation Failed", { error: error });
      });
  }

  async generateResetPassword(request: Request, response: Response) {
    this.response = response;
    this.request = request;
    const { email } = request.body;
    const isEmail = this.validateEmail(email);
    if (!isEmail) {
      sendResponse(response, false, "Email is not valid");
    } else {
      const user = (await prisma.user.findUnique({
        where: {
          email: email,
        },
      })) as User;
      if (user) {
        const token = jwt.sign(
          {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
          },
          jwt_secret,
          {
            expiresIn: "1d",
          },
        );
        // Update user database reset token
        const updatedUser = await prisma.user.update({
          where: {
            email: email,
          },
          data: {
            resetToken: token,
          },
        });

        if (updatedUser) {
          const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "CodeWithMe | Reset Password",
            html: resetPassworHTML(token),
          };
          sendEmail(mailOptions, (error: any, info: any) => {
            if (error) {
              sendResponse(response, false, "Something went wrong", {
                error: error,
              });
            } else {
              sendResponse(
                response,
                true,
                "Reset passsword email sent successfully",
              );
            }
          });
        } else {
          sendResponse(
            response,
            false,
            "Something went wrong. Please try again",
          );
        }
      } else {
        sendResponse(response, false, "Email is not registered");
      }
    }
  }

  async validateResetToken(request: Request, response: Response) {
    this.response = response;
    this.request = request;
    const { token } = request.body;
    const user = await prisma.user.findUnique({
      where: {
        resetToken: token,
      },
    });
    if (user) {
      sendResponse(response, true, "Token is valid");
    } else {
      sendResponse(response, false, "Token is invalid");
    }
  }
}

module.exports = UserAuth;
