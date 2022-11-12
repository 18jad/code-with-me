// Importede packages
const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/sendResponse");
import { NextFunction, Request, Response } from "express";

const authMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // Validate jwt
  const _accessUserToken = request.headers.authorization?.split(" ")[1];
  try {
    const _verifyToken = jwt.verify(
      _accessUserToken,
      process.env.JWT_SECRET_KEY,
    );
    if (_verifyToken) {
      next();
    } else {
      sendResponse(response, false, `Something went wrong`);
    }
  } catch (error) {
    // Unvalid JWT || Request
    sendResponse(response, false, `Unauthorized please try again later`);
  }
};

module.exports = authMiddleware;
