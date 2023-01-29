let searchFormEl = document.querySelector('#city-form');
let cityInputEl = document.querySelector('#city');
let currentWeatherEl = document.querySelector('#current-weather');
let futureWeatherEl = document.querySelector('#future-weather');
let searchBtn = document.querySelector('#searchBtn');

let formSubmitHandler = function(event) {
    event.preventDefault();
    let city = cityInputEl.value.trim();
    console.log(city);
    if (city) {
        getCityWeather(city);
        cityInputEl.value = "";
    } else {
        alert("Please enter a City");
    }
};
// Fetching the weather data from the API - aync function allows the use of await
let getCityWeather = async function(city) {
    let apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=baa97083d89e9450d3519e9d509f7876";

    try {
        let response = await fetch(apiUrl);
        if (response.ok) {
            let data = await response.json();
            let lat = data[0].lat;
            let lon = data[0].lon;
            console.log("Latitude: " + lat + ", Longitude: " + lon);
            
            // use the latitude and longitude to make an API call to get the current weather
            let weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=baa97083d89e9450d3519e9d509f7876';
            let weatherResponse = await fetch(weatherApiUrl);
            let weatherData = await weatherResponse.json();
            console.log(weatherData);
            let currentTemperture = weatherData.main.temp;
            let currentHumidity = weatherData.main.humidity;
            let currentWindSpeed = weatherData.wind.speed;
            let currentIcon = weatherData.weather[0].icon;
            console.log(currentTemperture, currentHumidity, currentWindSpeed, currentIcon);
        } else {
            throw new Error("Error: " + response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
};

searchFormEl.addEventListener('submit', formSubmitHandler);
