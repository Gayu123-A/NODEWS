const winston = require('winston');
const { format, transports } = winston;

// Define Log Format
const logFormat = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
);

// Create Logger
const logger = winston.createLogger({
    level: "info", // Log only info and above (info, warning, error)
    format: logFormat,
    transports: [
        new transports.Console(), // Log to console
        new transports.File({ filename: "logs/server.log" }) // Log to file
    ]
});

module.exports = logger;