// Imported packages
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// Configuration
require("dotenv").config();

// Variables
const app = express();
const port: string | number = process.env.PORT || 2121;
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const infoRoutes = require("./routes/info.routes");
const projectRoutes = require("./routes/project.routes");
const apiVersion: number = 1.0;
const prefix: string = String("/api/v" + apiVersion.toFixed(1));

// Configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use(prefix + "/auth", authRoutes);
app.use(prefix + "/user", userRoutes);
app.use(prefix + "/info", infoRoutes);
app.use(prefix + "/project", projectRoutes);

// Server
const server = http.createServer(app);

// Socket io server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on(
  "connection",
  (socket: { id: any; on: (arg1: string, arg2: () => void) => void }) => {
    console.log("User connected", socket.id);
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  },
);

server.listen(port, (error: any) => {
  if (error) {
    console.log("Error log:", error);
    throw new Error(error.message);
  }
  console.log("Server running on port " + port);
});
