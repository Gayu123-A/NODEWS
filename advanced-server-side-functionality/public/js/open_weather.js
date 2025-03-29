// Function to fetch weather based on user input
function fetchWeather() {
    const city = document.getElementById("city-input").value;

    logEvent(`Fetching weather for city: ${city}`);

    if (!city) {
        document.getElementById("error-message").textContent = "Please enter a city!";
        return;
    }

    fetch(`/weather?city=${city}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('weather-info').innerHTML = "";
                logEvent(`Weather API Error: ${data.error}`);
                document.getElementById("error-message").textContent = data.error;
            } else {
                logEvent(`Weather data received for ${city}`);
                displayWeather(data);
            }
        })
        .catch(error => {
            logEvent(`Weather API Request Failed: ${error.message}`);
            document.getElementById("error-message").textContent = "Error fetching weather data!";
        });
}

// Function to get user's current location
function getCurrentLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            },
            (error) => {
                document.getElementById("error-message").textContent = "Location access denied!";
            }
        );
    } else {
        document.getElementById("error-message").textContent = "Geolocation is not supported by your browser.";
    }
}

 // Function to fetch weather by latitude & longitude
 function fetchWeatherByCoords(lat, lon) {
    logEvent(`Fetching weather for current city: ${lat} - ${lon}`);

    fetch(`/weather?lat=${lat}&lon=${lon}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('weather-info').innerHTML = "";
                logEvent(`Weather API Error (Current City): ${data.error}`);
                document.getElementById("error-message").textContent = data.error;
            } else {
                document.getElementById("city-input").value = data.city;
                logEvent(`Weather data received for ${data.city}`);
                displayWeather(data);
            }
        })
        .catch((error) => {
            logEvent(`Weather API Request Failed: ${error.message}`);
            document.getElementById("error-message").textContent = "Error fetching weather data!";
        });
}

// Function to display weather data
function displayWeather(data) {
    document.getElementById("error-message").textContent = "";
    document.getElementById("city-name").textContent = `Weather in ${data.city}`;
    document.getElementById("weather-description").textContent = data.description;
    document.getElementById("temperature").textContent = data.temperature;
    document.getElementById("weather-icon").src = data.icon;
}

// Send log messages to the server
function logEvent(message) {
    fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: message })
    });
}
