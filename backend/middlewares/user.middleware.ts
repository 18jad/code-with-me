// Importede packages
const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/sendResponse");
import { NextFunction, Request, Response } from "express";

// Variables
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

/**
 * @description Middleware to check if user is authenticated before accessing a route
 * @param request {Request}
 * @param response {Response}
 * @param next {NextFunction}
 */
const authMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const userAccessToken = request.headers.authorization?.split(" ")[1];
  try {
    const _verifyToken = jwt.verify(userAccessToken, JWT_SECRET_KEY);
    if (_verifyToken) {
      next();
    } else {
      sendResponse(response, false, `Something went wrong`);
    }
  } catch (error) {
    // Unvalid jwt OR Request
    sendResponse(response, false, `Unauthorized please try again later`);
  }
};

module.exports = authMiddleware;
