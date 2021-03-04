
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
