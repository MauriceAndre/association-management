// external packages
const express = require('express');
const _ = require('lodash');
// middlware
const validator = require('../middleware/validator');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
// models
const {validate, User} = require('../models/user');

const router = express.Router();

// add new user
router.post('/', [auth, admin, validator(validate)], async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(500).send('User is already registred.')

    user = new User(_.pick(req.body, ['lastName', 'firstName', 'email', 'password', 'qualis']));
    await user.encryptPassword();
    await user.save();

    const token = user.generateWebToken();
    res
       .header('x-auth-token', token)
       .send(_.pick(user, ['_id', 'lastName', 'firstName', 'email', 'qualis']));
});

// get all users
router.get('/', [auth, admin], async (req, res) => {
    const users = await User.find()
        .select('-password -__v')
        .sort('lastName firstName');

    res.send(users);
});

// get user by token
router.get('/me', [auth], async (req, res) => {
    const user = await User.findById(req.user._id)
        .select('-password -__v -enabled');
    if (!user) return res.status(400).send('User does not exist.');
    
    res.send(user);
});

module.exports = router;