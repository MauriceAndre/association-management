// external packages
const winston = require('winston');
const express = require('express');

const app = express();

require('./startup/config')();
require('./startup/logging')();


const port = process.env.APP_PORT;
app.listen(port, () => winston.info(`Server is listening on port ${port}...`));

module.exports = app;