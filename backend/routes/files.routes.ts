// Imported packages
const { Router } = require("express");
import { Request, Response } from "express";

// Variables
const router = Router();

// Image handler and server
app.get("/image/:dir/:id", (request: Request, response: Response) => {
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

module.exports = router;
