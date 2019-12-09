// external packages
const express = require('express');
const _ = require('lodash');
// middlware
const validator = require('../middleware/validator');
// models
const {validate, User} = require('../models/user');

const router = express.Router();

// add new user
router.post('/', validator(validate), async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(500).send('User is already registred.')

    user = new User(_.pick(req.body, ['lastName', 'firstName', 'email', 'password']));
    await user.encryptPassword();
    await user.save();

    res.send(_.pick(user, ['_id', 'lastName', 'firstName', 'email']));
});

module.exports = router;