
// Global Variables
let apiKey = "ff0a18ba5cd32a565822484c34ea4036";
let myCity = "herriman"
let fiveForecast = "https://api.openweathermap.org/data/2.5/forecast?4e5dbe7db2b5e9c8b47fa40b691443d5q={city name},{country code}"
let weatherNow = "https://api.openweathermap.org/data/2.5/weather?appid="
let uv = "https://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}"
let userSearch = JSON.parse(localStorage.getItem("userResults")) || [];

// Take user search input and create a variable once we have the value
$(document).ready(function() {
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
        feelslike = (feelslike - 273.14) * 1.8 + 32
        feelslike = Math.floor(feelslike)
        myCity = response.name 
        $("#weather-now").append("<div>" + feelslike + "</div>")
        $("#weather-now").append("<div>" + myCity + "</div>")
        fiveForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${myCity}&appid=${apiKey}`

        






        let averageTemp = 0
        let priorDay = ""
        let count = 0
        let results = 0
        priorDay = moment().format("MM/DD/YYYY")
        for (let index = 0; index < response.list.length; index++) {
            let currentDate = moment(response.list[index].main.temp)
        }
    })
}

