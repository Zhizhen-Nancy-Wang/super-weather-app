/*currentTime currentTime*/

let nowTime = new Date();

let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let currentDay = document.querySelector("#crt-day");
currentDay.innerHTML = `${days[nowTime.getDay()]}`;
let currentTime = document.querySelector("#crt-time");
currentTime.innerHTML = `${nowTime.getHours()}:${nowTime.getMinutes()}`;

let searchBar = document.querySelector("#search-form");

searchBar.addEventListener("submit", function (event) {
  event.preventDefault();
  document.querySelector("#input-location").innerHTML =
    document.querySelector("#city-input").value;
  let city = document.querySelector("#city-input").value;

  searchCity(city);

  // APIAPI  search city temp+ description + feels_like

  function searchCity(city) {
    let apiKey = "88bd6dd00f81a7aa3e1bf9be1b5a37c7";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&&units=metric`;

    axios.get(apiUrl).then(function (response) {
      console.log(response);
      let crtImg = document.querySelector("#crt-img");
      let iconId = response.data.weather[0].id;
      // console.log(iconId);

      if (iconId <= 232) {
        crtImg.src = "images/light_thunder_.svg";
      } else if ((300 <= iconId && iconId <= 311) || iconId == 500) {
        crtImg.src = "images/light_rain.svg";
      } else if (
        (312 <= iconId && iconId <= 321) ||
        (501 <= iconId && iconId <= 531)
      ) {
        crtImg.src = "images/heavy_rain.svg";
      } else if (600 <= iconId && iconId <= 622) {
        crtImg.src = "images/snow.svg";
      } else if (701 <= iconId && iconId <= 781) {
        crtImg.src = "images/mist.svg";
      } else if (iconId == 800) {
        crtImg.src = "images/clear.svg";
      } else if (iconId == 801 || iconId == 802) {
        crtImg.src = "images/few_clouds.svg";
      } else if (iconId == 803 || iconId == 804) {
        crtImg.src = "images/overcast_clouds.svg";
      }
      //api connect to get UV and POP
      let latInput = response.data.coord.lat;
      let lonInput = response.data.coord.lon;

      let apiUrlOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${latInput}&lon=${lonInput}&units=metric&exclude=minutely&appid=${apiKey} `;
      axios.get(apiUrlOneCall).then(function (responseOneCall) {
        console.log(responseOneCall);

        document.querySelector("#uv-info").innerHTML = `${Math.round(
          responseOneCall.data.current.uvi
        )} / 13`;

        document.querySelector("#rainfall-info").innerHTML = `${Math.round(
          responseOneCall.data.daily[0].pop * 100
        )} %`;

        let forecast = responseOneCall.data.daily;

        function displayForecast() {
          let forecastElement = document.querySelector("#forecast");

          let forecastHTML = `<div class="row">`;
          //convert time from dt to human time
          function convertTime(timestamp) {
            let date = new Date(timestamp * 1000);
            let day = date.getDay();
            let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

            return days[day];
          }
          //change forecast Img//////////////////
          function changeImg(iconId) {
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
          }

          //display forcasted four-day weather at the bottom
          forecast.forEach(function (forecastDay, index) {
            if (index < 5 && index != 0) {
              console.log(forecastDay.weather[0].id);
              forecastHTML =
                forecastHTML +
                `  <div class="col bottom-detail" >
              <div class="forecast-daily mt-2">
                <div class="btm-dates">${convertTime(forecastDay.dt)}</div>
                <img src="${changeImg(
                  forecastDay.weather[0].id
                )}" class="mb-2" width="35px alt="
                weather-img" />
                <div class="highest">${Math.round(forecastDay.temp.max)}°C</div>
                <div class="lowest">${Math.round(forecastDay.temp.min)}°C</div>
              </div> 
              </div>`;

              // Fbutton search city currentTemp convert

              document
                .querySelector("#F-btn")
                .addEventListener("click", function () {
                  fConvert = (forecastDay.temp.max * 9) / 5 + 32;
                  // console.log(fConvert);
                  let fConvertRound = Math.round(fConvert);
                  let highest = document.querySelector("#highest");
                  highest.innerHTML = `${fConvertRound} °F`;
                  console.log(highest.innerHTML);
                });

              //Cbutton  currentTemp feels like convert

              document
                .querySelector("#F-btn")
                .addEventListener("click", function () {
                  cConvert = (forecastDay.temp.min * 9) / 5 + 32;
                  // console.log(cConvert);
                  let cConvertRound = Math.round(cConvert);
                  let lowest = document.querySelector("#lowest");
                  lowest.innerHTML = `${cConvertRound} °F`;
                });
            }
          });

          forecastHTML = forecastHTML + `</div>`;
          forecastElement.innerHTML = forecastHTML;
        }
        displayForecast();
      });

      //API connect search city to feels-like, temp, city description, wind, humidity
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
      ).innerHTML = `${response.data.main.humidity}%`; //search city humidity

      //Cbutton search city currentTemp convert
      let currentTemp = document.querySelector("#crt-cel");

      document.querySelector("#C-btn").addEventListener("click", function () {
        currentTemp.innerHTML = `${Math.round(response.data.main.temp)} °C`;
      });

      //Fbutton search city currentTemp convert

      document.querySelector("#F-btn").addEventListener("click", function () {
        fConvert = (response.data.main.temp * 9) / 5 + 32;
        let fConvertRound = Math.round(fConvert);
        currentTemp.innerHTML = `${fConvertRound} °F`;
      });

      //Cbutton  currentTemp feels like convert

      document.querySelector("#C-btn").addEventListener("click", function () {
        document.querySelector("#num-feelslike").innerHTML = `${Math.round(
          response.data.main.feels_like
        )} °C`;
      });

      //Cbutton  currentTemp feels like convert
      document.querySelector("#F-btn").addEventListener("click", function () {
        fConvert = (response.data.main.feels_like * 9) / 5 + 32;
        let fConvertRound = Math.round(fConvert);
        document.querySelector(
          "#num-feelslike"
        ).innerHTML = `${fConvertRound} °F`;
      });
    });
    // console.log(response);
  }
});

// APIAPI current location btn// current location btn api// current location btn api// current location btn api// current location btn api

navigator.geolocation.getCurrentPosition(retrievePosition);
function retrievePosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "88bd6dd00f81a7aa3e1bf9be1b5a37c7";
  let apiUrlOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely&appid=${apiKey} `;
  let apiUrlCurrentWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  axios.get(apiUrlOneCall).then(function (responseOneCall) {
    //bottom weather forecast data connection
    let forecast = responseOneCall.data.daily;
    // console.log(forecast);

    function displayForecast() {
      let forecastElement = document.querySelector("#forecast");

      let forecastHTML = `<div class="row">`;
      //convert time from dt to human time
      function convertTime(timestamp) {
        let date = new Date(timestamp * 1000);
        let day = date.getDay();
        let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        return days[day];
      }

      //display forcasted four-day weather at the bottom
      forecast.forEach(function (forecastDay, index) {
        if (index < 5 && index != 0) {
          forecastHTML =
            forecastHTML +
            `  <div class="col bottom-detail" >
                  <div class="forecast-daily mt-2">
                    <div class="btm-dates">${convertTime(forecastDay.dt)}</div>
                    <img src="images/rain.png" class="mb-2" width="35px alt="
                    weather-img" />
                    <div class="highest" id= "highest">${Math.round(
                      forecastDay.temp.max
                    )}°C</div>
                    <div class="lowest" id="lowest">${Math.round(
                      forecastDay.temp.min
                    )}°C</div>
                  </div>
                </div>`;
          highestC = `${Math.round(forecastDay.temp.max)}`;
          console.log(highestC);
          lowestC = `${Math.round(forecastDay.temp.min)}`;
          console.log(lowestC);
          //F-button convert bottom part?????????????????????????/!!!!!!!!
          document
            .querySelector("#F-btn")
            .addEventListener("click", function () {
              fConvert = (highestC * 9) / 5 + 32;
              console.log(fConvert);
              let fConvertRound = Math.round(fConvert);
              let highest = document.querySelector("#highest");
              highest.innerHTML = `${fConvertRound} °F`;
            });
          document
            .querySelector("#F-btn")
            .addEventListener("click", function () {
              fConvert = (lowestC * 9) / 5 + 32;

              let fConvertRound = Math.round(fConvert);
              let lowest = document.querySelector("#lowest");
              lowest.innerHTML = `${fConvertRound} °F`;
            });
        }
      });

      forecastHTML = forecastHTML + `</div>`;
      forecastElement.innerHTML = forecastHTML;
    }
    displayForecast();

    let buttonCL = document.querySelector("#current-loc-btn");
    buttonCL.addEventListener("click", function () {
      console.log(responseOneCall);

      document.querySelector("#crt-weather-des").innerHTML =
        responseOneCall.data.current.weather[0].description; //current loc description

      document.querySelector("#num-feelslike").innerHTML = `${Math.round(
        responseOneCall.data.current.feels_like
      )} °C`; //current loc feels like

      document.querySelector("#crt-cel").innerHTML = `${Math.round(
        responseOneCall.data.current.temp
      )} °C`; //current loc temperature

      document.querySelector("#wind-info").innerHTML = `${Math.round(
        responseOneCall.data.current.wind_speed
      )} m/s`; //current loc wind

      document.querySelector("#uv-info").innerHTML = `${Math.round(
        responseOneCall.data.current.uvi
      )} / 13`; //current loc uvi

      document.querySelector("#rainfall-info").innerHTML = `${Math.round(
        responseOneCall.data.hourly[0].pop * 100
      )} %`; //current loc pop

      document.querySelector(
        "#humidity"
      ).innerHTML = `${responseOneCall.data.current.humidity}%`; //current loc humidity

      //////////////////////////////////////////Cbutton  current-location temp
      let currentTemp = document.querySelector("#crt-cel");

      document.querySelector("#C-btn").addEventListener("click", function () {
        currentTemp.innerHTML = `${Math.round(
          responseOneCall.data.current.feels_like
        )} °C`;
      });

      ////////////////////////////////////////Fbutton  current-location temp
      document.querySelector("#F-btn").addEventListener("click", function () {
        fConvert = (responseOneCall.data.current.feels_like * 9) / 5 + 32;

        let fConvertRound = Math.round(fConvert);
        currentTemp.innerHTML = `${fConvertRound} °F`;
      });

      ///////////////////////////Cbutton current-location feels like convert

      document.querySelector("#C-btn").addEventListener("click", function () {
        document.querySelector("#num-feelslike").innerHTML = `${Math.round(
          responseOneCall.data.current.feels_like
        )} °C`;
      });

      ///////////////////////////Fbutton current-location feels like convert
      document.querySelector("#F-btn").addEventListener("click", function () {
        fConvert = (responseOneCall.data.current.feels_like * 9) / 5 + 32;
        let fConvertRound = Math.round(fConvert);
        document.querySelector(
          "#num-feelslike"
        ).innerHTML = `${fConvertRound} °F`;
      });
    });

    /////////////////////////////////////////// change current temp icon
    let crtImg = document.querySelector("#crt-img");
    let iconId = responseOneCall.data.current.weather[0].id;
    // console.log(iconId);

    if (iconId <= 232) {
      crtImg.src = "images/light_thunder_.svg";
    } else if ((300 <= iconId && iconId <= 311) || iconId == 500) {
      crtImg.src = "images/light_rain.svg";
    } else if (
      (312 <= iconId && iconId <= 321) ||
      (501 <= iconId && iconId <= 531)
    ) {
      crtImg.src = "images/heavy_rain.svg";
    } else if (600 <= iconId && iconId <= 622) {
      crtImg.src = "images/snow.svg";
    } else if (701 <= iconId && iconId <= 781) {
      crtImg.src = "images/mist.svg";
    } else if (iconId == 800) {
      crtImg.src = "images/clear.svg";
    } else if (iconId == 801 || iconId == 802) {
      crtImg.src = "images/few_clouds.svg";
    } else if (iconId == 803 || iconId == 804) {
      crtImg.src = "images/overcast_clouds.svg";
    }
  });

  axios.get(apiUrlCurrentWeather).then(function (responseCurrentWeather) {
    let buttonCL = document.querySelector("#current-loc-btn");
    buttonCL.addEventListener("click", function () {
      document.querySelector("#input-location").innerHTML =
        responseCurrentWeather.data.name;
    });
  });
}
