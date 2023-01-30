let searchFormEl = document.querySelector('#city-form');
let cityInputEl = document.querySelector('#city');
let currentWeatherEl = document.querySelector('#current-weather');
let futureWeatherEl = document.querySelector('#future-weather');
let searchBtn = document.querySelector('#searchBtn');
let forecastWeatherEl = document.querySelector('#forecast-weather');
let historyEl = document.querySelector('#history');

let formSubmitHandler = function(event) {
    event.preventDefault();
    clearPreviousForecast();
    clearPreviousCurrent();
    let city = cityInputEl.value.trim();
    if (city) {
        let cities = JSON.parse(localStorage.getItem("cities")) || [] // First get an array of cities from local storage, if there are none, create an empty array and add the city to it
        if(!cities.includes(city)){
            cities.push(city);
            localStorage.setItem("cities", JSON.stringify(cities));
        }
        getCityWeather(city);
        cityInputEl.value = "";
        createHistoryButtons();
    } else {
        alert("Please enter a valid City");
    }
};



// Fetching the weather data from the API - aync function allows the use of await
let getCityWeather = async function(city) {
    let apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=baa97083d89e9450d3519e9d509f7876&units=metric";

    try {
        let response = await fetch(apiUrl);
        if (response.ok) {
            let data = await response.json();
            let lat = data[0].lat;
            let lon = data[0].lon;
            console.log("Latitude: " + lat + ", Longitude: " + lon);
            
            // use the latitude and longitude to make an API call to get the current weather
            let weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=baa97083d89e9450d3519e9d509f7876&units=metric';
            let weatherResponse = await fetch(weatherApiUrl);
            let weatherData = await weatherResponse.json();
            // Pull relevant data from the API: temp, humidity, wind speed, and icon
            let date = new Date(weatherData.dt * 1000);
            let currentDate = date.toLocaleDateString();
            console.log(currentDate);
            let currentTemperture = weatherData.main.temp;
            let currentHumidity = weatherData.main.humidity;
            let currentWindSpeed = weatherData.wind.speed;
            let currentIcon = weatherData.weather[0].icon;
            console.log(currentTemperture, currentHumidity, currentWindSpeed, currentIcon);
            // Display the current weather data dynamically in #current-weather
            currentWeatherEl.innerHTML = `
            <h2> ${city.toUpperCase()} </h2>
            <h3>Date: ${currentDate}</h3>
            <p>Temperature: ${Math.round(currentTemperture)}°C</p>
            <p>Humidity: ${currentHumidity}%</p>
            <p>Wind Speed: ${currentWindSpeed}m/s</p>
            <img src="http://openweathermap.org/img/wn/${currentIcon}@2x.png">`;



            // use the latitude and longitude to make an API call to get the 5 day forecast
            let forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=baa97083d89e9450d3519e9d509f7876&units=metric';
            let forecastResponse = await fetch(forecastApiUrl);
            let forecastData = await forecastResponse.json();
            // Pull relevant data from the API: temp, humidity, wind speed, and icon for each day
            let forecastTemperture = forecastData.list[0].main.temp;
            let forecastHumidity = forecastData.list[0].main.humidity;
            let forecastWindSpeed = forecastData.list[0].wind.speed;
            let forecastIcon = forecastData.list[0].weather[0].icon;
            console.log(forecastTemperture, forecastHumidity, forecastWindSpeed, forecastIcon);
            // Loop through the forecast data to get the data for each day. Incrementing by 8 because the API returns the forecast for every 3 hours. 8*3 = 24 hours. 
            for (let i = 0; i < forecastData.list.length; i += 8) { // forecastData.list.length is 40, so this loop will run 5 times
                let forecastDate = new Date(forecastData.list[i].dt_txt); //converts the date from the API to a readable object
                let forecastTemperture = forecastData.list[i].main.temp;
                let forecastHumidity = forecastData.list[i].main.humidity;
                let forecastWindSpeed = forecastData.list[i].wind.speed;
                let forecastIcon = forecastData.list[i].weather[0].icon;
                console.log("Date: " + forecastDate.toLocaleDateString()); //converts the date object to a string
                // Display the forecast data dynamically in #future-weather
                $(forecastWeatherEl).append(`
                <div class="forecast-card col-lg">
                    <h3>${city.toUpperCase()}</h3>
                    <h4>${forecastDate.toLocaleDateString()}</h4>
                    <p>Temperature: ${Math.round(forecastTemperture)}°C</p>
                    <p>Humidity: ${forecastHumidity}%</p>
                    <p>Wind Speed: ${forecastWindSpeed}m/s</p>
                    <img src="http://openweathermap.org/img/wn/${forecastIcon}@2x.png">
                </div>`
            );

            }
        } else {
            throw new Error("Error: " + response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
};
// Clear the previous forecast data
let clearPreviousForecast = function() {
    forecastWeatherEl.innerHTML = "";
};

//clear the previous current weather data (adding this because clearPreviousForecast created latency when a new sarch is made, so i'm creating latency in the current search as well)
let clearPreviousCurrent = function() {
    currentWeatherEl.innerHTML = "";
};
// Create the history buttons
function createHistoryButtons() {
    let cities = JSON.parse(localStorage.getItem("cities")) || []
    historyEl.innerHTML = "";
    cities.forEach(function(city) {
        let historyBtn = document.createElement("button");
        historyBtn.innerHTML = city;
        historyBtn.addEventListener("click", function() {
            getCityWeather(city);
            clearPreviousForecast();
            clearPreviousCurrent();
        });
        historyEl.appendChild(historyBtn);
    });
}
// Load the buttons on page load/refresh
window.onload = function() {
    createHistoryButtons();
};  



searchFormEl.addEventListener('submit', formSubmitHandler);
