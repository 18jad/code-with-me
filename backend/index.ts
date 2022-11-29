// Imported packages
import { Request, Response } from "express";
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");

// App Configurations
require("dotenv").config();

// Variables
const app = express();
const port: string | number = process.env.PORT || 2121;
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const infoRoutes = require("./routes/info.routes");
const projectRoutes = require("./routes/project.routes");
const githubRoutes = require("./routes/github.routes");
const filesRoutes = require("./routes/files.routes");
const SocketInstance = require("./socket/SocketInstance");
const apiVersion: number = 1.0;
const prefix = String("/api/v" + apiVersion.toFixed(1));

// Server Configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use(prefix + "/auth", authRoutes);
app.use(prefix + "/user", userRoutes);
app.use(prefix + "/info", infoRoutes);
app.use(prefix + "/project", projectRoutes);
app.use(prefix + "/github", githubRoutes);
app.use("/", filesRoutes);

// Not found route
app.get("*", (request: Request, response: Response) => {
  response.status(404).json({
    message: "Page not found, are you lost?",
  });
});

// Server
const server = http.createServer(app);
const socket = new SocketInstance(server);
socket.init().then((io: typeof server) => {
  if (io) {
    socket.run();
  } else {
    socket.retryConnection();
  }
});

// Start server
server.listen(port, (error: any) => {
  if (error) {
    throw new Error(error.message);
  } else {
    console.log(`Server running on port ${port}`);
  }
});
