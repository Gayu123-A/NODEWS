const mongoose = require('mongoose'); // Import mongoose

// Define schema of 'Users' collection
const userSchema = new mongoose.Schema({
    name: {
        type: String, required: true
    },
    email: {
        type: String, required: true, unique: true
    },
    password: {
        type: String, required: true
    },
    age: {
        type: Number, required: true
    },
    countryCode: {
        type: String, required: true
    },
    phone: {
        type: Number, required: true
    },
    address: {
        type: String, required: true
    }
});

// Create a Model
const User = mongoose.model('User', userSchema);

// Export the Model
module.exports = User;