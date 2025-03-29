const express = require('express');
const passport = require('passport');
const session = require('express-session');
const { emailQueue } = require('./jobQueue');  // Import Redis queue
require('dotenv').config();

const app = express();

app.use(session({ secret: "SESSION_SECRET", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Authentication Routes (Login)
app.get('/auth/google',
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth Callback
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // 🎯 Queue an email after successful login
        emailQueue.add({
            email: req.user.emails[0].value,
            subject: "Welcome to Our App!",
            message: `Hi ${req.user.displayName},\n\nYou have successfully logged in!\n\nBest Regards,\nYour App Team`
        });

        res.redirect('/profile');
    }
);

// Profile Page
app.get('/profile', (req, res) => {
    res.send(`Welcome ${req.user.displayName}`);
});

app.listen(8000, () => console.log(`Server running on port 8000`));