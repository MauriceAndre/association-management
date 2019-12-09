// external modules
const express = require('express');
const helmet = require('helmet');
// middleware
const error = require('../middleware/error');
// routes
const users = require('../routes/users');

module.exports = function (app) {
    
    app.use(helmet());
    app.use(express.json());
    app.use('/api/users', users);

    app.use(error);
}