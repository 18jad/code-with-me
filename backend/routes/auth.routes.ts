// Imported packages
const { Router } = require("express");
import { Request, Response } from "express";

// Variables
const router = Router();
const AuthUser = require("../controllers/auth.controller");
const authController = new AuthUser();

// Routes

// Register route
router.post("/register", (request: Request, response: Response) => {
  authController.register(request, response);
});

// Login route
router.post("/login", (request: Request, response: Response) => {
  authController.login(request, response);
});

// Reset password generate route
router.post("/generate_reset", (request: Request, response: Response) => {
  authController.generateResetPassword(request, response);
});

// Reset token verify
router.post("/verify_token", (request: Request, response: Response) => {
  authController.validateResetToken(request, response);
});

// Reset password
router.post("/reset_password", (request: Request, response: Response) => {
  authController.resetPassword(request, response);
});

module.exports = router;
