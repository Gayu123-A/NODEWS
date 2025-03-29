// Function to fetch weather based on user input
function fetchWeather() {
    const city = document.getElementById("city-input").value;
    if (!city) {
        document.getElementById("error-message").textContent = "Please enter a city!";
        return;
    }

    fetch(`/weather?city=${city}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('weather-info').innerHTML = "";
                document.getElementById("error-message").textContent = data.error;
            } else {
                displayWeather(data);
            }
        })
        .catch(error => {
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
    fetch(`/weather?lat=${lat}&lon=${lon}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('weather-info').innerHTML = "";
                document.getElementById("error-message").textContent = data.error;
            } else {
                document.getElementById("city-input").value = data.city;
                displayWeather(data);
            }
        })
        .catch(() => {
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