const express = require('express');
const cors = require('cors');
const path = require('path');

// Load Environment Variables
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8001;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded());
app.use(express.json());
app.use(cors()); // Allow cross-origin requests

// Sample in-memory data ( acts like a database )
let users = [
    {
        id: 1,
        name: 'John Smith',
        email: 'johnsmith@example.com'
    },
    {
        id: 2,
        name: 'Steve K',
        email: 'steve@example.com'
    }
];

// Route to get all users - GET
app.get('/api/users', (req, res) => {
    try{
        if(users.length === 0){
            throw new Error('Users not found');
        }
        res.json(users);    // Send user data as JSON
    }catch(error){
        res.status(500).json({message: error.message}); // Send error response. 500 - Internal Server Error
    }
});

// Route to get a single user by ID - GET
app.get('/api/users/:id', (req, res) => {
    try{
        const user = users.find(u => u.id === Number(req.params.id));
        if(!user){ 
            return res.status(404).json({ message: "User not found" }); // Return 404 error
        }
        res.json(user); // Send user details
    }catch(error){
        res.status(500).json({ message: "Server error" });
    }
});

// Route to add a new user - POST
app.post('/api/users', (req, res) => {
    console.log(req.body);  // { name: 'test', email: 'test@gmail.com' }
    try{
        const {name, email} = req.body;

        // Validate inputs (both name and email are required)
        if(!name || !email){
            return res.status(400).json({ message: "Name and Email are required" });
        }

        // Check if the email already exists in the users array
        const existingUser = users.find(user => user.email === email);
        if(existingUser){
            return res.status(409).json({ message: `User with the email ${email} already exists` });
        }

        // Create new user with unique ID
        const newUser = { id: users.length + 1, name, email };

        // Store user in the array (simulating database storage)
        users.push(newUser);

        // Send success response
        res.status(201).json(newUser);
    }catch(error){
        // Handle unexpected errors
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Route to update a user - PUT
app.put("/api/users/:id", (req, res) => {
    try {
        // Find the user by ID in the users array
        const existingUserIndex = users.findIndex(user => user.id === Number(req.params.id));

        // If user is not found, return a 404 error
        if (existingUserIndex === -1) {
            return res.status(404).json({ message: "User not found." });
        }

        // Merge existing user data with the new request data
        users[existingUserIndex] = { ...users[existingUserIndex], ...req.body };

        // Respond with the updated user data
        res.json(users[existingUserIndex]);

    } catch (error) {
        // Handle unexpected errors and send a 500 Internal Server Error response
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Delete a user
app.delete("/api/users/:id", (req, res) => {
    /* filter() method just filters the users whose id does NOT match the req.params.id. In other words, it creates a new array with the elements that satisfies the given condition. */
    users = users.filter(u => u.id != Number(req.params.id));
    res.json({ message: "User deleted" });
});

// Start the express server on port 8000. If an error occurs, it logs an error message, otherwise it logs the success message.
app.listen(port, function(err){
    if(err){
        console.log(`Yup! The express server is not running due to the error ${err}`);
        return;
    }
    console.log(`The express server is up and running on the port ${port}`);
})