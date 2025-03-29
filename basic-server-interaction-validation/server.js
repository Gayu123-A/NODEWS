// Import the Express framework
const express = require('express');

// Import the "path" module (used for file path management)
const path = require('path');

// Import session middleware
const session = require('express-session');

// Load environment variables
require('dotenv').config();

/* 
    Use values from .env file.
        "dotenv" loads the values at runtime.
        If .env is missing, it falls back to default values (3000, "defaultSecretKey").
*/
const port = process.env.PORT || 8000;  // Define the port number where the server will run.
const sessionSecret = process.env.SESSION_SECRET ||  "defaultSecretKey";

// Create an Express application instance (app) to handle HTTP requests.
const app = express();

/*
    Tell Express to use "EJS" as a template/view engine. 
    EJS (Embedded JavaScript) is used to generate dynamic HTML pages.
*/
app.set('view engine', 'ejs');

// Specifies the "folder where .ejs files are stored"
app.set('views', path.join(__dirname, 'views'));

/*
    Middleware to parse the form data (URL- encoded form data). 
    Populates "req.body" with form inputs. 
    Allows handling of POST request data.
*/
app.use(express.urlencoded());

// Use session middleware for temporary storage
app.use(session({
    secret: sessionSecret,  // Used to sign the session ID (ensures session security)
    resave: false,          // Prevents session from being saved again, if not modified.
    saveUninitialized: true // Saves a new session if it has'nt been initialized.
}))

// Function to validate submitted form data
function validateFormData(data){
    // console.log(data);  // { name: 'JaiShri', email: 'xyz@gmail.com' }
    let errors = {};

    const namePattern = /^[A-Za-z\s]*$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phonePattern = /^\d+$/;
    const countryPhonePatterns = {
        "+1": /^\d{10}$/,
        "+91": /^\d{10}$/,
        "+44": /^\d{10}$/,
        "+61": /^\d{9}$/,
        "+81": /^\d{10}$/
    };

    // Name validation
    if (!data.name){
        errors.name = "Name is required.";
    } else if(!namePattern.test(data.name)){
        errors.name = "Name must not contain numbers.";
    }
    
    // Email validation
    if (!data.email){
        errors.email = "Email is required.";
    } else if(!emailPattern.test(data.email)){
        errors.email = "Enter a valid email address.";
    }

    // Password validation
    if (!data.password){
        errors.password = "Password is required.";
    } else if(data.password.length < 6){
        errors.password = "Password must be at least 6 characters.";
    }

    if(data.password !== data.confirmPassword){
        errors.confirmPassword = "Passwords do not match.";
    }

    // Age validation
    if (!data.age){
        errors.age = "Age is required.";
    } else if(isNaN(data.age)){
        errors.age = "Age must contain only digits.";
    } else if(parseInt(data.age) < 18 || parseInt(data.age) > 100){
        errors.age = "Age must be between 18 and 100.";
    } 

    // Gender validation - Must be selected
    if (!data.gender) {
        errors.gender = "Select your gender.";
    }

    // Phone number validation
    if (!data.phone) {
        errors.phone = "Phone Number is required"; 
    } else if (!phonePattern.test(data.phone)){
        errors.phone = "Phone Number must contain only digits.";
    } else if (!countryPhonePatterns[data.countryCode].test(data.phone)) {
        errors.phone = `Phone Number does not match the selected country code.`;
    }

    // Address validation
    if (!data.address){
        errors.address = "Address is required.";
    }

    return errors;
}

// Route to render the FORM (GET)
app.get('/', function(req, res){
    /* When you visit the route '/', every first time
    console.log('REQ SESSION:', req.session);   // Session { cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true }}
    console.log(req.session.errors); // undefined
    console.log(req.session.data);  // undefined
     */
    
    res.render('index', {
        errors: req.session.errors || {}, // // Pass errors to the form (if any)
        data: req.session.data || {}    // Pass user input to retain data after validation errors
    });

    req.session.errors = {}; // Clear errors after rendering
})

// Route to handle FORM SUBMISSION (POST)
app.post('/submit', function(req, res){
    const errors = validateFormData(req.body);
    // console.log(errors);    // { name: 'Name must not contain numbers.', email: 'Email is required.' }

    // If errors exist, store them in session and re-render the form.
    // console.log(Object.keys(errors));   // [ 'name', 'email' ]
    if (Object.keys(errors).length > 0) {
        req.session.errors = errors;
        req.session.data = req.body; // Store user input so that it's not lost

        return res.redirect("/"); // Redirect to the form page
    }

    // If no errors, store the validated form data in a session
    req.session.userData = req.body;

    // Redirect to the result page
    return res.redirect("/result");
})

// Route to render the result page
app.get('/result', function(req, res){
    if(!req.session.userData){
        return res.redirect("/"); // Redirect back to form if no data
    }
    
    /*
    console.log(req.session);
    Session {
        cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true },
        userData: {
          name: 'Uma',
          email: 'test123@gmail.com',
          password: 'test123',
          confirmPassword: 'test123',
          age: '45',
          gender: 'Female',
          countryCode: '+1',
          phone: '8349839767',
          address: 'JKJSLDKJA'
        }
    }
    */

    const userData = req.session.userData; // Store data before clearing session
    req.session.destroy(); // Clear session after displaying data
    res.render("result", { data: userData });
})

// Start the express server on port 3000. If an error occurs, it logs an error message, otherwise it logs the success message.
app.listen(port, function(err){
    if(err){
        console.log(`Yup! The express server is not running due to the error ${err}`);
        return;
    }
    console.log(`The express server is up and running on the port ${port}`);
})