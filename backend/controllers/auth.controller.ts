// Imported packages
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();
const sendResponse = require("../utils/sendResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

type User = {
  name: string;
  username: string;
  email: string;
  safePassword: string;
};

class UserAuth {
  private emailFilter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  public response: Response | null;
  public request: Request | null;

  constructor() {
    this.response = null;
    this.request = null;
  }

  // check if input email is a valid email
  validateEmail(email: string): boolean {
    return Boolean(email.match(this.emailFilter));
  }

  // check if input password is a valid password
  validatePassword(password: string): boolean {
    return Boolean(password.length >= 8);
  }

  // check if input username is a valid username
  validateUsername(username: string) {
    return Boolean(username.length >= 3);
  }

  // check if email already exists in the database
  async checkEmail(email: string) {
    const isUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    return isUser ? true : false;
  }

  // check if username already exists in the database
  async checkUsername(username: string) {
    const isUser = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });
    return isUser ? true : false;
  }

  // Hash password
  async hashPassword(password: string, salt: number = 10) {
    return await bcrypt.hash(password, salt);
  }

  // Verify hashed password
  async verifyPassword(password: string, toCompare: string) {
    return await bcrypt.compare(password, toCompare);
  }

  validate(data: Request, newUser: boolean = true): Promise<User> {
    const { name, username, email, password } = data.body;
    return new Promise(async (resolve, reject) => {
      // validate email
      const isEmail = this.validateEmail(email);
      if (!isEmail) {
        reject("Email is not valid");
      } else {
        async () => {
          const isUser = await this.checkEmail(email);
          if (isUser) {
            reject("Email is already in use :(");
          } else {
            !newUser ?? reject("Email or password is incorrect.");
          }
        };
      }

      // validate username
      const isUsername = this.validateUsername(username);
      if (!isUsername) {
        reject("Username is too short 👉👈. Minimum is 3 characters");
      } else {
        const isUser = await this.checkUsername(username);
        if (isUser) {
          reject("Username is already in use :(");
        }
      }

      // validate password
      const isPassword = this.validatePassword(password);
      if (!isPassword) {
        reject("Password is too short 👉👈. Minimum is 8 characters");
      } else {
        !newUser ??
          (async () => {
            const userPassword = (await prisma.user.findUnique({
              where: {
                email: email,
              },
              select: {
                password: true,
              },
            })) as any;
            const checkCredential = await this.verifyPassword(
              password,
              userPassword?.password,
            );
            if (!checkCredential) {
              reject("Email or password is incorrect.");
            }
          });
      }
      let safePassword: string = !newUser ? null : password;
      resolve({ name, username, email, safePassword });
    });
  }

  async signUp(request: Request, response: Response) {
    this.response = response;
    this.request = request;
    this.validate(request)
      .then(async (result) => {
        const newUser = await prisma.user.create({
          data: {
            name: result.name,
            username: result.username,
            email: result.email,
            password: await this.hashPassword(result.safePassword),
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
}

module.exports = UserAuth;
