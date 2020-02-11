// external packages
const express = require("express");
const _ = require("lodash");
const mongoose = require("mongoose");
// middlware
const validator = require("../middleware/validator");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
// models
const { validate, DriversLog } = require("../models/driversLog");

const router = express.Router();

// add new driver's log entry
router.post("/", [auth, validator(validate)], async (req, res) => {
  const driversLog = new DriversLog(
    _.pick(req.body, [
      "driver",
      "departureDate",
      "arrivalDate",
      "departureMileage",
      "arrivalMileage"
    ])
  );
  driversLog.driver = new mongoose.Types.ObjectId(driversLog.driver);
  await driversLog.save();

  res.send(
    _.pick(driversLog, [
      "_id",
      "driver",
      "departureDate",
      "arrivalDate",
      "departureMileage",
      "arrivalMileage"
    ])
  );
});

router.get("/", [auth], async (req, res) => {
  const driversLogs = await DriversLog.find()
    .populate({ path: "driver", select: "firstName lastName _id" })
    .select("-__v")
    .sort("departureDate arrivalDate");

  res.send(driversLogs);
});

module.exports = router;
