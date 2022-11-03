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

module.exports = router;
