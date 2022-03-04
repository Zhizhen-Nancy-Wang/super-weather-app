/*currentTime currentTime*/

let nowTime = new Date();

let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let currentDay = document.querySelector("#crt-day");
currentDay.innerHTML = `${days[nowTime.getDay()]}`;
let currentTime = document.querySelector("#crt-time");
currentTime.innerHTML = `${nowTime.getHours()}:${nowTime.getMinutes()}`;

/*Connect API*/
let apiKey = "88bd6dd00f81a7aa3e1bf9be1b5a37c7";

/////////////////////////////////////////////////CITY INPUT//////////////////////////////////////
//capture city input
const handleOnSubmit = (e) => {
  const frmDt = new FormData(e);
  console.log(frmDt);
  const cityInput = frmDt.get("cityInput");
  console.log(cityInput);
  document.querySelector("#input-location").innerHTML = cityInput;

  //get apiUrl
  const getWeatherInfo = () => {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&&units=metric`;

    axios.get(apiUrl).then(displayCityInput);
    axios.get(apiUrl).then(getLatLon);
  };
  getWeatherInfo();
};

//apiUrlOneCall get cityInput lon and lat
const getLatLon = (response) => {
  let latInput = response.data.coord.lat;
  let lonInput = response.data.coord.lon;

  let apiUrlOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${latInput}&lon=${lonInput}&units=metric&exclude=minutely&appid=${apiKey} `;
  axios.get(apiUrlOneCall).then(getPopUv);
  axios.get(apiUrlOneCall).then(displayForecastCityInput);
};

//apiUrl connect search city to feels-like, temp, city description, wind, humidity
const displayCityInput = (response) => {
  document.querySelector("#num-feelslike").innerHTML = `${Math.round(
    response.data.main.feels_like
  )} °C`; //search city feels-like

  document.querySelector("#crt-cel").innerHTML = `${Math.round(
    response.data.main.temp
  )} °C`; //search city temperatrue

  document.querySelector("#crt-weather-des").innerHTML =
    response.data.weather[0].description; //search city description

  document.querySelector("#wind-info").innerHTML = `${Math.round(
    response.data.wind.speed
  )} m/s`; //search city wind

  document.querySelector(
    "#humidity"
  ).innerHTML = `${response.data.main.humidity}%`;
};

//apiUrlOneCall to get POP and UV
const getPopUv = (responseOneCall) => {
  document.querySelector("#uv-info").innerHTML = `${Math.round(
    responseOneCall.data.current.uvi
  )} / 13`;

  document.querySelector("#rainfall-info").innerHTML = `${Math.round(
    responseOneCall.data.daily[0].pop * 100
  )} %`;
};

const displayForecastCityInput = (responseOneCall) => {
  let forecast = responseOneCall.data.daily;
  let forecastHTML = `<div class="row">`;

  //console.log(forecast);
  let forecastElement = document.querySelector("#forecast");

  forecast.forEach((forecastDay, index) => {
    if (index < 5 && index != 0) {
      let forecastHTML = `<div class="row">`;
      forecastHTML += `
             <div class="col bottom-detail">
                <div class="forecast-daily mt-2">
                  <div class="btm-dates">Tue</div>
                  <img src="images/rain.png" class="mb-2" width="35px alt="
                  weather-img" />
                  <div class="highest">24°C</div>
                  <div class="lowest" id="lowest">20°C</div>
                </div>
              </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
};
