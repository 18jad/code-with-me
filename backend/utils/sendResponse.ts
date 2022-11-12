import { Response } from "express";

const sendResponse = (
  response: Response,
  success: boolean,
  message: any,
  prop?: any,
) => {
  response.status(success ? 200 : 404).json({
    success,
    message,
    ...prop,
  });
};

module.exports = sendResponse;
