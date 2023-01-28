let searchFormEl = document.querySelector('#search-form');
let cityInputEl = document.querySelector('#city');
let currentWeatherEl = document.querySelector('#current-weather');
let futureWeatherEl = document.querySelector('#future-weather');

cityInputEl.addEventListener('submit', formSubmitHandler);

let formSubmitHandler = function (event) {
    event.preventDefault();

    var cityName = cityInputEl.value.trim();

    if (cityName) {
        getCurrentWeather(cityName);
    }
};

let getCurrentWeather = function(city){
    
    
}

