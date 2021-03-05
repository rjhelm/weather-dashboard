
// Global Variables
// let apiKey = "ff0a18ba5cd32a565822484c34ea4036";
let date = moment().format("ll");
let search = document.querySelector("#search-form");
let searchInput = document.querySelector("#search-input");
let searchResult = document.querySelector("#search-result");
let clearBtn = document.querySelector("clear-btn")

// let userSearch = JSON.parse(localStorage.getItem("userResults")) || [];

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
let forecastContainer = document.querySelector("#forecast-result");

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
        
        windEl.innerHTML =
          "<h4 class='secondary-text'>Wind Speed:<span class='font-weight-bold'>" +
          " " +
          Math.round(response.wind.speed) +
          " MPH</span></h4>";
        cityDetailsDiv.appendChild(windEl);  

        return fetch("https://api.openweathermap.org/data/2.5/uvi?appid=ff0a18ba5cd32a565822484c34ea4036at=" + response.coord.lat + "&lon=" + response.coord.lon);
    })
    .then(function (uvFetch) {
        return uvFetch.json();
    })
    .then(function (uvResponse) {
        uvIndexContainer.setAttribute("id", "uv-value");
        uvIndexContainer.classList = "secondary-text uv-class";
        cityDetailsDiv.appendChild(uvIndexContainer);
        let uvValue = uvResponse.value;
        uvIndexEl.innerHTML = "UV Index: ";
        uvValueDisplay.setAttribute("id", "uv-index");
        uvValueDisplay.innerHTML = uvValue;
        uvIndexContainer.appendChild(uvIndexEl);
        uvIndexContainer.appendChild(uvValueDisplay);

        if (uvResponse.value <= 2) {
            document.querySelector("#uv-index").classList = "uv-result rounded bg-success";
        } else if (uvResponse.value >= 2 && uvResponse.value <= 7) { 
            document.querySelector("#uv-index").classList = "uv-result rounded bg-warning";
        } else if (uvResponse.value < 7) {
            document.querySelector("#uv-index").classList = "uv-result rounded bg-danger";    
        }
        return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + uvResponse.lat + "&lon=" + uvResponse.lon + "&appid=ff0a18ba5cd32a565822484c34ea4036&units=imperial");
    })
    .then(function (forecastResponse) {
        return forecastResponse.json();
    })
    .then(function (forecastResponse) {
        for (let i = 1; i < 6; i++) {
            let forecastEl = document.createElement("div");
            forecastEl.classList = "forecast-card card-body rounded-md border-dark bg-info text-light"
            forecastContainer.appendChild(forecastEl);

            let dateDiv = document.createElement("div");
            dateDiv.classList = "secondary-text card-title";
            let forecastDate = moment.utc(forecastResponse.daily[i].dt * 1000).format("MM/DD/YYYY");
            dateDiv.innerHTML = "<h4 class='font-weight-bold>" + forecastDate + "</h4>";
            forecastEl.appendChild(dateDiv);
                
            let iconDiv = document.createElement("div");
            iconDiv.innerHTML = "<img src='http://openweathermap.org/img/w/" + forecastResponse.daily[i].weather[0].icon + ".png' class='forecast-icon' alt=Current weather icon/>";
            forecastEl.appendChild(iconDiv);

            let tempDiv = document.createElement("div");
            tempDiv.classList = "card-text secondary-text";
            tempDiv.innerHTML = "<h5>Day Temp:<span>" + " " + Math.round(forecastResponse.daily[i].temp.day) + "&#176F</span></h5>" + "<h5>Night Temp:<span>" + " " + Math.round(forecastResponse.daily[i].temp.night) + " &#176F</span></h5>";
            forecastEl.appendChild(tempDiv);

            let humidityDiv = document.createElement("div");
            humidityDiv.classList = "card-text secondary-text";
            humidityDiv.innerHTML = "<h5>Humidity:<span>" + " " + forecastResponse.daily[i].humidity + "%</span></h5>";
            forecastEl.appendChild(humidityDiv);
        }
    })
    .catch(function (error){
        removePrevious();
        alert(error.message);
        document.querySelector("#search-bar").value = "";
    }); 
};


let searchEvent = function(event) {
    event.preventDefault();
    let searchValue = searchBar.value.trim().toUpperCase();
    if (searchValue) {
        weatherRequest(searchValue);
        createBtn(searchValue);
        storeHistory();
    } else {
        alert("You must enter a city into the search field. Please try again!");
    };
};

function createBtn(city) {
    let citySearch = document.createElement("button");
    citySearch.textContent = city;
    citySearch.classList = "btn btn-info btn-block";
    citySearch.setAttribute("data-city", city);
    citySearch.setAttribute("type", "submit");
    citySearch.setAttribute("id", "city-" + city);
    searchHistoryDiv.prepend(citySearch);
};



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




