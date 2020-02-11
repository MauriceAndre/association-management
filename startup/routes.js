// external modules
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
// middleware
const error = require("../middleware/error");
// routes
const users = require("../routes/users");
const auth = require("../routes/auth");
const qualis = require("../routes/qualis");
const driverLogs = require("../routes/driversLogs");

module.exports = function(app) {
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/qualis", qualis);
  app.use("/api/drivers-logs", driverLogs);

  app.use(error);
};
