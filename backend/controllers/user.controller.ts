// Imported packages
import { PrismaClient } from "@prisma/client";
import { Request } from "express";
const prisma = new PrismaClient();
const sendResponse = require("../utils/sendResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserController {
  /**
   * @description Extract jwt token from request header
   * @param request {Request}
   * @returns {string} token
   */
  private getToken(request: Request) {
    return request.headers.authorization?.split(" ")[1];
  }

  /**
   * @description Decode jwt token and return user info
   * @param request {Request}
   * @returns {Object} user details stored in jwt token
   */
  private decodeToken(request: Request) {
    const token = this.getToken(request);
    try {
      return jwt.decode(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      return error;
    }
  }
}

module.exports = UserController;
