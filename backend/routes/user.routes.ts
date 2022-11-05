// Imported packages
const { Router } = require("express");
import { Request, Response } from "express";

// Variables
const router = Router();
const UserController = require("../controllers/user.controller");
const userController = new UserController();

// Routes
// Register route
router.get("/get_user_by_id", (request: Request, response: Response) => {
  userController.getUserById(request, response);
});

module.exports = router;
