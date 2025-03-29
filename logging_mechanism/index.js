const express = require('express');
const morgan = require('morgan'); // Logging middleware
const fs = require('fs'); // File System module
const path = require('path'); // To handle file paths


const app = express();

// Create a writable stream to store logs
const logStream = fs.createWriteStream(path.join(__dirname, 'request_logs.log'), { flags: 'a' });

// Middleware to log requests in a file (format: method, status, response time, size)
app.use(morgan(':method :url :status :response-time ms - :res[content-length]', { stream: logStream }));

// Middleware to log requests in console (for debugging)
app.use(morgan('dev')); // Logs HTTP requests (method, status, response time)

// Middleware for parsing JSON request body
app.use(express.json()); // Allows reading JSON data from POST requests

// Middleware for parsing URL-encoded data (form submissions)
app.use(express.urlencoded({extended: true}));


app.get('/', (req, res) => {
    res.send('Welcome to my Express Server!');
});

// Example route to see middleware in action
app.post('/test', (req, res) => {
    console.log(req.body); // Logs incoming request data
    res.json({message: "Received Data", data: req.body});
});

// Start Server
app.listen(8000, () => {
    console.log("Server is running on port 8000");
});