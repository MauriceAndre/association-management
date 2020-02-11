// external packages
const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const driversLogSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  departureDate: { type: Date, required: true },
  arrivalDate: { type: Date, required: true },
  departureMileage: { type: Number, min: 0, required: true },
  arrivalMileage: { type: Number, min: 0, required: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date }
});

driversLogSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

const DriversLog = mongoose.model("DriversLog", driversLogSchema);

function validateDriverLog(driversLog) {
  const schema = Joi.object({
    driver: Joi.objectId().required(),
    departureDate: Joi.date().required(),
    arrivalDate: Joi.date().required(),
    departureMileage: Joi.number()
      .min(0)
      .required(),
    arrivalMileage: Joi.number()
      .min(0)
      .required()
  });

  return schema.validate(driversLog);
}

module.exports.DriversLog = DriversLog;
module.exports.validate = validateDriverLog;
