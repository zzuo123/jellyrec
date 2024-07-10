import winston from 'winston';

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info) => {
            return `[${info.timestamp}] JellyRec backend (${process.pid}) ${info.level}: ${info.message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        // new winston.transports.File({ filename: 'jellyrec-backend.log' }),   // this is for prod
    ],
});

export default logger;