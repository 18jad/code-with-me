// Imported packages
const express = require("express");
const bodyParser = require("body-parser");

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

// Routes
app.use(prefix + "/auth", authRoutes);
app.use(prefix + "/user", userRoutes);
app.use(prefix + "/info", infoRoutes);
app.use(prefix + "/project", projectRoutes);

app.listen(port, (error: any) => {
  if (error) {
    console.log("Error log:", error);
    throw new Error(error.message);
  }
  console.log("Server running on port " + port);
});
