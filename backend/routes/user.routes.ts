// Imported packages
const { Router } = require("express");
import { Request, Response } from "express";

// Variables
const router = Router();
const UserController = require("../controllers/user.controller");
const ContactController = require("../controllers/contact.controller");
const authMiddleware = require("../middlewares/user.middleware");
const userController = new UserController();
const contactController = new ContactController();

// Routes:

// Edit profile route
router.put(
  "/edit_profile",
  authMiddleware,
  (request: Request, response: Response) => {
    userController.editProfile(request, response);
  },
);

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

// Send contact me email
router.post("/contact_me", (request: Request, response: Response) => {
  contactController.sendEmail(request, response);
});

module.exports = router;
