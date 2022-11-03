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
}

module.exports = UserAuth;
