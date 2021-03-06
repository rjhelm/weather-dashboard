// Weather Dashboard Web Application //
// Global Variables //
let date = moment().format("ll");
let search = document.querySelector("#search");
let userInput = document.querySelector("#user-input");
let result = document.querySelector("#search-result");
let clearBtn = document.querySelector("#clear-btn");
//Temperature HTML Variables //
const tempDiv = document.createElement("div");
const cityDiv = document.createElement("div");
let cityEl = document.createElement("div");
let tempEl = document.createElement("div");
let humidityEl = document.createElement("div");
let windEl = document.createElement("div");
let uvContainer = document.createElement("div");
let uvEl = document.createElement("h4");
let uvDisplay = document.createElement("div");
// 5 day forecast HTML Variables //
let fiveDay = document.querySelector("#five-day-result");
// Search HTML variables //
let searchCard = document.querySelector("#search-wrapper");
let cityHistory = document.querySelector("#user-search-history");
let cityVar = 1;

// Get weather from openweatherapi based on the user search //
let getWeather = function(city) {
    if (!city) {
        return;
    };
    // Fetch request from openweatherapi //
    let weatherOpen =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial&appid=ff0a18ba5cd32a565822484c34ea4036";
    fetch(weatherOpen).then(function (response) {
        if (!response || !response.ok) {
            throw new Error('There was an error');
        }
        return response.json();
    })
    // Create new elements based on the response data //
    .then(function (response) {
        tempDiv.classList = 'temp-div';
        result.appendChild(tempDiv);
        cityDiv.classList = 'city-div';
        result.appendChild(cityDiv);
        // Display the user's search entry for the city //
        cityEl.innerHTML =
          "<h2 class='created-text'>Current Weather for <span class='font-weight-bold'>" + response.name + "</span><h2><br><img class='icon' src='http://openweathermap.org/img/w/" + response.weather[0].icon + ".png' alt=Current weather icon/><h2 class='font-weight-bold created-text'>" + date + "</h2><br>";
        tempDiv.appendChild(cityEl);
        // Display the fetched current temperature value //
        tempEl.innerHTML =
          "<h3 class='created-text'>Current Temperature:<span class='font-weight-bold'>" + " " + Math.round(response.main.temp) + "&#176F</span></h3><br>";
        tempDiv.appendChild(tempEl);
        // Display the fetched humidity value //
        humidityEl.innerHTML =
          "<h4 class='created-text'>Humidity:<span class='font-weight-bold'>" + " " + response.main.humidity + "%</span></h4>";
        cityDiv.appendChild(humidityEl);
        // Display the fetched wind speed value //
        windEl.innerHTML =
          "<h4 class='created-text'>Wind Speed:<span class='font-weight-bold'>" + " " + Math.round(response.wind.speed) + " MPH</span></h4>"; 
          cityDiv.appendChild(windEl);  
       return fetch(
         "https://api.openweathermap.org/data/2.5/uvi?appid=c83c5006fffeb4aa44a34ffd6a27f135&lat=" +
           response.coord.lat +
           "&lon=" +
           response.coord.lon
       );
    })
    .then(function (uvFetch) {
        return uvFetch.json();
    })
    .then(function (uvResponse) {
        uvContainer.setAttribute("id", "uv-value");
        uvContainer.classList = "created-text uv-container";
        cityDiv.appendChild(uvContainer);
        let uvValue = uvResponse.value;
        uvEl.innerHTML = "UV Index: ";
        uvDisplay.setAttribute("id", "uv-index");
        uvDisplay.innerHTML = uvValue;
        uvContainer.appendChild(uvEl);
        uvContainer.appendChild(uvDisplay);
        // UV Index results and gives a response based on how high the Index is //
        if (uvResponse.value <= 2) {
            document.querySelector("#uv-index").classList = "uv-result rounded bg-success";
        } else if (uvResponse.value >= 2 && uvResponse.value <= 7) { 
            document.querySelector("#uv-index").classList = "uv-result rounded bg-warning";
        } else if (uvResponse.value < 7) {
            document.querySelector("#uv-index").classList = "uv-result rounded bg-danger";    
        }
        return fetch(
          "https://api.openweathermap.org/data/2.5/onecall?lat=" + uvResponse.lat + "&lon=" + uvResponse.lon + "&appid=c83c5006fffeb4aa44a34ffd6a27f135&units=imperial"
        );
    })
    .then(function (fiveDayResponse) {
        return fiveDayResponse.json();
    })
    .then(function (fiveDayResponse) {
        for (let i = 1; i < 6; i++) {
            let fiveDayEl = document.createElement("div");
            fiveDayEl.classList = "five-card card-body rounded-lg bg-dark border-dark"
            fiveDay.appendChild(fiveDayEl);

            let dateDiv = document.createElement("div");
            dateDiv.classList = "created-text card-title";
            let forecastDate = moment.utc(fiveDayResponse.daily[i].dt * 1000).format("MM/DD/YYYY");
            dateDiv.innerHTML = "<h4 class='font-weight-bold'>" + forecastDate + "</h4>";
            fiveDayEl.appendChild(dateDiv);
                
            let iconDiv = document.createElement("div");
            iconDiv.innerHTML = "<img src='http://openweathermap.org/img/w/" + fiveDayResponse.daily[i].weather[0].icon + ".png' class='five-day-icon' alt=Current weather icon/>";
            fiveDayEl.appendChild(iconDiv);

            let tempDiv = document.createElement("div");
            tempDiv.classList = "card-text created-text";
            tempDiv.innerHTML = "<h5>Day Temp:<span>" + " " + Math.round(fiveDayResponse.daily[i].temp.day) + "&#176F</span></h5>" + "<h5>Night Temp:<span>" + " " + Math.round(fiveDayResponse.daily[i].temp.night) + " &#176F</span></h5>";
            fiveDayEl.appendChild(tempDiv);

            let humidityDiv = document.createElement("div");
            humidityDiv.classList = "card-text created-text";
            humidityDiv.innerHTML = "<h5>Humidity:<span>" + " " + fiveDayResponse.daily[i].humidity + "%</span></h5>";
            fiveDayEl.appendChild(humidityDiv);
        }
    })
    .catch(function (error){
        clearResults();
        alert(error.message);
        document.querySelector("#user-input").value = "";
    }); 
};

// Search Function that lets the user know that they must enter a value //
let searchWeather = function(event) {
    event.preventDefault();
    let userValue = userInput.value.trim().toUpperCase();
    if (userValue) {
        getWeather(userValue);
        generateBtn(userValue);
        keepUserHistory();
    } else {
        alert("You must enter a city into the search field. Please try again!");
    };
};

// Loads the search history from local storage //
function generateUserHistory() {
    if (localStorage.getItem("pastCities")) {
        let pastCity = JSON.parse(localStorage.getItem("pastCities"));
        for (let i = 0; i < pastCity.length; i++) {
            generateBtn(pastCity[i]);
        }
    };
    for (i = 0; i < document.getElementsByClassName("btn").length; i++) {
        document.getElementsByClassName("btn")[i].addEventListener('click', function () {
            let userClick = this.getAttribute("user-city");
            getWeather(userClick);
            
            clearResults();
        });
    }
};

// Keep data that user pulls so the city can easily be searched again //
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

// Search button for user to search for the city weather //
function generateBtn(city) {
    let userCity = document.createElement("button");
    userCity.textContent = city;
    userCity.classList = "btn btn-dark btn-block";
    userCity.setAttribute("user-city", city);
    userCity.setAttribute("type", "submit");
    userCity.setAttribute("id", "city-" + city);
    cityHistory.prepend(userCity);
};

// Give user option to clear their search history //
function clearPastCities() {
    let pastCities = JSON.parse(localStorage.getItem("pastCities"));
    for (let i = 0; i < pastCities.length; i++) {
        document.getElementById("city-" + pastCities[i]).remove();
    }
    localStorage.clear("pastCities");
};

// Previously searched info will be removed //
let clearResults = function () {
    cityEl.remove();
    fiveDay.innerHTML = "";
    uvContainer.remove();
    tempEl.remove();
    humidityEl.remove();
    windEl.remove();
};
// Event Listeners for user search and clear history //
clearBtn.addEventListener("click", clearPastCities);
search.addEventListener("submit", searchWeather);

generateUserHistory();


