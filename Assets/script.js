let cities = [];

let weatherCardEl = document.querySelector("#current-weather");
let forecastContainerEl = document.querySelector("#forecastcontainer");
let forecastTitle = document.querySelector("#forecast");
let citySearch = document.querySelector("#city-search");
let form = document.getElementById("form");
let searchButton = document.getElementById("search-input");
let resultInputEl = document.getElementById("resultData");
//setting values for search parameters and prevent default settings
function formSubmitHandler(event) {
  event.preventDefault();

  let city = citySearch.value.trim();
  if (city) {
    getWeather(city);
    getFiveDay(city);
  } else {
    alert("Please enter a city");
  }
}
//on click event run function
form.addEventListener("submit", formSubmitHandler);

//api key for access
let key = "74434ed0ea8afed98cf775084be6928c";
var getWeather = function (city) {
//api url and fetch
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;
  // getCoordinates(city);
  fetch(apiURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayWeather(data, city);
    });

}


//5 day function
function getFiveDay(city) {
  let apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`

  fetch(apiURL)
    .then(
      function (resp) {
        resp.json().then(
          function (data) {
            displayFiveDayWeather(data);
          }
        )
      }
    )
}
//display information function
function displayFiveDayWeather(weather) {
  console.log("hello")
  forecastContainerEl.textContent = "";
  forecastTitle.textContent = "5-Day Forecast: ";
//for lop for 5 day forecast
  let forecast = weather.list;
  for (let i = 5; i < forecast.length; i = i + 8) {
    let dailyForecast = forecast[i];

    let forecastEl = document.createElement("div");
    forecast.classList = "card ffff";
//current day listing
    let forecastDate = document.createElement("h5");
    forecastDate.textContent = moment.unix(dailyForecast.dt).format("MMM D, YYYY");
    forecastEl.appendChild(forecastDate);

    // add weather image if cloudy or sunny, etc
    let weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`)
    forecastContainerEl.appendChild(weatherIcon);
    //temp display
    let forecastTempEl = document.createElement("span");
    forecastTempEl.textContent = "Temp: " + dailyForecast.main.temp + "F";
    forecastEl.appendChild(forecastTempEl);
    //humidity display
    let forecastHumEl = document.createElement("span");
    forecastHumEl.textContent = "Humidity: " + dailyForecast.main.humidity + "F";
    forecastEl.appendChild(forecastHumEl);
    //wind speed display
    let forecastWindEl = document.createElement("span");
    forecastWindEl.textContent = "Wind: " + dailyForecast.wind.speed + "MPH";
    forecastEl.appendChild(forecastTempEl);
    //append all created elements
    forecastContainerEl.appendChild(forecastEl)

  }


}
//city search function
function displayWeather(weather, searchCity) {
  // clear previous content
  weatherCardEl.textContent = "";
  resultInputEl.textContent = "";

  console.log(weather)
  // creating date element
  let currentDate = document.createElement("span");
  currentDate.textContent = " (" + moment(weather.dt.value).format("MM D, YYYY") + ") "
  resultInputEl.appendChild(currentDate)

  // add weather image
  let weatherIcon = document.createElement("img");
  weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
  resultInputEl.appendChild(weatherIcon);

  // adding temperature
  let temperatureEl = document.createElement("span");
  temperatureEl.textContent = "Temperature : " + weather.main.temp + "F";
  resultInputEl.appendChild(temperatureEl);

  // add humidity
  let humidityEl = document.createElement("span");
  humidityEl.textContent = "Humidity: " + weather.main.humidity + "%";
  resultInputEl.appendChild(humidityEl);

  // add wind speed
  let windspeedEl = document.createElement("span");
  windspeedEl.textContent = "Humidity: " + weather.wind.speed + " MPH";
  resultInputEl.appendChild(windspeedEl);

  let lat = weather.coord.lat;
  let lon = weather.coord.lon;

  getUVIndex(lat, lon);

}
//get city coordinates function
function getCoordinates(city) {
  fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + key, {

    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      getWeather(data[0].lat, data[0].lon)
    });
}
//uv index function
function getUVIndex(lat, lon) {
  let apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${key}&lat=${lat}&lon=${lon}`;

  fetch(apiURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayUVIndex(data);
    });
}
//display uv index
function displayUVIndex(index) {
  let uvIndexEl = document.createElement("div");
  uvIndexEl.textContent = "UV Index: ";
  uvIndexEl.classList = "list-item";

  uvIndexValue = document.createElement("span");
  uvIndexValue.textContent = index.value;

  if (index.value <= 2) {
    uvIndexValue.classList = "low";
  } else if (index.value > 2 && index.value <= 5) {
    uvIndexValue.classList = "medium";
  } else if (index.value > 5 && index.value <= 7) {
    uvIndexValue.classList = "high";
  } else if (index.value > 7 && index.value <= 10) {
    uvIndexValue.classList = "extemely-high";
  }

  

  uvIndexEl.appendChild(uvIndexValue);
  weatherCardEl.appendChild(uvIndexEl);

}