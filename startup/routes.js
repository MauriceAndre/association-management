// external modules
const express = require('express');
const helmet = require('helmet');
// middleware
const error = require('../middleware/error');
// routes
const users = require('../routes/users');
const auth = require('../routes/auth');

module.exports = function (app) {
    
    app.use(helmet());
    app.use(express.json());
    app.use('/api/users', users);
    app.use('/api/auth', auth);

    app.use(error);
}