// external packages
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const qualificationSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 3,
        maxlength: 50,
        unique: true,
        required: true
    },
    desc: { type: String, maxlength: 255 },
    enabled: { type: Boolean, default: true }
});

const Qualification = mongoose.model('Qualification', qualificationSchema);

function validateQualification (qualification) {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required(),
        desc: Joi.string().max(255)
    });
    return schema.validate(qualification);
}

module.exports.Qualification = Qualification;
module.exports.validate = validateQualification;