// Imported packages
const { Router } = require("express");
import { Request, Response } from "express";

// Variables
const router = Router();
const ProjectController = require("../controllers/project.controller");
const authMiddleware = require("../middlewares/user.middleware");
const userController = new ProjectController();

// Routes:

// Create new project route
router.post(
  "/create_project",
  authMiddleware,
  (request: Request, response: Response) => {
    userController.createProject(request, response);
  },
);

// Allow user into a project
router.post(
  "/allow_user",
  authMiddleware,
  (request: Request, response: Response) => {
    userController.allowUser(request, response);
  },
);

// Check if user is allowed
router.get(
  "/check_allowed",
  authMiddleware,
  async (request: Request, response: Response) => {
    userController.checkIfAllowed(request, response);
  },
);

// Send inviation to project via email
router.post(
  "/send_invitation",
  authMiddleware,
  (request: Request, response: Response) => {
    userController.sendInviation(request, response);
  },
);

// Update project structure
router.post(
  "/update_project",
  authMiddleware,
  (request: Request, response: Response) => {
    userController.updateProject(request, response);
  },
);

// Create file
router.post(
  "/create_file",
  authMiddleware,
  (request: Request, response: Response) => {
    userController.createFile(request, response);
  },
);

module.exports = router;
