const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function () {
    const db = process.env.DB_URL;
     mongoose.connect(db, { useNewUrlParser: true })
        .then(winston.info(`Connected to ${db}`));
}