# Weather Dashboard Web App

## A responsive and interactive weather dashboard, check for realtime weather for for any city you'd like

This weather dashboard utilizes server-side api to fetch data from the openweatherapi and display it for the user.

This project was designed to meet the requests of a user who travels often and wants a tool that can do the following:

- Be able to search for any city
- See the current and future weather conditions for that city
- It should display the name of the city that the user searched
- Display the date, icon representation of weather conditions, temperature, humidity, wind speed, and UV index.
- UV Index displays a value and a color indicator for favorable, moderate, and severe.
- These will display on both the current and future weather conditions.
- A search history function that saves the city and can be clicked on to search for that city again.

## Features

- User arrives at the page and is able to enter the city into an input box and can press enter or click search button.
- The weather for the city that the user searched for is then displayed with a large card with the current conditions.
- Beneath the current conditions is 5 smaller cards that display future conditions.
- The user is shown the city name, the date, icon with the weather representation, temperature, humidity, wind speed, and UV index.
- The UV index is displayed with a value and a clear color indication of whether it is favorable, moderate, or severe conditions.
- Beneath the search field and button, the city that was just searched will display and can be clicked to search again.
- The user can clear the search history by clicking the clear button beneath the search button.

## Tech

Weather Dashboard uses several third-party and server-side api's:

- Bootstrap
- Moment.js
- jQuery

## Conclusion

I changed my approach several times throughout the development of this app, I found the initial layout and functions I created to fetch the information weren't as intuitive as I would like and would get lost when trying to call the fetched information and get the value to display it. I ended up taking out the html elements I initially wrote into the html document to display the information, once I did this and replaced them with containers I was able to get the code to flow better and look more clean, this in turn made it far easier for me to fetch the information and create the element to display the value. A lot of trial and error went into this project but I feel this gives the traveler exactly what they are looking for in an app and I feel like a better developer, this gives me the motivation to continue improving this app moving forward.

 ![Weather Dashboard](https://github.com/rjhelm/weather-dashboard/blob/main/assets/imgs/weather.PNG)

 Link to [Weather Dashboard](https://rjhelm.github.io/weather-dashboard/)

 </br>

 Link to [Git Hub Repository](https://github.com/rjhelm/weather-dashboard)
