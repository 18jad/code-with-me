// Imported packages
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();
const sendResponse = require("../utils/sendResponse");

type User = {
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
    });
    return isUser ? true : false;
  }
}

module.exports = UserAuth;
