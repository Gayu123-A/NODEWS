const express = require('express');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const db = require('./config/mongoose');
const User = require('./models/User');
const {createToken, validateToken } = require('./jwt');

// Load Environment Variables
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8001;

app.use(express.json());
app.use(cookieParser());

app.post('/register', (req, res) => {
    const { name, email, password, age, countryCode, phone, address } = req.body;

    // Hash the password before saving
    bcrypt.hash(password, 10).then((hashedPassword) => {
        // Create new user
        const newUser = new User({ name, email, password: hashedPassword, age, countryCode, phone, address });
        newUser.save().then(() => {
            res.status(201).json({ message: "User registered successfully" });
        }).catch((err) => {
            res.status(400).json({error: err});
        });
    });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User does not exist!" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid User Credentials!" });

    const accessToken = createToken(user);

    res.cookie("access-token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        httpOnly: true
    });

    res.status(201).json({ message: "User logged In!" });
});

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