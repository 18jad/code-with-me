// Imported packages
const { Router } = require("express");
import { Request, Response } from "express";
const multer = require("multer");

// Variables
const router = Router();
const UserController = require("../controllers/user.controller");
const ContactController = require("../controllers/contact.controller");
const authMiddleware = require("../middlewares/user.middleware");
const userController = new UserController();
const contactController = new ContactController();
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "./public/images/profiles");
  },
  filename: function (req: any, file: any, cb: any) {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, Date.now() + "-" + fileName);
  },
});
const uploadStorage = multer({ storage });

// Routes:

// Edit profile route
router.put(
  "/edit_profile",
  authMiddleware,
  (request: Request, response: Response) => {
    userController.editProfile(request, response);
  },
);

// Upload profile picture to the server
router.post(
  "/upload_profile",
  uploadStorage.single("avatar"),
  (request: any, response: Response) => {
    userController.uploadProfile(request, response);
  },
);

// Check if likes
router.get("/check_like", async (request: Request, response: Response) => {
  const { id, userId } = request.query;
  const isLiked = await userController.checkIfLiked(id, userId);
  response.json({ isLiked });
});

// Like user
router.put(
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

// Get collabed projects
router.get(
  "/collabed_projects",
  async (request: Request, response: Response) => {
    userController.getCollabProjects(request, response);
  },
);

module.exports = router;
