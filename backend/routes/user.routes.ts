// Imported packages
const { Router } = require("express");
import { Request, Response } from "express";

// Variables
const router = Router();
const UserController = require("../controllers/user.controller");
const userController = new UserController();
const authMiddleware = require("../middlewares/user.middleware");

// Routes:
// Get user info routes:
// Get user info by id
router.get("/info_id", (request: Request, response: Response) => {
  userController.getUserById(request, response);
});
// Get user info by username
router.get("/info_username", (request: Request, response: Response) => {
  userController.getUserByUsername(request, response);
});

// Create new project route
router.post(
  "/create_project",
  authMiddleware,
  (request: Request, response: Response) => {
    userController.createProject(request, response);
  },
);

// Edit profile route
router.post(
  "/edit_profile",
  authMiddleware,
  (request: Request, response: Response) => {
    userController.editProfile(request, response);
  },
);

// Search user
router.get("/search", (request: Request, response: Response) => {
  userController.searchUser(request, response);
});

// Check if likes
router.get("/check_like", async (request: Request, response: Response) => {
  const { id, userId } = request.query;
  const isLiked = await userController.checkIfLiked(id, userId);
  response.json({ isLiked });
});

// Like user
router.post(
  "/update_user_like",
  authMiddleware,
  (request: Request, response: Response) => {
    userController.updateUserLike(request, response);
  },
);

module.exports = router;
