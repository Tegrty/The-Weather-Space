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
        alert("Please enter a valid City");
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
            // Pull relevant data from the API: temp, humidity, wind speed, and icon
            let date = new Date(weatherData.dt * 1000);
            let currentDate = date.toLocaleDateString();
            console.log(currentDate);
            let currentTemperture = weatherData.main.temp;
            let currentHumidity = weatherData.main.humidity;
            let currentWindSpeed = weatherData.wind.speed;
            let currentIcon = weatherData.weather[0].icon;
            console.log(currentTemperture, currentHumidity, currentWindSpeed, currentIcon);

            // use the latitude and longitude to make an API call to get the 5 day forecast
            let forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=baa97083d89e9450d3519e9d509f7876';
            let forecastResponse = await fetch(forecastApiUrl);
            let forecastData = await forecastResponse.json();
            // Pull relevant data from the API: temp, humidity, wind speed, and icon for each day
            let forecastTemperture = forecastData.list[0].main.temp;
            let forecastHumidity = forecastData.list[0].main.humidity;
            let forecastWindSpeed = forecastData.list[0].wind.speed;
            let forecastIcon = forecastData.list[0].weather[0].icon;
            console.log(forecastTemperture, forecastHumidity, forecastWindSpeed, forecastIcon);
            // Loop through the forecast data to get the data for each day. Incrementing by 8 because the API returns the forecast for every 3 hours. 8*3 = 24 hours
            for (let i = 0; i < forecastData.list.length; i += 8) {
                let forecastDate = new Date(forecastData.list[i].dt_txt); //converts the date from the API to a readable object
                let forecastTemperture = forecastData.list[i].main.temp;
                let forecastHumidity = forecastData.list[i].main.humidity;
                let forecastWindSpeed = forecastData.list[i].wind.speed;
                let forecastIcon = forecastData.list[i].weather[0].icon;
                console.log("Date: " + forecastDate.toLocaleDateString()); //converts the date object to a string
                console.log("Temperature: " + forecastTemperture);
                console.log("Humidity: " + forecastHumidity);
                console.log("Wind Speed: " + forecastWindSpeed);
                console.log("Icon: " + forecastIcon);
            }
        } else {
            throw new Error("Error: " + response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
};

searchFormEl.addEventListener('submit', formSubmitHandler);
