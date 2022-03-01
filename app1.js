function getDay(day) {
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let currentDay = days[day];
  return currentDay;
}

function getMonth(month) {
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let currentMonth = months[month];
  return currentMonth;
}

//funtion to add zeros to minutes
function addZero(min) {
  if (min < 10) {
    min = "0" + min;
    return min;
  } else {
    return min;
  }
}

//function to display forecase of next 5 days
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#weather-forecast");

  forecastHTML = `<ul class="table" id="forecast-table">`;

  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 6) {
      forecastHTML =
        forecastHTML +
        `   <li class="col">
            ${formatForecastTimeStamp(forecastDay.dt)} <br/>
            <br />
            <img src="http://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png" alt="${forecastDay.weather[0].description}" width="50" />
             <br/>
             <pre class="high">Hi<span class="maxTemp">${Math.round(
               forecastDay.temp.max
             )}</span>°</pre>
             <pre class="low">Lo<span class="minTemp">${Math.round(
               forecastDay.temp.min
             )}</span>°</pre>
          </li>`;
    }
  });

  forecastHTML = forecastHTML + `</ul>`;
  forecastElement.innerHTML = forecastHTML;
}

//Funtion to format the Unix time stamp
function formatDate(timestamp) {
  let dt = new Date(timestamp);
  let hrs = dt.getHours();
  let mins = addZero(dt.getMinutes());
  let updatedDay = getDay(dt.getDay());
  let month = getMonth(dt.getMonth());
  let year = dt.getFullYear();
  let currentDt = currentDate.getDate();

  let lastUpdatedTime = `${updatedDay} ${month} ${currentDt} ${year} ${hrs}:${mins}`;
  let sunRiseSetTime = `${hrs}:${mins}`;
  return [lastUpdatedTime, sunRiseSetTime];
}

function formatForecastTimeStamp(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = getDay(date.getDay(timestamp));
  let forecastDate = date.getDate();

  let formatDate = `${day} ${forecastDate}`;
  return formatDate;
}

function getCoordinates(coordinates) {
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=Imperial`;
  axios.get(`${apiURL}`).then(displayForecast);
}

function getWeather(response) {
  //Setting the City Name on the App
  document.querySelector("h1").innerHTML = response.data.name;

  //Setting the Current Temp
  tempInF = response.data.main.temp;
  document.getElementById("currTemp").innerHTML = `${Math.round(tempInF)} °F`;

  //Setting the Feels Like Temp
  feelsLikeTempInF = response.data.main.feels_like;
  document.getElementById("feels-like").innerHTML = `Feels like ${Math.round(
    feelsLikeTempInF
  )} °F`;

  //Setting the High Temp
  highTempInF = response.data.main.temp_max;
  document.getElementById("high").innerHTML = Math.round(highTempInF);

  //Setting the Low Temp
  lowTempInF = response.data.main.temp_min;
  document.getElementById("low").innerHTML = Math.round(lowTempInF);

  //Setting the Current Condition
  let currentCondition = document.getElementById("currCondition");
  //console.log(currentCondition);
  currentCondition.innerHTML = response.data.weather[0].description;
  console.log(response.data.weather[0].description);

  displayWarning(currentCondition);

  //Setting the Wind
  document.getElementById("wind").innerHTML = `${Math.round(
    response.data.wind.speed
  )} mph`;

  //Setting the Visibility
  visibilityInMiles = Math.round(response.data.visibility / 1600);
  document.getElementById(
    "visibility"
  ).innerHTML = `${visibilityInMiles} miles`;

  //Setting the updated by Time
  let formatUpdatedDate = formatDate(response.data.dt * 1000);
  document.getElementById("updatedTime").innerHTML = formatUpdatedDate[0];

  //Setting the Sunrise Time
  let formatSunriseDate = formatDate(response.data.sys.sunrise * 1000);
  document.getElementById("sunrise").innerHTML = formatSunriseDate[1];

  //Setting the Sunset Time
  let formatSunsetDate = formatDate(response.data.sys.sunset * 1000);
  document.getElementById("sunset").innerHTML = formatSunsetDate[1];

  //Setting the Weather icon
  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  //Setting the alt text
  icon.setAttribute("alt", response.data.weather[0].description);

  //get latitude and longitude to displayed forecase of next 5 days
  getCoordinates(response.data.coord);
}

function searchForCity(city) {
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=Imperial&appid=${apiKey}`;
  axios.get(`${apiURL}`).then(getWeather);
}

function getCityName(event) {
  event.preventDefault();
  let city = document.querySelector("#citySearch").value;
  searchForCity(city);
}

function showCurrentLocation(position) {
  let apiURLCurrLoc = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=imperial&appid=${apiKey}`;
  axios.get(`${apiURLCurrLoc}`).then(getWeather);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showCurrentLocation);
}

//function to display warnings
function displayWarning(description) {
  description = description.innerHTML.toLowerCase().trim();

  if (
    description === "rain" ||
    description === "shower rain" ||
    description === "thunderstorm"
  ) {
    document.querySelector(
      ".warnings"
    ).innerHTML = `☂ Don´t forget your umbrella and rain coat ☂!`;
  } else {
    if (
      description === "clear sky" ||
      description === "few clouds" ||
      description === "broken clouds"
    ) {
      document.querySelector(".warnings").innerHTML = `👒 Enjoy the sun 🍨`;
    } else {
      if (description === "snow") {
        document.querySelector(
          ".warnings"
        ).innerHTML = `Bundle up nicely and drink something hot! ☕`;
      } else {
        if (description === "haze" || description === "mist") {
          document.querySelector(
            ".warnings"
          ).innerHTML = `With mist, drive carefully 🚘`;
        } else {
          document.querySelector(
            ".warnings"
          ).innerHTML = `Dress as per the temperature!`;
        }
      }
    }
  }
}

//Function to convert temperature to Celsius
function convertTemp() {
  let metricBtn = document.getElementById("chngeMetric");
  let forecastMax = document.querySelectorAll(".maxTemp");
  let forecastMin = document.querySelectorAll(".minTemp");

  if (metricBtn.innerHTML.trim() === "°C") {
    metricBtn.innerHTML = "°F";
    metricBtn.style.backgroundColor = "#3e8e41";
    metricBtn.style.color = "#FFFF";

    //Converting temperature from Farenheit to Celsius
    let currTempInCel = ((tempInF - 32) * 5) / 9;
    let feelsLikeTempInCel = ((feelsLikeTempInF - 32) * 5) / 9;
    let highTempInCel = ((highTempInF - 32) * 5) / 9;
    let lowTempInCel = ((lowTempInF - 32) * 5) / 9;

    //Setting the current temp in Celsius
    document.getElementById("currTemp").innerHTML = `${Math.round(
      currTempInCel
    )} °C`;

    //Setting the feels like temp in Celsius
    document.getElementById("feels-like").innerHTML = `Feels like ${Math.round(
      feelsLikeTempInCel
    )} °C`;

    //Setting the high temp in Celsius
    document.getElementById("high").innerHTML = `${Math.round(highTempInCel)}`;

    //Setting the low temp in Celsius
    document.getElementById("low").innerHTML = `${Math.round(lowTempInCel)}`;

    //Setting the forecast high temp in Celsius
    forecastMax.forEach(function (forecast) {
      let currentTemp = forecast.innerHTML;
      console.log(currentTemp);
      forecast.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
    });

    //Setting the forecast low temp in Celsius
    forecastMin.forEach(function (forecast) {
      let currentTemp = forecast.innerHTML;
      forecast.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
    });
  } else {
    metricBtn.innerHTML = "°C";
    metricBtn.style.backgroundColor = "#FFFF";
    metricBtn.style.color = "black";
    document.getElementById("currTemp").innerHTML = `${Math.round(tempInF)} °F`;

    document.getElementById("feels-like").innerHTML = `Feels like ${Math.round(
      feelsLikeTempInF
    )} °F`;

    document.getElementById("high").innerHTML = `${Math.round(highTempInF)}`;

    document.getElementById("low").innerHTML = `${Math.round(lowTempInF)}`;

    //Setting the forecast high temp in Farenheit
    forecastMax.forEach(function (forecast) {
      let currentTemp = forecast.innerHTML;
      forecast.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
    });

    //Setting the forecast high temp in Farenheit
    forecastMin.forEach(function (forecast) {
      let currentTemp = forecast.innerHTML;
      forecast.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
    });
  }
}

let tempInF = null;
let feelsLikeTempInF = null;
let highTempInF = null;
let lowTempInF = null;

//Getting Current Date and Time
let currentDate = new Date();

let apiKey = "cf8267c6600edc57b47b1e642c93512f";

let currLocBtn = document.querySelector("#currLocation");
currLocBtn.addEventListener("click", getCurrentPosition);

let form = document.querySelector("form");
form.addEventListener("submit", getCityName);

searchForCity("New York");
