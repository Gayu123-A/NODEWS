const mongoose = require('mongoose'); // Require the mongoose package

// Connect to the database
mongoose.connect('mongodb://127.0.0.1:27017/users_list_db'); // Here, 'users_list_db' is the DB name

// Acquire the connection (to check, if it is successful)
const db = mongoose.connection;

// When the error occurs, while establishing the connection
db.on('error', console.error.bind(console, 'Error connecting to the DB'));

// The connection is established successfully and the DB is up and running, and then print the message
db.once('open', function(){
    console.log('Successfully connected to the database');
})