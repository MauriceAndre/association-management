// external modules
const express = require('express');
const helmet = require('helmet');
// middleware
const error = require('../middleware/error');


module.exports = function (app) {

    app.use(helmet());
    app.use(express.json());


    app.use(error);
}