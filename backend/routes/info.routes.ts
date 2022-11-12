// Imported packages
const { Router } = require("express");
import { Request, Response } from "express";

// Variables
const router = Router();
const InfoController = require("../controllers/info.controller");
const infoController = new InfoController();

// Get user info by id
router.get("/info_id", (request: Request, response: Response) => {
  infoController.getUserById(request, response);
});

// Get user info by username
router.get("/info_username", (request: Request, response: Response) => {
  infoController.getUserByUsername(request, response);
});

// Search user
router.get("/search", (request: Request, response: Response) => {
  infoController.searchUser(request, response);
});

// Get project by username
router.get("/info_title", (request: Request, response: Response) => {
  infoController.getProjectByTitle(request, response);
});

module.exports = router;
