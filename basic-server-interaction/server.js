// Step 1: Import the Express framework
const express = require('express');

// Step 2: Import the "path" module (used for file path management)
const path = require('path');

// Step 3: Define the port number where the server will run.
const port = 3000;

// Step 4: Create an Express application instance (app) to handle HTTP requests.
const app = express();

/* Step 5:
    Tell Express to use "EJS" as a template/view engine. 
    EJS (Embedded JavaScript) is used to generate dynamic HTML pages.
*/
app.set('view engine', 'ejs');

// Step 6: Specifies the "folder where .ejs files are stored"
app.set('views', path.join(__dirname, 'views'));

/* Step 7:
    Middleware to parse the form data (URL- encoded form data). 
    Populates "req.body" with form inputs. 
    Allows handling of POST request data.
*/
app.use(express.urlencoded());

// Step 8: Start the express server on port 3000. If an error occurs, it logs an error message, otherwise it logs the success message.
app.listen(port, function(err){
    if(err){
        console.log(`Yup! The express server is not running due to the error ${err}`);
        return;
    }
    console.log(`The express server is up and running on the port ${port}`);
})

// Step 9: Route to render the FORM (GET)
app.get('/', function(req, res){
    res.render('index');
})

// Step 10: Route to handle FORM SUBMISSION (POST)
app.post('/submit', function(req, res){
    /*
    console.log(req.body);
    
    For ex:
    {
        name: 'JaiShiva',
        email: 'jaishiva@gmail.com',
        password: 'test123',        
        countryCode: '+91',
        phone: '989787868685'
    }
    */
   const {name, email, password, countryCode, phone} = req.body;
   const fullPhoneNo = `${countryCode}${phone}`;
   res.render('result', {name, email, password, fullPhoneNo})
})