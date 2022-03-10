let date = document.querySelector(".actual-date");

let days = [
  "Sunday",
  "Monday",
  "Tueday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let minutes = new Date().getMinutes();
let hours = new Date().getHours();

if (hours < 10) {
  hours = `0${hours}`;
}
if (minutes < 10) {
  minutes = `0${minutes}`;
}
date.innerHTML = `Last updated: ${
  days[new Date().getDay()]
} ${hours}:${minutes}`;

function convert(timeStamp) {
  weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return weekDays[new Date(timeStamp * 1000).getDay()];
}

function showForecast(response) {
  document.querySelector(".forecast").innerHTML = ``;

  days = response.data.daily;

  document.querySelector(".forecast").innerHTML += `<div class="col-2 day-info">
          <div class="day">Tom</div>
          <div class="icon"><img src= "http://openweathermap.org/img/wn/${
            days[1].weather[0].icon
          }@2x.png" alt="" class="icon-forecast"></div>
          <div class="row temperature"> 
            <div class="col-6 max">${Math.round(days[1].temp.max)}°</div>
          
            <div class="col-6 min">${Math.round(days[1].temp.min)}°</div>
          </div>`;

  for (i = 2; i < 6; i++) {
    document.querySelector(
      ".forecast"
    ).innerHTML += `<div class="col-2 day-info">
          <div class="day">${convert(days[i].dt)}</div>
          <div class="icon"><img src= "http://openweathermap.org/img/wn/${
            days[i].weather[0].icon
          }@2x.png" alt="" class="icon-forecast"></div>
          <div class="row temperature"> 
            <div class="col-6 max">${Math.round(days[i].temp.max)}°</div>
          
            <div class="col-6 min">${Math.round(days[i].temp.min)}°</div>
          </div>`;
  }
}

function getForecastInfos(coordinates, unit) {
  let apiKey = "7a3a06bc53009599c7a0058ddd4c4727";
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${unit}`;
  axios.get(url).then(showForecast);
}

function change(response) {
  document.querySelector("#temp").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector(
    "#here"
  ).innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  document.querySelector("#searched-city").value = response.data.name;
  document.querySelector(".wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector(".humidity").innerHTML = response.data.main.humidity;
  document.querySelector(".weather-description").innerHTML =
    response.data.weather[0].main;
  document
    .querySelector(".img-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector(".img-icon")
    .setAttribute("alt", response.data.weather[0].description);

  getForecastInfos(response.data.coord, "metric");
}

function showCurrentInfos(position) {
  let apiKey = "7a3a06bc53009599c7a0058ddd4c4727";
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(url).then(change);
  document.querySelector("#celsius").innerHTML = "| <strong>°C </strong>";
  document.querySelector("#fahrenheit").innerHTML = " °F";
}

function searchCurrentWeather(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showCurrentInfos);
}

let buttonCurrent = document.querySelector("#here-now");
buttonCurrent.addEventListener("click", searchCurrentWeather);
function changeF(response) {
  console.log("fahrenheit:", response.data);
  document.querySelector("#temp").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector(
    "#here"
  ).innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  document.querySelector("#searched-city").value = response.data.name;
  document.querySelector(".wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector(".humidity").innerHTML = response.data.main.humidity;
  document.querySelector(".weather-description").innerHTML =
    response.data.weather[0].main;
  document
    .querySelector(".img-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector(".img-icon")
    .setAttribute("alt", response.data.weather[0].description);
  getForecastInfos(response.data.coord, "imperial");
}
function toFahrenheit(event) {
  event.preventDefault();
  let apiKey = "7a3a06bc53009599c7a0058ddd4c4727";
  let city = document.querySelector("#searched-city").value;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  axios.get(url).then(changeF);
  document.querySelector("#celsius").innerHTML = "°C ";
  document.querySelector("#fahrenheit").innerHTML = "| <strong> °F </strong>";
  document.querySelector(".wind-unit").innerHTML = " mph";
}
let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", toFahrenheit);

function toCelsius(event) {
  event.preventDefault();
  let apiKey = "7a3a06bc53009599c7a0058ddd4c4727";
  let city = document.querySelector("#searched-city").value;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(url).then(change);
  document.querySelector("#celsius").innerHTML = "| <strong>°C </strong>";
  document.querySelector("#fahrenheit").innerHTML = " °F";
  document.querySelector(".wind-unit").innerHTML = " m/s";
}

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", toCelsius);

let searchBtn = document.querySelector("#search-button");
searchBtn.addEventListener("click", toCelsius);

let apiKey = "7a3a06bc53009599c7a0058ddd4c4727";
document.querySelector("#searched-city").value = "New York";

let url = `https://api.openweathermap.org/data/2.5/weather?q=${
  document.querySelector("#searched-city").value
}&appid=${apiKey}&units=metric`;
axios.get(url).then(change);
