// external packages
const mongoose = require('mongoose');

const qualificationSchema = new mongoose.Schema({});

const Qualification = mongoose.model(qualificationSchema);

module.exports.Qualification = Qualification;