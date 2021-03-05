
// Global Variables
// let apiKey = "ff0a18ba5cd32a565822484c34ea4036";
let date = moment().format("ll");
let search = document.querySelector("#search-form");
let searchInput = document.querySelector("#search-input");
let searchResult = document.querySelector("#search-result");
let clearBtn = document.querySelector("clear-btn")
let fiveForecast = "https://api.openweathermap.org/data/2.5/forecast?4e5dbe7db2b5e9c8b47fa40b691443d5q={city name},{country code}"
let weatherNow = "https://api.openweathermap.org/data/2.5/weather?appid="
let uv = "https://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}"
let userSearch = JSON.parse(localStorage.getItem("userResults")) || [];

//Temperature HTML Variables
const cityTempDiv = document.createElement("div");
const cityDetailsDiv = document.createElement("div");
let cityNameEl = document.createElement("div");
let currentTempEl = document.createElement("div");
let humidityEl = document.createElement("div");
let windEl = document.createElement("div");
let uvIndexContainer = document.createElement("div");
let uvIndexEl = document.createElement("h4");
let uvValueDisplay = document.createElement("div");

// 5 day forecast HTML Variables
let fiveDay = document.querySelector("#fiveday-forcast");

// Search HTML variables
let searchWrap = document.querySelector("#search-wrap");
let userHistory = document.querySelector("#user-search-history");
let cityCount = 1;

// Get weather from openweatherapi based on the user search
let getWeather = function(city) {
    if (!city) {
        return;
    };
    let weatherAPI =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial&appidff0a18ba5cd32a565822484c34ea4036";
    fetch(weatherAPI).then(function (response) {
        if (!response || !response.ok) {
            throw new Error('There was an error');
        }
        return response.json();
    })
    // Create new elements based on the response data
    .then(function (response) {
        cityTempDiv.classList = 'temp-div';
        responseContainer.appendChild(cityTempDiv);
        cityDetailsDiv.classList = 'detail-div';
        responseContainer.appendChild(cityDetailsDiv);
        cityNameEl.innerHTML =
          "<h2 class='secondary-text'>Current Weather for <span class='font-weight-bold'>" + response.name + 
          "</span><h2><br><img class='icon' src='http://openweathermap.org/img/w/" + response.weather[0].icon +
          ".png' alt=Current weather icon/><h2 class='font-weight-bold secondary-text'>" + date + "</h2><br>";
        cityTempDiv.appendChild(cityNameEl);

        currentTempEl.innerHTML =
          "<h3 class='secondary-text'>Current Temperature:<span class='font-weight-bold'>" +
          " " +
          Math.round(response.main.temp) +
          "&#176F</span></h3><br>";
        cityTempDiv.appendChild(cityTempEl);

        humidityEl.innerHTML =
          "<h4 class='secondary-text'>Humidity:<span class='font-weight-bold'>" +
          " " +
          response.main.humidity +
          "%</span></h4>";
        cityDetailsDiv.appendChild(humidityEl);  

    })
}

// Function used to input user input and save the city to be used later
function userStoredWeather() {
    $("#user-history-list").empty();
    let userHistory = getTodayWeather().userHistory;
    if (userHistory) {
        for (let i = 0; i < userHistory.length; i++) {
            let item = $("<li class='list-group-item'></li>");
            item.text(userHistory[i].cityName);
            $("#userHistory").prepend(item);
        }
        $(".list-group-item").on('click', function(){
            getTodayWeather($(this).text());
            getWeeklyWeather($(this).text());
            console.log(userHistory);
        });
    }
}

// Show user Searches or returns empty if they have no past search
function getStoredWeather() {
    let storeUserData = JSON.parse(localStorage.getItem("storeUserData"));
    if (!storeUserData) {
        return {
            userHistory: [],
            data: {
                todayWeather: [],
                fiveForecast: []
            }
        };
    } else {
      return storeUserData;
    }
}



// Use local storage to produce weather that was searched for
function getTodayWeather(userCity) {
  let pullFrom = `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&units=imperial&appid=${apiKey}`;
  let userStoredWeather = getStoredWeather();
  let userHistory = userStoredWeather.userHistory;
  let currentTime = new Date().getTime();
  userCity = userCity.toLowerCase().trim();
  for (let i = 0; i < userHistory.length; i++) {
    if (
      userHistory[i].userCity.toLowerCase() == userCity &&
      currentTime < userHistory[i].dt * 1000 + 600000
    ) {
      for (let j = 0; j < userStoredWeather.data.todayWeather.length; j++) {
        if (
          userStoredWeather.data.todayWeather[j].name.toLowerCase() == userCity
        ) {
          showTodaysWeather(userStoredWeather.data.todayWeather[j]);
          return;
        }
      }
    }
  }
  // Pull data from API rather then local storage
  $.ajax({ url: pullFrom, method: "GET" }).then(function (results) {
    showTodayWeather(results);
    storeTodayWeather(results);
    console.log(results);
  });
}

// Keep data that user pulls so the city can easily be searched again
function storeTodayWeather(results) {
    let storeTodayWeather = getStoredWeather();
    let userHistoryInput = {
      userCity: results.name,
      dt: results.dt
    };
    storeTodayWeather.userHistory.push(userHistoryInput);
    storeTodayWeather.data.todayWeather.push(results);
    localStorage.setItem("storeUserData", JSON.stringify(storeUserData));    
}

function showTodayWeather(results) {
    let userCity = results.name;
    let date = new Date(results.dt * 1000);
    let weatherDescription = results.weather[0].main;
    let temp = results.main.temp;
    let humidity = results.main.humidity;
    let wind = results.wind.speed;
    let latitude = results.coord.latitude;
    let longitude = results.coord.longitude
    let weatherIcon = `https://openweathermap.org/img/w/${results.weather[0].icon}.png`;

    $("#input-city").text(userCity);
    $("#today").text(`(${date.getMonth() + 1}/${date.getDate()}/$${date.getFullYear()})`);
    $("#today-weather-icon").attr("src", weatherIcon);
    $("#today-weather-icon").attr("alt", description + " icon");
    $("#today-temp").text(temp);
    $("#today-humidity").text(humidity);
    $("#today-wind").text(wind);
    getUVIndex(longitude, latitude);
}

// Function to produce the uv index by local storage or api
function getUVIndex(longitude, latitude) {
    let uvUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${APIKEY}&lat=${lat}&lon=${lon}`;

    $.ajax({url: uvUrl, method: "GET"}).then(function (results){   
        let uvIndex= results.value;
        let todayUVLevel = $("#today-uv").attr("data-uv-level");
        $("#today-uv").removeClass(todayUVLevel);
        $("#today-uv").text(uvIndex);
        if (uvIndex < 3) {
            $("#today-uv").attr("data-uv-level", "uv-low");
        } else if (uvIndex < 6) {
          $("#today-uv").attr("data-uv-level", "uv-mod");  
        } else if (uvIndex < 8) {
            $("#today-uv").attr("data-uv-level", "uv-high");
        } else if (uvIndex < 11) {
            $("#today-uv").attr("data-uv-level", "uv-very-high");
        } else {
            $("#today-uv").attr("data-uv-level", "uv-ext");
        }
        $("#today-uv").addClass($("#today-uv").attr("data-uv-level"));
    });
}



