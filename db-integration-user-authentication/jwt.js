// Importing required functions from the jsonwebtoken package
const {sign, verify} = require('jsonwebtoken');

// Secret key for JWT signing and verification (fallback to a default value if environment variable is not set)
const jwtSecret = process.env.JWT_SECRET || "defaultJwtSecretKey";

/**
 * Function to create a JWT token
 * @param {Object} user - User object containing email and ID
 * @returns {string} - Signed JWT token
 */
const createToken = (user) => {
    const accessToken = sign(
        { email: user.email, id: user._id}, // Payload containing user email and ID
        jwtSecret,                          // Secret key for signing the token
        { expiresIn: "1h" }                 // Token expiration time (1 hour)
    );

    return accessToken;
};

/**
 * Middleware to validate JWT token
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Callback to proceed to next middleware
 */
const validateToken = (req, res, next) => {
    // console.log(req.cookies);   // Logging cookies for debugging. It is an object and it looks like { 'access-token': '<value>', ... }

    // Retrieving the JWT token from cookies
    const accessToken = req.cookies['access-token'];

    // If token is not found, return authentication error
    if(!accessToken){
        return res.status(400).json({error: 'User not authenticated!'});
    }

    try{
        // Verify the JWT token
        const validToken = verify(accessToken, jwtSecret);

        // If token is valid, set authentication status and proceed
        if(validToken){
            req.authenticated = true;
            return next();
        } 
    }catch(err){
        // Handling invalid or tampered token
        return res.status(400).json({ error: err });
        /*
        Example of an error when someone manually modifies the cookie value:
        {
            "error": {
                "name": "JsonWebTokenError",
                "message": "jwt malformed"
            }
        }
        */
    }
}

// Exporting functions for use in other parts of the application
module.exports = { createToken, validateToken };