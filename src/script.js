/*currentTime currentTime*/

let nowTime = new Date();

let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

let minutes = new Date().getMinutes();
let hours = new Date().getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
if (minutes < 10) {
  minutes = `0${minutes}`;
}
document.querySelector("#crt-day").innerHTML = `${days[nowTime.getDay()]}`;
document.querySelector("#crt-time").innerHTML = `${hours}:${minutes}`;

/*APIkey*/
let apiKey = "88bd6dd00f81a7aa3e1bf9be1b5a37c7";
let units = "metric";

///////////////////////////////C&F Button/////////////////////////////

const toFahrenheit = () => {
  let cityInput = document.querySelector("#input-location").innerHTML;

  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&&units=${units}`;
  axios.get(apiUrl).then(changeF);
};

const changeF = (response) => {
  document.querySelector("#crt-cel").innerHTML = `${Math.round(
    response.data.main.temp
  )} °F`; //search city temperatrue

  document.querySelector("#num-feelslike").innerHTML = `${Math.round(
    response.data.main.feels_like
  )} °F`; //search city feels-like
  let latInput = response.data.coord.lat;
  let lonInput = response.data.coord.lon;
  let units = "imperial";
  let apiUrlOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${latInput}&lon=${lonInput}&units=${units}&exclude=minutely&appid=${apiKey} `;
  axios.get(apiUrlOneCall).then(displayForecast);
};

const toCelsius = () => {
  let cityInput = document.querySelector("#input-location").innerHTML;
  console.log(cityInput);
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&&units=${units}`;
  axios.get(apiUrl).then(displayCityInput);
  axios.get(apiUrl).then(getLatLon);
};

let Fbtn = document.querySelector("#F-btn");
Fbtn.addEventListener("click", toFahrenheit);

let Cbtn = document.querySelector("#C-btn");
Cbtn.addEventListener("click", toCelsius);

/////////////////////////////////////////////////CITY INPUT//////////////////////////////////////
//capture city input
const handleOnSubmit = (e) => {
  const frmDt = new FormData(e);
  console.log(frmDt);
  const cityInput = frmDt.get("cityInput");
  //console.log(cityInput);
  document.querySelector("#input-location").innerHTML = cityInput;
  //console.log(cityInput);
  getWeatherInfo(cityInput);
};

const getWeatherInfo = (cityInput) => {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&&units=${units}`;
  console.log(cityInput);
  axios.get(apiUrl).then(getLatLon);
  axios.get(apiUrl).then(displayCityInput);
};

//apiUrlOneCall get cityInput lon and lat
const getLatLon = (response) => {
  let latInput = response.data.coord.lat;
  let lonInput = response.data.coord.lon;

  let apiUrlOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${latInput}&lon=${lonInput}&units=${units}&exclude=minutely&appid=${apiKey} `;
  axios.get(apiUrlOneCall).then(getPopUv);
  axios.get(apiUrlOneCall).then(displayForecast);
};

//apiUrl connect search city to feels-like, temp, city description, wind, humidity
const displayCityInput = (response) => {
  document.querySelector("#crt-cel").innerHTML = `${Math.round(
    response.data.main.temp
  )} °C`; //search city temperatrue

  document.querySelector("#num-feelslike").innerHTML = `${Math.round(
    response.data.main.feels_like
  )} °C`; //search city feels-like

  document.querySelector("#crt-weather-des").innerHTML =
    response.data.weather[0].description; //search city description

  document.querySelector("#wind-info").innerHTML = `${Math.round(
    response.data.wind.speed
  )} m/s`; //search city wind

  document.querySelector(
    "#humidity"
  ).innerHTML = `${response.data.main.humidity}%`;

  document.querySelector("#crt-img").src = changeImg(
    response.data.weather[0].id
  );

  console.log(response);
};

//apiUrlOneCall to get POP and UV
const getPopUv = (responseOneCall) => {
  document.querySelector("#uv-info").innerHTML = `${Math.round(
    responseOneCall.data.current.uvi
  )} / 13`;

  document.querySelector("#rainfall-info").innerHTML = `${Math.round(
    responseOneCall.data.daily[0].pop * 100
  )} %`;
  //console.log(responseOneCall);
};

//convert time from dt to weekdays
const convertTime = (timestamp) => {
  // let date = new Date(timestamp * 1000); //*1000 to convert form the Unix timestamp to JavaScript timestamp.
  let date = new Date(timestamp * 1000);
  //console.log(date);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  //console.log(days[day]);

  return days[day];
};

//display forcastCityInput
const displayForecast = (responseOneCall) => {
  let forecast = responseOneCall.data.daily;
  let forecastHTML = `<div class="row">`;
  //console.log(forecast);

  let forecastElement = document.querySelector("#forecast");

  //console.log(forecastElement);

  //display city input forecast
  forecast.forEach((forecastDay, index) => {
    if (index < 4 && index != 0) {
      forecastHTML += `
             <div class="col bottom-detail">
                <div class="forecast-daily mt-2">
                  <div class="btm-dates">${convertTime(forecastDay.dt)}</div>
                <img src="${changeImg(
                  forecastDay.weather[0].id
                )}" class="mb-2" width="35px alt="weather-img" />
                  <div class="highest">${Math.round(
                    forecastDay.temp.max
                  )}°</div>
                  <div class="lowest" id="lowest">${Math.round(
                    forecastDay.temp.min
                  )}°</div>
                </div>
              </div>   
  `;
    } else if (index === 0) {
      document.querySelector("#crt-day").innerHTML = `${convertTime(
        forecastDay.dt
      )}`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
};

////change forecast Img//////////////////
const changeImg = (iconId) => {
  if (iconId <= 232) {
    src = "images/light_thunder_.svg";
  } else if ((300 <= iconId && iconId <= 311) || iconId == 500) {
    src = "images/light_rain.svg";
  } else if (
    (312 <= iconId && iconId <= 321) ||
    (501 <= iconId && iconId <= 531)
  ) {
    src = "images/heavy_rain.svg";
  } else if (600 <= iconId && iconId <= 622) {
    src = "images/snow.svg";
  } else if (701 <= iconId && iconId <= 781) {
    src = "images/mist.svg";
  } else if (iconId == 800) {
    src = "images/clear.svg";
  } else if (iconId == 801 || iconId == 802) {
    src = "images/few_clouds.svg";
  } else if (iconId == 803 || iconId == 804) {
    src = "images/overcast_clouds.svg";
  }
  return src;
};

////////////////////////////CURRENT LOCATION///////////////////////

let crtLocationBtn = document.querySelector("#current-loc-btn");

crtLocationBtn.addEventListener(
  "click",
  navigator.geolocation.getCurrentPosition((position) => {
    // console.log(position);

    let apiUrlOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${units}&exclude=minutely&appid=${apiKey} `;
    let apiUrlCurrentWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}`;

    axios.get(apiUrlOneCall).then(getPopUv);
    axios.get(apiUrlOneCall).then(displayCLInfo);
    axios.get(apiUrlCurrentWeather).then(displayCLName);
    axios.get(apiUrlOneCall).then(displayForecast);
  })
);

const displayCLInfo = (responseOneCall) => {
  document.querySelector("#crt-weather-des").innerHTML =
    responseOneCall.data.current.weather[0].description; //current weather description

  document.querySelector("#num-feelslike").innerHTML = `${Math.round(
    responseOneCall.data.current.feels_like
  )} °C`; //current loc feels like

  document.querySelector("#crt-cel").innerHTML = `${Math.round(
    responseOneCall.data.current.temp
  )} °C`; //current loc temperature

  document.querySelector("#wind-info").innerHTML = `${Math.round(
    responseOneCall.data.current.wind_speed
  )} m/s`; //current loc wind

  document.querySelector(
    "#humidity"
  ).innerHTML = `${responseOneCall.data.current.humidity}%`; //humidity
  //console.log(responseOneCall);
};

const displayCLName = (responseCurrentWeather) => {
  //console.log(responseCurrentWeather);
  document.querySelector("#input-location").innerHTML =
    responseCurrentWeather.data.name;
};
