// Imported packages
const { Router } = require("express");
import { Request, Response } from "express";

// Variables
const router = Router();

// Image handler and server
router.get("/image/:dir/:id", (request: Request, response: Response) => {
  const { dir, id } = request.params;
  if (!dir) {
    response.status(400).json({
      message: "Directory is missing",
    });
  }
  if (!id) {
    response.status(400).json({
      message: "Id is missing",
    });
  }
  const imagePath = `${__dirname}/public/images/${dir}/${id}`;
  // check if directory exists on the server
  if (fs.existsSync(imagePath)) {
    response.sendFile(imagePath);
  } else {
    response.status(404).json({
      message: "Image not found",
    });
  }
});

// Files handlers and server
router.get("/file/:project/:file", (request: Request, response: Response) => {
  const { project, file } = request.params;
  if (!project) {
    response.status(400).json({
      message: "Project is missing",
    });
  }
  if (!file) {
    response.status(400).json({
      message: "File is missing",
    });
  }
  const filePath = `${__dirname}/public/projects/${project}/${file}`;
  // check if directory exists on the server
  if (fs.existsSync(filePath)) {
    response.sendFile(filePath);
  } else {
    response.status(404).json({
      message: "File not found",
    });
  }
});

module.exports = router;
