const express = require('express');
const path = require('path');
const passport = require('passport') // Authentication middleware of Node.js
const session = require('express-session');
const googleStrategy = require('passport-google-oauth20').Strategy;
const rateLimit = require('express-rate-limit');
const NodeCache = require("node-cache");
const weatherCache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

// Load Environment variables
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for session management
app.use(session({
    secret: process.env.SESSION_SECRET, // Secret Key to encrypt the session
    resave: false,        // Avoid resaving sessions, if nothing has changed
    saveUninitialized: true       // save new sessions
}));

// Define rate limiter: 5 requests per minute per IP
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 requests per 'windowMs'
    message: "To many requests, please try again later.",
    headers: true
});

// Apply rate limiting to weather API route
app.use('/weather', apiLimiter);

// Middleware to initialize Passport, which manages "authentication" in our app
app.use(passport.initialize());
// Middleware : To make sure that it integrates with Express session, so users can stay loggedin as they browse our site
app.use(passport.session());

// We need "Google OAuth Credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)", to connect our app with Google. Configure Google Strategy in passport to use Google OAuth Credentials
passport.use(
    new googleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8000/auth/google/callback"
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile); // passing user's profile data to the done() function
        }
    )
);

// serialize: Saving the users data inside the session
passport.serializeUser((user, done) => {
    done(null, user);
});

// deserialize: Retrieving the users data
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Middleware: Check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}

// Homepage route - Render login page
app.get("/", (req, res) => {
    res.render("login");
});

// Route, which will redirect the user to Google for login
app.get('/auth/google', 
    passport.authenticate("google", {   // Redirect to Google OAuth
        scope: ["profile", "email"]
    })
);

// Route to handle the callback from Google
app.get('/auth/google/callback',
    passport.authenticate(
        'google',
        {failureRedirect: '/'}  // If Google authentication fails, the user is redirected to the login page
    ),
    (req,res) => {
        res.redirect('/profile');   // If Google authentication succeeded, the user is redirected to the app profile page
    }
);

// Profile page route
app.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', {user: req.user});
});

// OpenWeather API Route - Get Weather by City or Coordinates
app.get('/weather', async (req, res) => {
    try {
        let { city, lat, lon } = req.query;
        const apiKey = process.env.OPENWEATHER_API_KEY;
        let url, cacheKey;

        if (lat && lon) {
            cacheKey = `lat:${lat}-lon:${lon}`;
        } else if (city) {
            cacheKey = `city:${city}`;
        } else {
            return res.status(400).json({ error: "City name or location is required!" });
        }

        // Check cache first
        const cachedData = weatherCache.get(cacheKey);
        if (cachedData) {
            return res.json(cachedData); // Return cached data if available
        }

        // Fetch data from OpenWeather API
        url = lat && lon
            ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
            : `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);
        const weatherData = await response.json();

        if (!response.ok) {
            return res.status(weatherData.cod).json({ error: weatherData.message });
        }

        // Format response
        const weatherInfo = {
            city: weatherData.name,
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            icon: `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`
        };

        // Store in cache
        weatherCache.set(cacheKey, weatherInfo);

        res.json(weatherInfo);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error. Please try again later." });
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
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