// Import required modules
const express = require('express');
const path = require('path');

// Load Environment Variables
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8001;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));

// Route to render the Homepage OR Loginpage (GET   /)
app.get('/', function(req, res){
    res.render('login', { activePage: 'login' });
})

// Route to render the Register page (GET   /)
app.get('/register', function(req, res){
    res.render('register', { activePage: 'register' });
})

// Dashboard Route
app.get('/dashboard', (req, res) => {
    res.render('dashboard', { activePage: 'dashboard' });
});


// Start the express server on port 8000. If an error occurs, it logs an error message, otherwise it logs the success message.
app.listen(port, function(err){
    if(err){
        console.log(`Yup! The express server is not running due to the error ${err}`);
        return;
    }
    console.log(`The express server is up and running on the port ${port}`);
})
