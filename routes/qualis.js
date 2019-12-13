// external packages
const express = require('express');
const _ = require('lodash');
// middlware
const validator = require('../middleware/validator');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
// models
const {validate, Qualification} = require('../models/qualification');

const router = express.Router();

router.post('/', [auth, admin, validator(validate)] , async (req, res) => {
    let quali = await Qualification.findOne({ title: req.body.title });
    if (quali) return res.status(500).send('Qualification exists. Qualification must be unique.');

    quali = new Qualification(req.body);
    await quali.save();

    res.send(_.pick(quali, ['_id', 'title', 'desc']));
});

module.exports = router;