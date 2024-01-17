const apiKey = "64a76f07d5d0421df7ba397c32756d88";

async function getWeatherInfoByCoordinates(latitude, longitude) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch weather data");
        }

        const data = await response.json();
        console.log(data);
        updateWeatherUI(data);
    } catch (error) {
        console.error(error);
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const location = `Lat: ${latitude}, Long: ${longitude}`;
    
    getWeatherInfoByCoordinates(latitude, longitude);

    const locationElement = document.querySelector(".city");
    locationElement.textContent = location;
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation. If you had not denied the permission, please check whether the GPS is turned on or off and refresh the page.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}


window.onload = getLocation;

async function getWeatherInfo(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch weather data");
        }
        const data = await response.json();
        console.log(data);
        updateWeatherUI(data);
    } catch (error) {
        console.error(error);
    }
}

const cityPlace = document.querySelector(".city");
const temperature = document.querySelector(".temp");
const windSpeed = document.querySelector(".wind-speed");
const humidity = document.querySelector(".humidity");
const visibility = document.querySelector(".visibility-distance");

const descTxt = document.querySelector(".description-text");
const date = document.querySelector(".date");
const descIcon = document.querySelector(".description img"); 

function updateWeatherUI(data) {
    cityPlace.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    windSpeed.textContent = `${data.wind.speed} km/h`;
    humidity.textContent = `${data.main.humidity}%`;
    visibility.textContent = `${data.visibility / 1000} km`;
    descTxt.textContent = data.weather[0].description;
    
    const feelsLikeElement = document.querySelector(".feels-like");
    feelsLikeElement.textContent = `Feels like: ${Math.round(data.main.feels_like)}°C`;

    const currentDate = new Date();
    date.textContent = currentDate.toDateString();

    const weatherIconName = getIconName(data.weather[0].main);
    descIcon.src = `icons/${weatherIconName}.png`;
}

const formElement = document.querySelector(".search-form");
const inputElement = document.querySelector(".inputcity");

formElement.addEventListener("submit", function (e) {
    e.preventDefault();

    const city = inputElement.value;
    if (city !== "") {
        getWeatherInfo(city);
        inputElement.value = "";
    }
});

function getIconName(weatherCondition) {
    const iconMap = {
        Clear: "sunny",
        Clouds: "cloudy",
        Rain: "umbrella",
        Thunderstorm: "thunder",
        Drizzle: "grain",
        Snow: "snow",
        Mist: "mist",
        Smoke: "smoke",
        Haze: "mist",
        Fog: "fog",
    };

    return iconMap[weatherCondition] || "help";
}


