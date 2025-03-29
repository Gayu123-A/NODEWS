// Import required modules
const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const session = require('express-session');

// Load Environment Variables
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8001;
const sessionSecret = process.env.SESSION_SECRET ||  "defaultSecretKey";

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true
}))

// User stored in an array (replace with DB in upcoming tasks)
const users = [];

// Function to validate the registration form
function validateRegistration(data) {
    let errors = {};

    const namePattern = /^[A-Za-z\s]*$/; // Allows only letters and spaces
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Basic email pattern
    const phonePattern = /^\d+$/; // Only digits allowed
    const countryPhonePatterns = {
        "+1": /^\d{10}$/,
        "+91": /^\d{10}$/,
        "+44": /^\d{10}$/,
        "+61": /^\d{9}$/,
        "+81": /^\d{10}$/
    };
    
    if (!data.name || !namePattern.test(data.name)) {
        errors.name = "Name must contain only letters.";
    }

    if (!data.email || !emailPattern.test(data.email)) {
        errors.email = "Invalid email format.";
    }

    if (users.find(user => user.email === data.email)) {
        errors.email = "Email already registered.";
    }

    if (!data.password || data.password.length < 6) {
        errors.password = "Only 6 characters allowed.";
    }

    if (!/[a-z]/.test(data.password) || !/[A-Z]/.test(data.password) || !/[0-9]/.test(data.password) || !/[^a-zA-Z0-9]/.test(data.password)) {
        errors.password = "Password must contain letters(uppercase and lowercase), numbers, and symbols.";
    }

    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
    }

    if (!data.age || isNaN(data.age) || parseInt(data.age) < 18 || parseInt(data.age) > 100) {
        errors.age = "Age must be between 18 and 100.";
    }

    if (!data.phone || !phonePattern.test(data.phone)) {
        errors.phone = "Invalid phone number.";
    } else if (!countryPhonePatterns[data.countryCode].test(data.phone)) {
        errors.phone = "Phone Number does not match the selected country code.";
    }

    return errors;
}

// Route to render the Homepage OR Loginpage (GET   /)
app.get('/', function(req, res){
    const prefill = req.session.prefill || {};
    req.session.prefill = ''; // clear after use
    res.render('login', { activePage: 'login', prefill , error: ''});
})

// Route to render the Register page (GET   /)
app.get('/register', function(req, res){
    res.render('register', { activePage: 'register', errors: {}, data: {} });
})

// Route to handle the Register form data (POST /register)
app.post('/register', async (req, res) => {
    const errors = validateRegistration(req.body);
    // const errors = { name: 'Name must not contain numbers.', email: 'Invalid Email.' }
    
    // If errors exist, re-render the register form with errors and prefilled user input.
    if (Object.keys(errors).length > 0) {
        return res.render('register', { activePage: 'register', errors, data: req.body });
    }

    // Hash password before storing it
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        age: req.body.age,
        countryCode: req.body.countryCode,
        phone: req.body.phone,
        address: req.body.address
    });
    console.log('user array build during registration:', users);
    // Store email and password in a session to prefill the login form
    req.session.prefill = {
        'email': req.body.email,
        'password': req.body.password
    }

    res.redirect('/');
})

// Route to handle login (POST /login)
app.post('/login', async (req, res) => {
    /*
    console.log('login data:', req.body);
    login data: { email: 'yoga2017@gmail.com', password: 'TEst@1' }
    */
    const {email, password} = req.body;

    /*
    console.log(users);
    users: [
        {
          name: 'Yoga',
          email: 'yoga2017@gmail.com',
          password: '$2b$10$oYZiUq2VezjgAVFAbIg8S.40XYIy7yHAmoyWdZyUjVUhHLi.R18lm',
          age: '34',
          countryCode: '+1',
          phone: '9898389877',
          address: 'No: 20, kakdlad'
        }
      ] */

    // Find the user by email
    const user = users.find(user => user.email === email);
    /*
    console.log(user);
    {
        name: 'Yoga',
        email: 'yoga2017@gmail.com',
        password: '$2b$10$oYZiUq2VezjgAVFAbIg8S.40XYIy7yHAmoyWdZyUjVUhHLi.R18lm',
        age: '34',
        countryCode: '+1',
        phone: '9898389877',
        address: 'No: 20, kakdlad'
    } */
    if(!user){
        console.log('User error');
        return res.render('login', { activePage: 'login', prefill: req.body, error: "User not found"});
    }

    // Compare entered/prefilled password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        console.log('pwd error');
        return res.render('login', { activePage: 'login', prefill: req.body, error: "Incorrect Password"});
    }

    // store user details in session (single user)
    req.session.user = user;

    // Redirect to the dashboard after successful login
    res.redirect('/dashboard');
})

// Dashboard Route
app.get('/dashboard', (req, res) => {

    if(!req.session.user){
        return res.redirect('/'); // Redirect to login if not authenticated
    }

    res.render('dashboard', { 
        activePage: 'dashboard',
        user: req.session.user
    });
});

// Logout Route
app.get('/logout', function(req, res){
    req.session.destroy(err => {
        if(err) {
            return res.redirect('/dashboard');
        }
        res.clearCookie('connect.sid'); // Ensure session cookie is deleted. If not, after logout, session details still exist if user manually revisits the page.
        res.redirect('/');
    });
});

// Start the express server on port 8000. If an error occurs, it logs an error message, otherwise it logs the success message.
app.listen(port, function(err){
    if(err){
        console.log(`Yup! The express server is not running due to the error ${err}`);
        return;
    }
    console.log(`The express server is up and running on the port ${port}`);
})
