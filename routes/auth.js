// external packages
const express = require("express");
const Joi = require("@hapi/joi");
// middleware
const validator = require("../middleware/validator");
// models
const { User } = require("../models/user");

const router = express.Router();

// request JWT token
router.post("/", validator(validate), async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).send("Invalid email or password.");

  const match = await user.comparePassword(req.body.password);
  if (!match) return res.status(401).send("Invalid email or password.");

  const token = user.generateWebToken();
  res.send(token);
});

function validate(login) {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required()
  });
  return schema.validate(login);
}

module.exports = router;
