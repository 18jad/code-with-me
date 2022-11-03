// Imported packages
const { Router } = require("express");

// Variables
const router = Router();
const AuthUser = require("../controllers/auth.controller");
const authController = new AuthUser();

// Routes
router.post("/register", authController.register);

module.exports = router;
