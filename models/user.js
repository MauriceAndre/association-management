// external packages
const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: { type: String, minlength: 3, maxlength: 30, required: true },
  lastName: { type: String, minlength: 3, maxlength: 30, required: true },
  email: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true,
    unique: true
  },
  password: { type: String, minlength: 6, maxlength: 255, required: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date },
  enabled: { type: Boolean, default: true },
  qualis: {
    type: ["ObjectId"],
    ref: "Qualification",
    required: true
  }
});

userSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

userSchema.methods.encryptPassword = function() {
  const me = this;
  return new Promise(async (resolve, reject) => {
    const salt = await bcrypt.genSalt(parseInt(process.env.PASSWORD_SALT));
    me.password = await bcrypt.hash(me.password, salt);
    resolve();
  });
};

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateWebToken = function() {
  const { firstName, lastName, isAdmin, _id } = this;

  return jwt.sign(
    {
      _id,
      firstName,
      lastName,
      isAdmin
    },
    process.env.JWT_PRIVATE_KEY
  );
};

userSchema.statics.verifyWebToken = function(token) {
  return jwt.verify(token, process.env.JWT_PRIVATE_KEY);
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string()
      .min(3)
      .max(30)
      .required(),
    lastName: Joi.string()
      .min(3)
      .max(30)
      .required(),
    email: Joi.string()
      .min(3)
      .max(255)
      .email()
      .required(),
    password: Joi.string()
      .min(6)
      .max(255)
      .required(),
    qualis: Joi.array().items(Joi.objectId())
  });
  return schema.validate(user);
}

module.exports.validate = validateUser;
module.exports.User = User;
