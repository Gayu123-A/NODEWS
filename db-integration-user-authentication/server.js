const express = require('express');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const db = require('./config/mongoose'); // Import database configuration
const User = require('./models/User');   // Import User model
const {createToken, validateToken } = require('./jwt'); // Import JWT utility functions

// Load Environment Variables from .env file
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8001; // Set port from environment variables or default to 8001

// Middleware to parse incoming JSON requests
app.use(express.json());
// Middleware to parse cookies for authentication
app.use(cookieParser());

/**
 * Route: /register (POST)
 * Purpose: Registers a new user by hashing their password and saving them to the database.
 */
app.post('/register', (req, res) => {
    const { name, email, password, age, countryCode, phone, address } = req.body;

    // Hash the password before saving to database
    bcrypt.hash(password, 10).then((hashedPassword) => {
        // Create a new user object with the hashed password
        const newUser = new User({ name, email, password: hashedPassword, age, countryCode, phone, address });

        // Save the new user to the database
        newUser.save().then(() => {
            res.status(201).json({ message: "User registered successfully" });
        }).catch((err) => {
            res.status(400).json({error: err});
        });
    });
});

/**
 * Route: /login (POST)
 * Purpose: Authenticates the user, checks credentials, and issues a JWT token.
 */
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User does not exist!" });

    // Validate the provided password against the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid User Credentials!" });

    // Generate JWT access token for authentication
    const accessToken = createToken(user);

     // Set the JWT as an HTTP-only cookie for secure access
    res.cookie("access-token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,   // 30 days expiration
        httpOnly: true  // Ensures the cookie is only accessible via HTTP requests
    });

    res.status(201).json({ message: "User logged In!" });
});

/**
 * Route: /dashboard (POST)
 * Purpose: Allows access to the dashboard only if the user is authenticated.
 * Uses the validateToken middleware to check JWT authentication.
 */
app.post('/dashboard', validateToken, (req, res) => {
    res.json('dashboard');
});

// Start the express server on port 8000. If an error occurs, it logs an error message, otherwise it logs the success message.
app.listen(port, function(err){
    if(err){
        console.log(`Yup! The express server is not running due to the error ${err}`);
        return;
    }
    console.log(`The express server is up and running on the port ${port}`);
})