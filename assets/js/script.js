// Weather Dashboard Web Application
// Global Variables
// let apiKey = "ff0a18ba5cd32a565822484c34ea4036";
let date = moment().format("ll");
let search = document.querySelector("#search");
let userInput = document.querySelector("#search-input");
let result = document.querySelector("#search-result");
let clearBtn = document.querySelector("clear-btn");

//Temperature HTML Variables
const tempDiv = document.createElement("div");
const cityDiv = document.createElement("div");
let cityEl = document.createElement("div");
let tempEl = document.createElement("div");
let humidityEl = document.createElement("div");
let windEl = document.createElement("div");
let uvContainer = document.createElement("div");
let uvEl = document.createElement("h4");
let uvDisplay = document.createElement("div");

// 5 day forecast HTML Variables
let fiveDay = document.querySelector("#five-day");

// Search HTML variables
let searchCard = document.querySelector("#search-wrapper");
let cityHistory = document.querySelector("#user-search-history");
let cityVar = 1;

// Get weather from openweatherapi based on the user search
let getWeather = function(city) {
    if (!city) {
        return;
    };
    // Fetch request from openweatherapi
    let weatherOpen =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial&appidff0a18ba5cd32a565822484c34ea4036";
    fetch(weatherOpen).then(function (response) {
        if (!response || !response.ok) {
            throw new Error('There was an error');
        }
        return response.json();
    })

    // Create new elements based on the response data
    .then(function (response) {
        tempDiv.classList = 'temp-div';
        responseContainer.appendChild(tempDiv);
        cityDiv.classList = 'detail-div';
        responseContainer.appendChild(cityDiv);
        // Display the user's search entry for the city
        cityEl.innerHTML =
          "<h2 class='secondary-text'>Current Weather for <span class='font-weight-bold'>" + response.name + 
          "</span><h2><br><img class='icon' src='http://openweathermap.org/img/w/" + response.weather[0].icon +
          ".png' alt=Current weather icon/><h2 class='font-weight-bold secondary-text'>" + date + "</h2><br>";
        tempDiv.appendChild(cityEl);
        // Display the fetched current temperature value
        tempEl.innerHTML =
          "<h3 class='secondary-text'>Current Temperature:<span class='font-weight-bold'>" +
          " " +
          Math.round(response.main.temp) +
          "&#176F</span></h3><br>";
        tempDiv.appendChild(cityTempEl);
        // Display the fetched humidity value
        humidityEl.innerHTML =
          "<h4 class='secondary-text'>Humidity:<span class='font-weight-bold'>" +
          " " +
          response.main.humidity +
          "%</span></h4>";
        cityDiv.appendChild(humidityEl);
        // Display the fetched wind speed value
        windEl.innerHTML =
          "<h4 class='secondary-text'>Wind Speed:<span class='font-weight-bold'>" +
          " " +
          Math.round(response.wind.speed) +
          " MPH</span></h4>";
        cityDiv.appendChild(windEl);  

        return fetch("https://api.openweathermap.org/data/2.5/uvi?appid=ff0a18ba5cd32a565822484c34ea4036at=" + response.coord.lat + "&lon=" + response.coord.lon);
    })
    .then(function (uvFetch) {
        return uvFetch.json();
    })
    .then(function (uvResponse) {
        uvContainer.setAttribute("id", "uv-value");
        uvContainer.classList = "secondary-text uv-class";
        cityDiv.appendChild(uvContainer);
        let uvValue = uvResponse.value;
        uvEl.innerHTML = "UV Index: ";
        uvDisplay.setAttribute("id", "uv-index");
        uvDisplay.innerHTML = uvValue;
        uvContainer.appendChild(uvEl);
        uvContainer.appendChild(uvDisplay);
        // UV Index results and gives a response based on how high the Index is
        if (uvResponse.value <= 2) {
            document.querySelector("#uv-index").classList = "uv-result rounded bg-success";
        } else if (uvResponse.value >= 2 && uvResponse.value <= 7) { 
            document.querySelector("#uv-index").classList = "uv-result rounded bg-warning";
        } else if (uvResponse.value < 7) {
            document.querySelector("#uv-index").classList = "uv-result rounded bg-danger";    
        }
        return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + uvResponse.lat + "&lon=" + uvResponse.lon + "&appid=ff0a18ba5cd32a565822484c34ea4036&units=imperial");
    })
    .then(function (fiveDayResponse) {
        return fiveDayResponse.json();
    })
    .then(function (fiveDayResponse) {
        for (let i = 1; i < 6; i++) {
            let forecastEl = document.createElement("div");
            forecastEl.classList = "forecast-card card-body rounded-md border-dark bg-info text-light"
            fiveDay.appendChild(forecastEl);

            let dateDiv = document.createElement("div");
            dateDiv.classList = "secondary-text card-title";
            let forecastDate = moment.utc(fiveDayResponse.daily[i].dt * 1000).format("MM/DD/YYYY");
            dateDiv.innerHTML = "<h4 class='font-weight-bold>" + forecastDate + "</h4>";
            forecastEl.appendChild(dateDiv);
                
            let iconDiv = document.createElement("div");
            iconDiv.innerHTML = "<img src='http://openweathermap.org/img/w/" + fiveDayResponse.daily[i].weather[0].icon + ".png' class='forecast-icon' alt=Current weather icon/>";
            forecastEl.appendChild(iconDiv);

            let tempDiv = document.createElement("div");
            tempDiv.classList = "card-text secondary-text";
            tempDiv.innerHTML = "<h5>Day Temp:<span>" + " " + Math.round(fiveDayResponse.daily[i].temp.day) + "&#176F</span></h5>" + "<h5>Night Temp:<span>" + " " + Math.round(fiveDayResponse.daily[i].temp.night) + " &#176F</span></h5>";
            forecastEl.appendChild(tempDiv);

            let humidityDiv = document.createElement("div");
            humidityDiv.classList = "card-text secondary-text";
            humidityDiv.innerHTML = "<h5>Humidity:<span>" + " " + fiveDayResponse.daily[i].humidity + "%</span></h5>";
            forecastEl.appendChild(humidityDiv);
        }
    })
    .catch(function (error){
        clearResults();
        alert(error.message);
        document.querySelector("#user-input").value = "";
    }); 
};

// Search Function that lets the user know that they must enter a value 
let searchWeather = function(event) {
    event.preventDefault();
    let searchValue = searchBar.value.trim().toUpperCase();
    if (searchValue) {
        getWeather(searchValue);
        generateBtn(searchValue);
        keepUserHistory();
    } else {
        alert("You must enter a city into the search field. Please try again!");
    };
};

// Search button for user to search for the city weather
function generateBtn(city) {
    let userCity = document.createElement("button");
    userCity.textContent = city;
    userCity.classList = "btn btn-info btn-block";
    userCity.setAttribute("data-city", city);
    userCity.setAttribute("type", "submit");
    userCity.setAttribute("id", "city-" + city);
    cityHistory.prepend(userCity);
};

// Keep data that user pulls so the city can easily be searched again
function keepUserHistory() {
    let userSearch = document.querySelector("#user-input").value.trim().toUpperCase();
    if (!userSearch) {
        return;
    };
    let pastCity = JSON.parse(localStorage.getItem("pastCities")) || [];
    pastCity.push(userSearch);
    localStorage.setItem("pastCities", JSON.stringify(pastCity));
    document.querySelector("#user-input").value = "";
    clearResults();
};

// Loads the search history from local storage
function generateUserHistory() {
    if (localStorage.getItem("pastCities")) {
        let pastCity = JSON.parse(localStorage.getItem("pastCities"));
        for (let i = 0; i < pastCity.length; i++) {
            generateBtn(pastCity[i]);
        }
    };
    for (i = 0; i < document.getElementsByClassName("btn").length; i++) {
        document.getElementsByClassName("btn")[i].addEventListener("click", function () {
            let userClick = this.getAttribute("data-city");
            getWeather(userClick);
            console.log(userClick);
            clearResults();
        });
    }
};

// Give user option to clear their search history
function removePastCities() {
    let pastCities = JSON.parse(localStorage.getItem("pastCities"));
    for (let i = 0; i < pastCities.length; i++) {
        document.getElementById("city-" + pastCities[i]).remove();
    }
    localStorage.clear("pastCities");
};

// Previously searched info will be removed
let clearResults = function () {
    cityEl.remove();
    fiveDay.innerHTML = "";
    uvContainer.remove();
    tempEl.remove();
    humidityEl.remove();
    windEl.remove();
};

searchHandler.addEventListener("submit", searchWeather);
clearBtn.addEventListener("click", removePastCities);

generateUserHistory();


