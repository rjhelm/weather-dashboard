
// Global Variables
let apiKey = "ff0a18ba5cd32a565822484c34ea4036";
let myCity = ""
let fiveForecast = "https://api.openweathermap.org/data/2.5/forecast?4e5dbe7db2b5e9c8b47fa40b691443d5q={city name},{country code}"
let weatherNow = "https://api.openweathermap.org/data/2.5/weather?appid="
let uv = "https://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}"
let userSearch = JSON.parse(localStorage.getItem("userResults")) || [];
let userHistory = document.getElementById("#user-history")
let searchBtn = document.getElementById("#search-btn")

// Search for user input city 
$("#searchBtn").on("click", function(event) {
    event.preventDefault();
    let userCity = $("#userCity").val();
    $("#userCity").val("");
    getTodayWeather(userCity)
    getWeeklyWeather(userCity)
});

// Function used to input user input and save the city to be used later
function userSearchHistory() {
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
function getUserSearchHistory() {
    let userSearchHistory = JSON.parse(localStorage.getItem("userSearchHistory"));
    if (!userSearchHistory) {
        return {
            userHistory: [],
            data: {
                todayWeather: [],
                fiveForecast: []
            }
        };
    } else {
      return userSearchHistory;
    }
}

// Use local storage to produce weather that was searched for
function getTodayWeather() 




// Take user search input and create a variable once we have the value
/* $(document).ready(function() {
    $("#user-input").on("click", function(event) {
        let inputValue = $("#search-city").val()
        userWeather(inputValue)
        console.log(inputValue)
    })
})

// Take the value of user search and send it to userWeather function
function userWeather(cityName) {
    let apiCall = ""
    if (cityName !== "") {
        apiCall = weatherNow + apiKey + "&q=" + cityName
    } else {
        apiCall = weatherNow + apiKey + "&q=" + myCity
    }

    $.ajax({url: fiveForecast, method: "GET"}).then(function(response){
        console.log(response)
        let feelslike = response.main.temp
        feelslike = (feelslike - 273.15) * 1.8 + 32
        feelslike = Math.floor(feelslike)
        myCity = response.name 
        $("#weather-now").append("<div>" + feelslike + "</div>")
        $("#weather-now").append("<div>" + myCity + "</div>")
        fiveForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${myCity}&appid=${apiKey}`

        $.ajax({url: fiveForecast, method: "GET"}).then(function(response) {
            console.log(response)
            let averageTemp = 0
            let pastDate = ""
            let count = 0
            let results = 0
            pastDate = moment().format("MM DD YYYY")
            for (let index = 0; index < response.list.length; index++) {
                let today = moment(response.list[index].dt, "X").format("MM DD YYYY")
                
                let temperature = response.list[index].main.temperature
                temperature = (temperature - 273.15) * 1.8 + 32
                temperature = Math.floor(temperature)

                console.log(currentDate)
                console.log(temperature)

                if (pastDate === today) {
                    averageTemp = averageTemp + temperature
                    count ++
                    pastDate = today
                } else {
                    results = averageTemp / count
                    results = Math.floor(results)
                    console.log("results", results)

                }
            }
            
        })







        let averageTemp = 0
        let priorDay = ""
        let count = 0
        let results = 0
        priorDay = moment().format("MM/DD/YYYY")
        for (let index = 0; index < response.list.length; index++) {
            let currentDate = moment(response.list[index].main.temp)
        }
    })
} */



