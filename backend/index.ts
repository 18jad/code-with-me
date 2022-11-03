// Imported packages
const express = require("express");
const bodyParser = require("body-parser");

// Configuration
require("dotenv").config();

// Variables
const app = express();
const port = process.env.PORT || 2121;

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, (error: any) => {
  if (error) {
    console.log("Error log:", error);
    throw new Error(error.message);
  }
  console.log("Server running on port " + port);
});

export {};
