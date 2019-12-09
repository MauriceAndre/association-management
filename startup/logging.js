// external packages
const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');
// const config = require('config');

module.exports = function () {
    // logging and exception handling
    winston.configure({
        transports: [
            new winston.transports.Console({
                level: 'info',
                format: winston.format.combine(
                    winston.format.prettyPrint(),
                    winston.format.colorize(),
                    winston.format.simple()
                )
            }),
            new winston.transports.File({ filename: 'logs/app.log' }),
            // new winston.transports.MongoDB ({
            //     db: config.get('db.url'),
            //     level: 'error'
            // })
        ],
        exceptionHandlers: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.prettyPrint(),
                    winston.format.colorize(),
                    winston.format.simple()
            )}),
            new winston.transports.File({ filename: 'logs/uncaughtExceptions.log' }),
            // new winston.transports.MongoDB ({
            //     db: config.get('db.url')
            // })
        ]
    });
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });
}