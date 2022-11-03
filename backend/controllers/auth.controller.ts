// Imported packages
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();
const sendResponse = require("../utils/sendResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      select: {
        id: true,
        password: false,
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
      select: {
        id: true,
        password: false,
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
}

module.exports = UserAuth;
